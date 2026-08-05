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
const SHARE_URL = "https://oxscuba.github.io/Le-Collectif-Soumis/";

shareButton?.addEventListener("click", async () => {
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(SHARE_URL);
    } else {
      const fallback = document.createElement("textarea");
      fallback.value = SHARE_URL;
      fallback.setAttribute("readonly", "");
      fallback.style.position = "fixed";
      fallback.style.opacity = "0";
      document.body.appendChild(fallback);
      fallback.select();
      const copied = document.execCommand("copy");
      fallback.remove();
      if (!copied) throw new Error("Clipboard unavailable");
    }

    shareButton.textContent = "Lien copié ✓";
    window.setTimeout(() => {
      shareButton.textContent = "Copier le lien de la parution";
    }, 2200);
  } catch {
    shareButton.textContent = "Copie indisponible";
  }
});

const adminForm = document.querySelector("[data-admin-form]");

if (adminForm) {
  const questions = [...adminForm.querySelectorAll("[data-question]")];
  const nextButton = adminForm.querySelector("[data-form-next]");
  const counter = adminForm.querySelector("[data-form-counter]");
  const progress = adminForm.querySelector("[data-form-progress]");
  const result = adminForm.querySelector("[data-diagnostic-result]");
  const resultTitle = adminForm.querySelector("[data-result-title]");
  const resultCopy = adminForm.querySelector("[data-result-copy]");
  const resultScore = adminForm.querySelector("[data-result-score]");
  const autonomyValue = adminForm.querySelector("[data-autonomy-value]");
  const autonomyBar = adminForm.querySelector("[data-autonomy-bar]");
  const resetButton = adminForm.querySelector("[data-form-reset]");
  let currentQuestion = 0;

  const dependencyMessages = [
    [
      "Vous gardez la maîtrise de l’outil, quitte à sacrifier un peu de confort.",
      "Vous déléguez en connaissance de cause : la dépendance reste visible.",
      "La fluidité vient d’absorber la question de savoir qui possède les clés.",
    ],
    [
      "Vous regardez derrière le tampon avant de remplir la case.",
      "Vous connaissez le piège, mais la fatigue administrative fait son travail.",
      "La longueur du dossier devient la preuve de sa nécessité.",
    ],
    [
      "Nicolas reste présent dans votre comptabilité morale.",
      "Vous acceptez le remboursement sans oublier le circuit qui le précède.",
      "Ce qui fut prélevé revient sous la forme d’un cadeau institutionnel.",
    ],
    [
      "Vous placez des limites au pouvoir avant le dépouillement.",
      "La procédure apaise le conflit sans effacer votre jugement.",
      "Le bulletin vient de transformer la contrainte en consentement présumé.",
    ],
    [
      "L’autonomie commence ici par une compétence et non par un slogan.",
      "Le compromis est choisi, nommé et donc encore réversible.",
      "Le bouton de pardon a conservé vos clés avec votre permission.",
    ],
    [
      "L’incertitude demeure, mais votre jugement n’est pas mis en quarantaine.",
      "L’exception vous rassure parce qu’elle porte encore une date de fin.",
      "La prise en charge totale vient de recevoir votre soulagement.",
    ],
  ];

  const profiles = [
    {
      max: 3,
      title: "Dissident documentaire",
      copy: "Vous lisez les petites lignes avant de tendre vos clés. Attention toutefois : l’autonomie peut devenir une posture si elle ne se transforme pas en compétences, en liens volontaires et en gestes concrets.",
    },
    {
      max: 6,
      title: "Usager lucide",
      copy: "Vous voyez le guichet, mais vous l’utilisez quand même — parfois par choix, souvent par fatigue. Votre marge de manœuvre commence au moment où vous nommez précisément ce que vous déléguez.",
    },
    {
      max: 9,
      title: "Administré confortable",
      copy: "Le système vous agace, mais sa promesse de fluidité, de récupération et de protection reste persuasive. La laisse ne serre pas encore : elle ressemble surtout à un service inclus.",
    },
    {
      max: 12,
      title: "Collectif soumis",
      copy: "Votre dossier est parfaitement conforme. Le système choisit, conserve et répond volontiers à votre place. Rassurez-vous : le Collectif soumis n’est jamais seulement l’autre — c’est précisément le sujet du livre.",
    },
  ];

  const updateQuestionState = () => {
    questions.forEach((question, index) => {
      question.hidden = index !== currentQuestion;
    });
    counter.textContent = `Pièce ${currentQuestion + 1} sur ${questions.length}`;
    progress.style.setProperty(
      "--progress",
      `${(currentQuestion / questions.length) * 100}%`,
    );
    nextButton.disabled = !questions[currentQuestion].querySelector("input:checked");
    nextButton.firstChild.textContent =
      currentQuestion === questions.length - 1 ? "Calculer l’indice " : "Pièce suivante ";
  };

  questions.forEach((question, questionIndex) => {
    question.addEventListener("change", (event) => {
      if (!event.target.matches("input[type='radio']")) return;
      const value = Number(event.target.value);
      const note = question.querySelector("[data-dependency-note]");
      note.textContent = dependencyMessages[questionIndex][value];
      nextButton.disabled = false;
    });
  });

  const showResult = () => {
    const score = questions.reduce((total, question) => {
      return total + Number(question.querySelector("input:checked")?.value ?? 0);
    }, 0);
    const profile = profiles.find((item) => score <= item.max) ?? profiles.at(-1);
    const autonomy = Math.round(100 - (score / 12) * 100);

    questions.forEach((question) => {
      question.hidden = true;
    });
    nextButton.parentElement.hidden = true;
    counter.textContent = "Dossier complet · indice calculé localement";
    progress.style.setProperty("--progress", "100%");
    resultTitle.textContent = profile.title;
    resultCopy.textContent = profile.copy;
    resultScore.textContent = score.toString();
    autonomyValue.textContent = `${autonomy} %`;
    autonomyBar.style.setProperty("--value", `${autonomy}%`);
    result.hidden = false;
    result.focus?.();
  };

  nextButton.addEventListener("click", () => {
    if (!questions[currentQuestion].querySelector("input:checked")) return;
    if (currentQuestion === questions.length - 1) {
      showResult();
      return;
    }
    currentQuestion += 1;
    updateQuestionState();
  });

  resetButton?.addEventListener("click", () => {
    adminForm.reset();
    questions.forEach((question) => {
      const note = question.querySelector("[data-dependency-note]");
      note.textContent = "";
    });
    currentQuestion = 0;
    result.hidden = true;
    nextButton.parentElement.hidden = false;
    updateQuestionState();
    adminForm.scrollIntoView({ behavior: "smooth", block: "start" });
  });

  updateQuestionState();
}
