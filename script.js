const header = document.querySelector("[data-header]");
const year = document.querySelector("[data-year]");
const revealItems = document.querySelectorAll(".reveal");

// Collez ici l’URL Amazon dès que la page du livre est disponible.
// Exemple : const PURCHASE_URL = "https://www.amazon.fr/dp/XXXXXXXXXX";
const PURCHASE_URL = "";
const RELEASE_DATE = new Date("2026-10-06T00:00:00+02:00");

if (year) {
  year.textContent = new Date().getFullYear().toString();
}

const updateHeader = () => {
  header?.classList.toggle("is-scrolled", window.scrollY > 24);
};

updateHeader();
window.addEventListener("scroll", updateHeader, { passive: true });

if ("IntersectionObserver" in window) {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: "0px 0px -6% 0px" },
  );

  revealItems.forEach((item) => observer.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const countdown = document.querySelector("[data-countdown]");
const countdownStatus = document.querySelector("[data-countdown-status]");
const purchaseLinks = document.querySelectorAll("[data-purchase]");
const purchaseLabels = document.querySelectorAll("[data-purchase-label]");

const configurePurchaseLinks = (released = false) => {
  const label = released ? "Commander le livre" : "Précommander le livre";

  purchaseLabels.forEach((item) => {
    item.textContent = PURCHASE_URL ? label : "Précommande bientôt ouverte";
  });

  purchaseLinks.forEach((link) => {
    if (!PURCHASE_URL) {
      link.classList.add("is-disabled");
      link.setAttribute("href", "#");
      link.setAttribute("aria-disabled", "true");
      link.removeAttribute("target");
      link.removeAttribute("rel");
      return;
    }

    link.classList.remove("is-disabled");
    link.setAttribute("href", PURCHASE_URL);
    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noreferrer");
    link.removeAttribute("aria-disabled");
  });
};

const pad = (value) => value.toString().padStart(2, "0");

const updateCountdown = () => {
  if (!countdown) return;

  const remaining = Math.max(0, RELEASE_DATE.getTime() - Date.now());
  const released = remaining === 0;
  const totalSeconds = Math.floor(remaining / 1000);

  countdown.querySelector("[data-days]").textContent = pad(
    Math.floor(totalSeconds / 86400),
  );
  countdown.querySelector("[data-hours]").textContent = pad(
    Math.floor((totalSeconds % 86400) / 3600),
  );
  countdown.querySelector("[data-minutes]").textContent = pad(
    Math.floor((totalSeconds % 3600) / 60),
  );
  countdown.querySelector("[data-seconds]").textContent = pad(totalSeconds % 60);

  if (released) {
    countdown.classList.add("is-complete");
    if (countdownStatus) countdownStatus.textContent = "Le livre est disponible.";
  }

  configurePurchaseLinks(released);
};

updateCountdown();
window.setInterval(updateCountdown, 1000);

purchaseLinks.forEach((link) => {
  link.addEventListener("click", (event) => {
    if (!PURCHASE_URL) event.preventDefault();
  });
});

const shareButton = document.querySelector("[data-share]");

shareButton?.addEventListener("click", async () => {
  const shareData = {
    title: "Le Collectif soumis",
    text: "Le Collectif soumis, par Scuba Wizard — parution le 6 octobre 2026.",
    url: window.location.href.split("#")[0],
  };

  try {
    if (navigator.share) {
      await navigator.share(shareData);
    } else {
      await navigator.clipboard.writeText(shareData.url);
      shareButton.textContent = "Lien copié";
      window.setTimeout(() => {
        shareButton.textContent = "Partager la parution";
      }, 2200);
    }
  } catch (error) {
    if (error?.name !== "AbortError") {
      shareButton.textContent = "Partage indisponible";
    }
  }
});
