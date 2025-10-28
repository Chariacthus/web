const startup = document.getElementById("startup-sequence");
const skipButton = startup.querySelector(".startup__skip");
const terminalLine = startup.querySelector(".terminal-line");
const app = document.getElementById("app");
const commandPalette = document.getElementById("command-palette");
const commandResults = commandPalette.querySelector(".command-palette__results");
const commandInput = commandPalette.querySelector("input");
const closeCommand = commandPalette.querySelector(".command-palette__close");
const neoDock = document.querySelector(".neo-dock");
const neoItems = Array.from(document.querySelectorAll(".neo-dock__items li"));
const indicator = document.querySelector(".neo-dock__indicator");
const orbButton = document.querySelector(".neo-dock__orb");
const sections = Array.from(document.querySelectorAll("main section, header.hero"));
const helpTabs = Array.from(document.querySelectorAll(".help__tabs button"));
const helpPanels = Array.from(document.querySelectorAll(".help-panel"));

const terminalLines = [
  "> initializing environment...",
  "> connecting to creator grid...",
  "> loading modules...",
  "> system ready."
];

const commands = [
  { label: "Go to Home", target: "home" },
  { label: "Go to Upload", target: "upload" },
  { label: "Go to Trending", target: "trending" },
  { label: "Go to Stats", target: "stats" },
  { label: "Go to Rules", target: "rules" },
  { label: "Go to Help", target: "help" },
  { label: "Open Upload Form", target: "upload" },
  { label: "Check Live Analytics", target: "stats" },
  { label: "Review Community Guidelines", target: "rules" }
];

let introComplete = false;

function typeTerminalLines(lines, index = 0) {
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
  startup.classList.add("hidden");
  setTimeout(() => {
    startup.remove();
    revealApp();
  }, 750);
}

function revealApp() {
  app.hidden = false;
  app.classList.add("app--visible");
  spawnParticles();
  animateNumbers();
  initializeIndicator();
}

function spawnParticles() {
  const field = document.querySelector(".particle-field");
  if (!field) return;
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
  const active = document.querySelector(".neo-dock__items li.active");
  if (!active || !indicator) return;
  const { offsetWidth, offsetLeft } = active;
  indicator.style.width = `${offsetWidth}px`;
  indicator.style.transform = `translateX(${offsetLeft}px)`;
}

function updateIndicator(target) {
  const { offsetWidth, offsetLeft } = target;
  indicator.style.width = `${offsetWidth}px`;
  indicator.style.transform = `translateX(${offsetLeft}px)`;
}

function scrollToSection(id) {
  const element = document.getElementById(id);
  if (!element) return;
  element.scrollIntoView({ behavior: "smooth", block: "start" });
}

function setActiveNav(target) {
  neoItems.forEach((item) => item.classList.toggle("active", item === target));
  updateIndicator(target);
}

function openCommandPalette() {
  commandPalette.setAttribute("aria-hidden", "false");
  commandInput.value = "";
  renderCommandResults(commands);
  setTimeout(() => commandInput.focus(), 50);
}

function closeCommandPalette() {
  commandPalette.setAttribute("aria-hidden", "true");
}

function renderCommandResults(list) {
  commandResults.innerHTML = "";
  list.forEach((cmd) => {
    const li = document.createElement("li");
    li.textContent = cmd.label;
    li.addEventListener("click", () => {
      closeCommandPalette();
      scrollToSection(cmd.target);
      const navItem = neoItems.find((item) => item.dataset.target === cmd.target);
      if (navItem) {
        setActiveNav(navItem);
      }
    });
    commandResults.appendChild(li);
  });
}

function initCommandPalette() {
  commandInput.addEventListener("input", (event) => {
    const value = event.target.value.toLowerCase();
    const filtered = commands.filter((cmd) => cmd.label.toLowerCase().includes(value));
    renderCommandResults(filtered);
  });

  closeCommand.addEventListener("click", closeCommandPalette);

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

  orbButton.addEventListener("click", () => {
    if (window.matchMedia("(max-width: 768px)").matches) {
      commandPalette.setAttribute(
        "aria-hidden",
        commandPalette.getAttribute("aria-hidden") === "false" ? "true" : "false"
      );
      if (commandPalette.getAttribute("aria-hidden") === "false") {
        renderCommandResults(commands);
        setTimeout(() => commandInput.focus(), 50);
      }
    } else {
      openCommandPalette();
    }
  });
}

function initHelpPanels() {
  helpTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      helpTabs.forEach((btn) => btn.classList.toggle("active", btn === tab));
      helpPanels.forEach((panel) => panel.classList.toggle("active", panel.id === tab.dataset.help));
    });
  });
}

function initNav() {
  neoItems.forEach((item) => {
    item.addEventListener("click", () => {
      scrollToSection(item.dataset.target);
      setActiveNav(item);
      const ripple = document.createElement("span");
      ripple.className = "neo-dock__ripple";
      item.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  });
}

function initCarousel() {
  const cards = Array.from(document.querySelectorAll(".carousel__card"));
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

function initStickyObserver() {
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          const navItem = neoItems.find((item) => item.dataset.target === id);
          if (navItem) {
            setActiveNav(navItem);
          }
        }
      });
    },
    { threshold: 0.35 }
  );

  sections.forEach((section) => observer.observe(section));
}

function initStartup() {
  setTimeout(() => skipButton.classList.add("visible"), 2000);
  skipButton.addEventListener("click", completeStartup);
  typeTerminalLines(terminalLines);
  setTimeout(() => {
    if (!introComplete) {
      completeStartup();
    }
  }, 5600);
}

function initApp() {
  initStartup();
  initCommandPalette();
  initHelpPanels();
  initNav();
  initCarousel();
  drawChart();
  initStickyObserver();
  window.addEventListener("resize", initializeIndicator);
}

initApp();
