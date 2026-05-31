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

const calls = new Map();
let audioContext = null;
let realtimeChannel = null;

function tableLabel(call) {
  return call.table_number ? `Table ${call.table_number}` : "Guest";
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

function unlockAudio() {
  if (!audioContext) {
    audioContext = new (window.AudioContext || window.webkitAudioContext)();
  }
  if (audioContext.state === "suspended") {
    audioContext.resume();
  }
}

function playAlert() {
  unlockAudio();
  if (!audioContext) {
    return;
  }

  const now = audioContext.currentTime;
  [0, 0.18, 0.36].forEach((offset) => {
    const oscillator = audioContext.createOscillator();
    const gain = audioContext.createGain();
    oscillator.type = "sine";
    oscillator.frequency.setValueAtTime(880, now + offset);
    oscillator.frequency.exponentialRampToValueAtTime(1320, now + offset + 0.08);
    gain.gain.setValueAtTime(0.0001, now + offset);
    gain.gain.exponentialRampToValueAtTime(0.22, now + offset + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + offset + 0.14);
    oscillator.connect(gain).connect(audioContext.destination);
    oscillator.start(now + offset);
    oscillator.stop(now + offset + 0.16);
  });
}

function renderCalls() {
  const activeCalls = Array.from(calls.values())
    .filter((call) => call.status === "new")
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  activeCount.textContent = activeCalls.length;
  emptyState.hidden = activeCalls.length > 0;
  list.replaceChildren();

  activeCalls.forEach((call) => {
    const row = document.createElement("li");
    const copy = document.createElement("div");
    const title = document.createElement("strong");
    const meta = document.createElement("small");
    const handled = document.createElement("button");

    title.textContent = tableLabel(call);
    meta.textContent = `Called at ${timeLabel(call.created_at)}`;
    handled.type = "button";
    handled.textContent = "Handled";
    handled.addEventListener("click", () => markHandled(call.id, handled));

    copy.append(title, meta);
    row.append(copy, handled);
    list.appendChild(row);
  });
}

function upsertCall(call, shouldAlert = false) {
  calls.set(call.id, call);
  renderCalls();
  if (shouldAlert && call.status === "new") {
    playAlert();
  }
}

async function loadCalls() {
  if (!client) {
    setStatus("Not configured");
    return false;
  }

  const { data, error } = await client
    .from(waiterTable)
    .select("id, table_number, status, created_at, handled_at")
    .eq("status", "new")
    .order("created_at", { ascending: false })
    .limit(50);

  if (error) {
    console.error("Could not load waiter calls", error);
    setStatus("Setup needed");
    return false;
  }

  calls.clear();
  data.forEach((call) => calls.set(call.id, call));
  renderCalls();
  return true;
}

async function markHandled(id, button) {
  if (!client) {
    return;
  }
  button.disabled = true;
  button.textContent = "Saving...";
  const { error } = await client
    .from(waiterTable)
    .update({ status: "handled", handled_at: new Date().toISOString() })
    .eq("id", id);

  if (error) {
    console.error("Could not mark waiter call handled", error);
    button.disabled = false;
    button.textContent = "Handled";
    setStatus("Save failed");
    return;
  }

  const current = calls.get(id);
  if (current) {
    current.status = "handled";
    current.handled_at = new Date().toISOString();
    calls.set(id, current);
  }
  renderCalls();
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

  unlockAudio();
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
testSoundButton.addEventListener("click", playAlert);
