const STAFF_PIN = "EDEN2026";
const config = window.EDEN_SUPABASE_CONFIG || {};
const client = window.supabase && config.url && config.key
  ? window.supabase.createClient(config.url, config.key)
  : null;
const waiterTable = config.waiterTable || "waiter_calls";

const login = document.querySelector("[data-login]");
const board = document.querySelector("[data-board]");
const pinInput = document.querySelector("[data-pin-input]");
const unlockButton = document.querySelector("[data-unlock-staff]");
const pinError = document.querySelector("[data-pin-error]");
const statusBadge = document.querySelector("[data-status]");
const activeCount = document.querySelector("[data-active-count]");
const list = document.querySelector("[data-call-list]");
const emptyState = document.querySelector("[data-empty-state]");
const testSoundButton = document.querySelector("[data-test-sound]");
const orderModal = document.querySelector("[data-order-modal]");
const modalTitle = document.querySelector("[data-modal-title]");
const modalMeta = document.querySelector("[data-modal-meta]");
const modalItems = document.querySelector("[data-modal-items]");
const modalClose = document.querySelector("[data-modal-close]");
const modalHandle = document.querySelector("[data-modal-handle]");

const calls = new Map();
const unseenTables = new Set();
let audioContext = null;
let alertTimer = null;
let alertGain = null;
let alertMelodyToken = 0;
let realtimeChannel = null;
let selectedTableKey = null;
let usesLegacyOrderPayload = false;
let audioPrimed = false;

const BEETHOVEN_ALERT_PHRASE = [
  [329.63, 0.42], [329.63, 0.42], [349.23, 0.42], [392, 0.42],
  [392, 0.42], [349.23, 0.42], [329.63, 0.42], [293.66, 0.42],
  [261.63, 0.42], [261.63, 0.42], [293.66, 0.42], [329.63, 0.42],
  [329.63, 0.62], [293.66, 0.2], [293.66, 0.72], [0, 0.26],
  [329.63, 0.42], [329.63, 0.42], [349.23, 0.42], [392, 0.42],
  [392, 0.42], [349.23, 0.42], [329.63, 0.42], [293.66, 0.42],
  [261.63, 0.42], [261.63, 0.42], [293.66, 0.42], [329.63, 0.42],
  [293.66, 0.62], [261.63, 0.2], [261.63, 0.86], [0, 0.36]
];

function tableKey(call) {
  return call.table_number ? String(call.table_number) : "guest";
}

function tableLabelFromKey(key) {
  return key === "guest" ? "Guest" : `Table ${key}`;
}

function timeLabel(value) {
  return new Intl.DateTimeFormat(undefined, {
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit"
  }).format(new Date(value));
}

function setStatus(text, live = false) {
  statusBadge.textContent = text;
  statusBadge.classList.toggle("is-live", live);
}

function primeAudioOutput() {
  if (!audioContext || audioPrimed) {
    return;
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(523.25, now);
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.012, now + 0.01);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
  oscillator.connect(gain).connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + 0.09);
  audioPrimed = true;
}

function unlockAudio(shouldPrime = false) {
  if (!audioContext) {
    const AudioContextConstructor = window.AudioContext || window.webkitAudioContext;
    try {
      audioContext = new AudioContextConstructor({ latencyHint: "interactive" });
    } catch {
      audioContext = new AudioContextConstructor();
    }
  }
  if (audioContext.state === "suspended") {
    audioContext.resume().then(() => {
      if (shouldPrime) {
        primeAudioOutput();
      }
    }).catch(() => {
      setStatus("Tap Test Sound");
    });
  } else if (shouldPrime) {
    primeAudioOutput();
  }
}

function stopAlertMelody() {
  alertMelodyToken += 1;
  if (alertTimer) {
    window.clearTimeout(alertTimer);
    alertTimer = null;
  }
  if (audioContext && alertGain) {
    const now = audioContext.currentTime;
    alertGain.gain.cancelScheduledValues(now);
    alertGain.gain.setTargetAtTime(0.0001, now, 0.045);
    const gainToDisconnect = alertGain;
    window.setTimeout(() => gainToDisconnect.disconnect(), 260);
    alertGain = null;
  }
}

function scheduleTone(frequency, start, duration, output) {
  if (!frequency) {
    return;
  }

  const oscillator = audioContext.createOscillator();
  const harmony = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const end = start + duration;

  oscillator.type = "sine";
  harmony.type = "triangle";
  oscillator.frequency.setValueAtTime(frequency, start);
  harmony.frequency.setValueAtTime(frequency * 2, start);
  gain.gain.setValueAtTime(0.0001, start);
  gain.gain.exponentialRampToValueAtTime(0.2, start + 0.035);
  gain.gain.setValueAtTime(0.2, Math.max(start + 0.04, end - 0.12));
  gain.gain.exponentialRampToValueAtTime(0.0001, end);

  oscillator.connect(gain);
  harmony.connect(gain);
  gain.connect(output);
  oscillator.start(start);
  harmony.start(start);
  oscillator.stop(end + 0.05);
  harmony.stop(end + 0.05);
}

function playAlertMelody() {
  unlockAudio();
  if (!audioContext) {
    return;
  }

  stopAlertMelody();
  const melodyToken = alertMelodyToken;
  alertGain = audioContext.createGain();
  alertGain.gain.setValueAtTime(0.82, audioContext.currentTime);
  alertGain.connect(audioContext.destination);

  const now = audioContext.currentTime;
  let cursor = now + 0.04;
  const endTime = now + 60;

  while (cursor < endTime) {
    BEETHOVEN_ALERT_PHRASE.forEach(([frequency, duration]) => {
      if (cursor < endTime) {
        scheduleTone(frequency, cursor, Math.min(duration, endTime - cursor), alertGain);
      }
      cursor += duration;
    });
  }

  alertTimer = window.setTimeout(() => {
    alertTimer = null;
    if (melodyToken === alertMelodyToken && unseenTables.size > 0) {
      playAlertMelody();
    }
  }, 60000);
}

function updateAlertLoop() {
  if (unseenTables.size > 0) {
    if (!alertTimer) {
      playAlertMelody();
    }
    return;
  }

  stopAlertMelody();
}

function parseOrderItems(call) {
  if (Array.isArray(call.order_items)) {
    return call.order_items;
  }
  if (typeof call.order_items === "string" && call.order_items.trim()) {
    try {
      const parsed = JSON.parse(call.order_items);
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }
  if (typeof call.page_url === "string") {
    const marker = "#eden_order=";
    const markerIndex = call.page_url.indexOf(marker);
    if (markerIndex >= 0) {
      try {
        const rawOrder = call.page_url.slice(markerIndex + marker.length);
        const parsed = JSON.parse(decodeURIComponent(rawOrder));
        return Array.isArray(parsed) ? parsed : [parsed];
      } catch {
        return [];
      }
    }
  }
  return [];
}

function normalizeItem(item) {
  return {
    name: String(item?.name || "Menu item"),
    note: String(item?.note || ""),
    quantity: Math.max(1, Number.parseInt(item?.quantity || 1, 10) || 1),
    image: String(item?.image || "")
  };
}

function buildTableGroups() {
  const groups = new Map();
  Array.from(calls.values())
    .filter((call) => call.status === "new")
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .forEach((call) => {
      const key = tableKey(call);
      const group = groups.get(key) || {
        key,
        calls: [],
        itemCount: 0,
        firstAt: call.created_at,
        lastAt: call.created_at
      };
      const items = parseOrderItems(call).map(normalizeItem);
      group.calls.push({ ...call, items });
      group.itemCount += Number(call.order_total || items.reduce((sum, item) => sum + item.quantity, 0));
      group.firstAt = new Date(call.created_at) < new Date(group.firstAt) ? call.created_at : group.firstAt;
      group.lastAt = new Date(call.created_at) > new Date(group.lastAt) ? call.created_at : group.lastAt;
      groups.set(key, group);
    });

  return Array.from(groups.values())
    .sort((a, b) => new Date(b.lastAt) - new Date(a.lastAt));
}

function previewItems(group) {
  const merged = new Map();
  group.calls.forEach((call) => {
    call.items.forEach((item) => {
      const key = `${item.name}|${item.note}`;
      const current = merged.get(key) || { ...item, quantity: 0 };
      current.quantity += item.quantity;
      merged.set(key, current);
    });
  });
  return Array.from(merged.values());
}

function acknowledgeTable(key) {
  unseenTables.delete(key);
  updateAlertLoop();
  renderCalls();
}

function openOrderDetails(key, shouldAcknowledge = true) {
  const group = buildTableGroups().find((candidate) => candidate.key === key);
  if (!group) {
    return;
  }

  selectedTableKey = key;
  if (shouldAcknowledge) {
    acknowledgeTable(key);
  }
  modalTitle.textContent = tableLabelFromKey(key);
  modalMeta.textContent = `${group.itemCount || 0} item${group.itemCount === 1 ? "" : "s"} - latest at ${timeLabel(group.lastAt)}`;
  modalItems.replaceChildren();

  group.calls.forEach((call) => {
    const block = document.createElement("section");
    const heading = document.createElement("h3");
    heading.textContent = `Order sent at ${timeLabel(call.created_at)}`;
    block.className = "order-batch";
    block.append(heading);

    if (call.items.length === 0) {
      const empty = document.createElement("p");
      empty.className = "order-empty";
      empty.textContent = "No basket items were attached to this call.";
      block.append(empty);
    } else {
      call.items.forEach((item) => {
        const row = document.createElement("article");
        const copy = document.createElement("div");
        const name = document.createElement("strong");
        const note = document.createElement("small");
        const quantity = document.createElement("span");

        row.className = "order-line";
        name.textContent = item.name;
        note.textContent = item.note || "No special instructions";
        quantity.textContent = `x${item.quantity}`;
        copy.append(name, note);
        row.append(copy, quantity);
        block.append(row);
      });
    }

    modalItems.append(block);
  });

  orderModal.hidden = false;
}

function closeOrderDetails() {
  orderModal.hidden = true;
}

function attachSwipeToHandle(row, key) {
  let startX = 0;
  let currentX = 0;
  let isTracking = false;

  row.addEventListener("pointerdown", (event) => {
    if (event.target.closest("button")) {
      return;
    }
    startX = event.clientX;
    currentX = startX;
    isTracking = true;
    row.setPointerCapture(event.pointerId);
  });

  row.addEventListener("pointermove", (event) => {
    if (!isTracking) {
      return;
    }
    currentX = event.clientX;
    const delta = Math.max(0, Math.min(140, currentX - startX));
    row.style.transform = `translateX(${delta}px)`;
    row.classList.toggle("is-swiping", delta > 32);
  });

  row.addEventListener("pointerup", () => {
    if (!isTracking) {
      return;
    }
    const delta = currentX - startX;
    isTracking = false;
    row.style.transform = "";
    row.classList.remove("is-swiping");
    if (delta > 96) {
      markTableHandled(key);
    }
  });

  row.addEventListener("pointercancel", () => {
    isTracking = false;
    row.style.transform = "";
    row.classList.remove("is-swiping");
  });
}

function renderCalls() {
  const groups = buildTableGroups();
  activeCount.textContent = groups.length;
  emptyState.hidden = groups.length > 0;
  list.replaceChildren();

  groups.forEach((group) => {
    const row = document.createElement("li");
    const copy = document.createElement("div");
    const topLine = document.createElement("div");
    const title = document.createElement("strong");
    const badge = document.createElement("span");
    const meta = document.createElement("small");
    const preview = document.createElement("p");
    const actions = document.createElement("div");
    const open = document.createElement("button");
    const handled = document.createElement("button");
    const items = previewItems(group);
    const isNew = unseenTables.has(group.key);

    row.className = `table-ticket${isNew ? " is-new" : ""}`;
    row.dataset.tableKey = group.key;
    title.textContent = tableLabelFromKey(group.key);
    badge.className = "ticket-badge";
    badge.textContent = `${group.itemCount || 0} item${group.itemCount === 1 ? "" : "s"}`;
    meta.textContent = `Latest order ${timeLabel(group.lastAt)}`;
    preview.className = "ticket-preview";
    preview.textContent = items.length
      ? items.slice(0, 3).map((item) => `${item.quantity}x ${item.name}`).join(" - ")
      : "Waiter call without basket items";

    open.type = "button";
    open.textContent = "Open Order";
    open.addEventListener("click", (event) => {
      event.stopPropagation();
      openOrderDetails(group.key);
    });

    handled.type = "button";
    handled.className = "ghost-button";
    handled.textContent = "Entered";
    handled.addEventListener("click", (event) => {
      event.stopPropagation();
      markTableHandled(group.key);
    });

    topLine.className = "ticket-topline";
    topLine.append(title, badge);
    copy.append(topLine, meta, preview);
    actions.className = "ticket-actions";
    actions.append(open, handled);
    row.append(copy, actions);
    row.addEventListener("click", () => openOrderDetails(group.key));
    attachSwipeToHandle(row, group.key);
    list.appendChild(row);
  });
}

function upsertCall(call, shouldAlert = false) {
  calls.set(call.id, call);
  const key = tableKey(call);
  if (shouldAlert && call.status === "new") {
    unseenTables.add(key);
  }
  if (call.status !== "new") {
    const stillActive = Array.from(calls.values()).some((candidate) => (
      candidate.status === "new" && tableKey(candidate) === key
    ));
    if (!stillActive) {
      unseenTables.delete(key);
    }
  }
  renderCalls();
  if (selectedTableKey === key && !orderModal.hidden) {
    const stillOpen = buildTableGroups().some((group) => group.key === key);
    if (stillOpen) {
      openOrderDetails(key, false);
    } else {
      closeOrderDetails();
      selectedTableKey = null;
    }
  }
  updateAlertLoop();
}

async function loadCalls() {
  if (!client) {
    setStatus("Not configured");
    return false;
  }

  let { data, error } = await client
    .from(waiterTable)
    .select("id, table_number, status, order_items, order_total, order_summary, page_url, created_at, handled_at")
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(100);

  if (error) {
    usesLegacyOrderPayload = /order_|schema|column/i.test(error.message || "");
  }

  if (usesLegacyOrderPayload) {
    const legacyResult = await client
      .from(waiterTable)
      .select("id, table_number, status, page_url, user_agent, created_at, handled_at")
      .eq("status", "new")
      .order("created_at", { ascending: false })
      .limit(100);
    data = legacyResult.data;
    error = legacyResult.error;
  }

  if (error) {
    console.error("Could not load waiter calls", error);
    setStatus("Setup needed");
    return false;
  }

  calls.clear();
  unseenTables.clear();
  data.forEach((call) => {
    calls.set(call.id, call);
    unseenTables.add(tableKey(call));
  });
  renderCalls();
  updateAlertLoop();
  return true;
}

async function markTableHandled(key) {
  if (!client) {
    return;
  }
  const ids = buildTableGroups()
    .find((group) => group.key === key)
    ?.calls.map((call) => call.id) || [];
  if (ids.length === 0) {
    return;
  }

  setStatus("Saving");
  const handledAt = new Date().toISOString();
  const { error } = await client
    .from(waiterTable)
    .update({ status: "handled", handled_at: handledAt })
    .in("id", ids);

  if (error) {
    console.error("Could not mark table handled", error);
    setStatus("Save failed");
    return;
  }

  ids.forEach((id) => {
    const current = calls.get(id);
    if (current) {
      calls.set(id, { ...current, status: "handled", handled_at: handledAt });
    }
  });
  unseenTables.delete(key);
  if (selectedTableKey === key) {
    closeOrderDetails();
    selectedTableKey = null;
  }
  renderCalls();
  updateAlertLoop();
  setStatus("Live", true);
}

function subscribeToCalls() {
  if (!client) {
    return;
  }

  if (realtimeChannel) {
    client.removeChannel(realtimeChannel);
  }

  realtimeChannel = client
    .channel("eden-waiter-calls")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: waiterTable }, (payload) => {
      upsertCall(payload.new, true);
    })
    .on("postgres_changes", { event: "UPDATE", schema: "public", table: waiterTable }, (payload) => {
      upsertCall(payload.new, false);
    })
    .subscribe((status) => {
      if (status === "SUBSCRIBED") {
        setStatus("Live", true);
      } else if (status === "CHANNEL_ERROR" || status === "TIMED_OUT") {
        setStatus("Reconnecting");
      } else {
        setStatus(status.toLowerCase());
      }
    });
}

async function openBoard() {
  const entered = pinInput.value.trim();
  if (entered !== STAFF_PIN) {
    pinError.hidden = false;
    return;
  }

  unlockAudio(true);
  pinError.hidden = true;
  login.hidden = true;
  board.hidden = false;
  const ready = await loadCalls();
  if (ready) {
    subscribeToCalls();
  }
}

unlockButton.addEventListener("click", openBoard);
pinInput.addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    openBoard();
  }
});
testSoundButton.addEventListener("click", () => {
  playAlertMelody();
});
modalClose.addEventListener("click", closeOrderDetails);
modalHandle.addEventListener("click", () => {
  if (selectedTableKey) {
    markTableHandled(selectedTableKey);
  }
});
orderModal.addEventListener("click", (event) => {
  if (selectedTableKey && unseenTables.has(selectedTableKey)) {
    acknowledgeTable(selectedTableKey);
  }
  if (event.target === orderModal) {
    closeOrderDetails();
  }
});
