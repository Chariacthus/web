const app = document.getElementById("app");
const startup = document.getElementById("startup-sequence");
const skipButton = startup ? startup.querySelector(".startup__skip") : null;
const terminalLine = startup ? startup.querySelector(".terminal-line") : null;
const commandPalette = document.getElementById("command-palette");
const commandResults = commandPalette ? commandPalette.querySelector(".command-palette__results") : null;
const commandInput = commandPalette ? commandPalette.querySelector("input") : null;
const closeCommand = commandPalette ? commandPalette.querySelector(".command-palette__close") : null;
const neoItems = Array.from(document.querySelectorAll(".neo-dock__items li"));
const indicator = document.querySelector(".neo-dock__indicator");
const orbButton = document.querySelector(".neo-dock__orb");
const helpTabs = Array.from(document.querySelectorAll(".help__tabs button"));
const helpPanels = Array.from(document.querySelectorAll(".help-panel"));
const page = document.body.dataset.page || "home";

const terminalLines = [
  "> initializing environment...",
  "> connecting to creator grid...",
  "> loading modules...",
  "> system ready."
];

const commands = [
  { label: "Go to Home", url: "index.html" },
  { label: "Open Upload Studio", url: "upload.html" },
  { label: "Browse Trending Scripts", url: "trending.html" },
  { label: "Open Live Analytics", url: "stats.html" },
  { label: "Review Community Rules", url: "rules.html" },
  { label: "Get Help & Support", url: "help.html" }
];

let introComplete = false;

function typeTerminalLines(lines, index = 0) {
  if (!terminalLine) return;
  if (index >= lines.length) {
    setTimeout(() => completeStartup(), 600);
    return;
  }

  let charIndex = 0;
  const currentLine = lines[index];
  const interval = setInterval(() => {
    terminalLine.textContent = currentLine.slice(0, charIndex + 1);
    charIndex++;
    if (charIndex === currentLine.length) {
      clearInterval(interval);
      setTimeout(() => typeTerminalLines(lines, index + 1), 650);
    }
  }, 45);
}

function completeStartup() {
  if (introComplete) return;
  introComplete = true;

  if (!startup) {
    onAppReady();
    return;
  }

  startup.classList.add("hidden");
  setTimeout(() => {
    startup.remove();
    onAppReady();
  }, 750);
}

function onAppReady() {
  if (!app || app.classList.contains("app--ready")) return;
  app.hidden = false;
  app.classList.add("app--visible", "app--ready");
  spawnParticles();
  initializeIndicator();
  runPageSpecificInit();
}

function spawnParticles() {
  const field = document.querySelector(".particle-field");
  if (!field || field.dataset.initialized) return;
  field.dataset.initialized = "true";

  const total = 80;
  for (let i = 0; i < total; i++) {
    const span = document.createElement("span");
    span.style.left = Math.random() * 100 + "%";
    span.style.top = Math.random() * 100 + "%";
    span.style.animationDelay = Math.random() * 8 + "s";
    span.style.animationDuration = 8 + Math.random() * 12 + "s";
    field.appendChild(span);
  }

  document.addEventListener("pointermove", (event) => {
    const rect = field.getBoundingClientRect();
    const x = (event.clientX - rect.left) / rect.width;
    const y = (event.clientY - rect.top) / rect.height;
    field.style.transform = `translate(${(x - 0.5) * 20}px, ${(y - 0.5) * 20}px)`;
  });
}

function animateNumbers() {
  const statElements = document.querySelectorAll("[data-stat]");
  statElements.forEach((el) => {
    const max = {
      uploads: 184,
      online: 2350,
      verified: 7421
    }[el.dataset.stat];

    if (!max) return;

    let current = 0;
    const increment = max / 60;
    const interval = setInterval(() => {
      current += increment;
      if (current >= max) {
        current = max;
        clearInterval(interval);
      }
      el.textContent = Math.round(current).toLocaleString();
    }, 50);
  });

  const animatedNumbers = document.querySelectorAll("[data-anim-number]");
  animatedNumbers.forEach((el) => {
    const target = parseInt(el.dataset.animNumber.replace(/,/g, ""), 10);
    if (Number.isNaN(target)) return;

    let current = 0;
    const increment = target / 80;
    const interval = setInterval(() => {
      current += increment;
      if (current >= target) {
        current = target;
        clearInterval(interval);
      }
      el.textContent = Math.round(current).toLocaleString();
    }, 40);
  });
}

function initializeIndicator() {
  if (!indicator || !neoItems.length) return;
  const active =
    neoItems.find((item) => item.dataset.page === page) || neoItems[0];

  if (!active) return;

  neoItems.forEach((item) => {
    item.classList.toggle("active", item === active);
  });

  const { offsetWidth, offsetLeft } = active;
  indicator.style.width = `${offsetWidth}px`;
  indicator.style.transform = `translateX(${offsetLeft}px)`;
}

function renderCommandResults(list) {
  if (!commandResults) return;
  commandResults.innerHTML = "";
  list.forEach((cmd) => {
    const li = document.createElement("li");
    li.textContent = cmd.label;
    li.addEventListener("click", () => {
      closeCommandPalette();
      if (cmd.url) {
        window.location.href = cmd.url;
      }
    });
    commandResults.appendChild(li);
  });
}

function openCommandPalette() {
  if (!commandPalette || !commandInput) return;
  commandPalette.setAttribute("aria-hidden", "false");
  commandInput.value = "";
  renderCommandResults(commands);
  setTimeout(() => commandInput.focus(), 50);
}

function closeCommandPalette() {
  if (!commandPalette) return;
  commandPalette.setAttribute("aria-hidden", "true");
}

function initCommandPalette() {
  if (!commandPalette || !commandInput || !commandResults) return;

  commandInput.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(value)
    );
    renderCommandResults(filtered);
  });

  if (closeCommand) {
    closeCommand.addEventListener("click", closeCommandPalette);
  }

  document.addEventListener("keydown", (event) => {
    if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === "k") {
      event.preventDefault();
      if (commandPalette.getAttribute("aria-hidden") === "false") {
        closeCommandPalette();
      } else {
        openCommandPalette();
      }
    }

    if (event.key === "Escape" && commandPalette.getAttribute("aria-hidden") === "false") {
      closeCommandPalette();
    }
  });

  if (orbButton) {
    orbButton.addEventListener("click", () => {
      if (window.matchMedia("(max-width: 768px)").matches) {
        const isOpen = commandPalette.getAttribute("aria-hidden") === "false";
        commandPalette.setAttribute("aria-hidden", isOpen ? "true" : "false");
        if (!isOpen) {
          renderCommandResults(commands);
          setTimeout(() => commandInput.focus(), 50);
        }
      } else {
        openCommandPalette();
      }
    });
  }
}

function initHelpPanels() {
  if (!helpTabs.length || !helpPanels.length) return;
  helpTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      helpTabs.forEach((btn) => btn.classList.toggle("active", btn === tab));
      helpPanels.forEach((panel) =>
        panel.classList.toggle("active", panel.id === tab.dataset.help)
      );
    });
  });
}

function initNav() {
  if (!neoItems.length) return;
  neoItems.forEach((item) => {
    item.addEventListener("click", (event) => {
      const link = item.querySelector("a");
      if (!link) return;

      const ripple = document.createElement("span");
      ripple.className = "neo-dock__ripple";
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);

      if (
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey ||
        event.button !== 0
      ) {
        return;
      }

      event.preventDefault();
      setTimeout(() => {
        window.location.href = link.href;
      }, 140);
    });
  });
}

function initCarousel() {
  const cards = Array.from(document.querySelectorAll(".carousel__card"));
  if (!cards.length) return;
  let index = 0;
  setInterval(() => {
    cards[index].classList.remove("active");
    index = (index + 1) % cards.length;
    cards[index].classList.add("active");
  }, 3600);
}

function drawChart() {
  const canvas = document.getElementById("verificationChart");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");
  const points = [40, 60, 52, 78, 96, 120, 150, 168, 182, 210];
  const padding = 30;
  const width = canvas.width;
  const height = canvas.height;

  ctx.clearRect(0, 0, width, height);

  ctx.strokeStyle = "rgba(76, 201, 240, 0.15)";
  ctx.lineWidth = 1;
  ctx.setLineDash([4, 6]);
  for (let i = 0; i < 5; i++) {
    const y = padding + ((height - padding * 2) / 4) * i;
    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();
  }
  ctx.setLineDash([]);

  ctx.beginPath();
  ctx.strokeStyle = "rgba(76, 201, 240, 0.4)";
  ctx.lineWidth = 3;
  points.forEach((value, i) => {
    const x = padding + ((width - padding * 2) / (points.length - 1)) * i;
    const y = height - padding - ((height - padding * 2) * value) / 220;
    if (i === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.stroke();

  points.forEach((value, i) => {
    const x = padding + ((width - padding * 2) / (points.length - 1)) * i;
    const y = height - padding - ((height - padding * 2) * value) / 220;
    const gradient = ctx.createRadialGradient(x, y, 0, x, y, 12);
    gradient.addColorStop(0, "rgba(76, 201, 240, 0.9)");
    gradient.addColorStop(1, "rgba(76, 201, 240, 0)");
    ctx.fillStyle = gradient;
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fill();
  });
}

function runPageSpecificInit() {
  if (page === "home") {
    animateNumbers();
    initCarousel();
  }

  if (page === "stats") {
    animateNumbers();
    drawChart();
  }

  if (page === "help") {
    initHelpPanels();
  }
}

function initStartup() {
  if (!startup || !skipButton || !terminalLine) {
    onAppReady();
    return;
  }

  setTimeout(() => skipButton.classList.add("visible"), 2000);
  skipButton.addEventListener("click", completeStartup);
  typeTerminalLines(terminalLines);
  setTimeout(() => {
    if (!introComplete) {
      completeStartup();
    }
  }, 5600);
}

initStartup();
initCommandPalette();
initNav();
window.addEventListener("resize", initializeIndicator);
