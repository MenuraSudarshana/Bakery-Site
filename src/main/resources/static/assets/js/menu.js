document.addEventListener("DOMContentLoaded", () => {
  const categoryCards = document.querySelectorAll(".category-card");
  categoryCards.forEach((card, index) => {
    card.style.opacity = "0";
    card.style.transform = "translateY(16px)";
    setTimeout(() => {
      card.style.transition = "transform 260ms ease, opacity 260ms ease";
      card.style.opacity = "1";
      card.style.transform = "translateY(0)";
    }, 90 * (index + 1));
  });

  const cards = document.querySelectorAll(".preview-card");
  cards.forEach((card, index) => {
    setTimeout(() => {
      card.classList.add("show");
    }, 120 * (index + 1));
  });
});
