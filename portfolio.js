const projectButtons = document.querySelectorAll("[data-project]");
const projectCards = document.querySelectorAll("[data-project-card]");
const revealItems = document.querySelectorAll(".reveal");
const tiltCard = document.querySelector("[data-tilt-card]");

projectButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const index = Number(button.dataset.project);
    projectButtons.forEach((item) => item.classList.toggle("is-active", item === button));
    projectCards.forEach((card, cardIndex) => {
      card.classList.toggle("is-active", cardIndex === index);
    });
  });
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("is-visible");
    }
  });
}, { threshold: 0.18 });

revealItems.forEach((item) => observer.observe(item));

if (tiltCard) {
  tiltCard.addEventListener("pointermove", (event) => {
    const rect = tiltCard.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width - 0.5;
    const y = (event.clientY - rect.top) / rect.height - 0.5;
    tiltCard.style.transform = `perspective(1200px) rotateX(${5 - y * 5}deg) rotateY(${-8 + x * 6}deg) rotateZ(-1.5deg)`;
  });

  tiltCard.addEventListener("pointerleave", () => {
    tiltCard.style.transform = "";
  });
}
