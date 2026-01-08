/* =========================
   Hasan Portfolio — Vanilla JS
   Tabs + indicator + modal + particles + reveals + easter egg
   ========================= */

const EMAIL = "hasan.bukhari@usm.edu";
const LINKS_TEXT =
  `Email: ${EMAIL}\n` +
  `GitHub: https://github.com/PurplePoet25\n` +
  `LinkedIn: https://linkedin.com/in/hasan-bukhari-7ab080305/`;

/** Project content (edit links/screenshots here) */
const PROJECTS = {
  qtl: {
    icon: "🧬",
    title: "QTL Analysis Toolkit",
    meta: "Python • Pandas • Matplotlib • 2025",
    desc:
      "An interactive toolkit for genome-wide QTL scans linking genotype to phenotype. Designed for research-driven analysis and clean scientific outputs.",
    bullets: [
      "Single-marker association testing + LOD visualization",
      "Permutation thresholds to support more rigorous inference",
      "Exports plots + CSV outputs for reporting pipelines",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  },
  buri: {
    icon: "🎲",
    title: "Buri Drift Simulator",
    meta: "Python • NumPy • Matplotlib • 2025",
    desc:
      "Simulates genetic drift in small Drosophila populations, reproducing classic Buri (1956)-style outcomes using stochastic modeling.",
    bullets: [
      "Interactive visualization of allele frequencies over time",
      "Tracks genotype distributions + drift outcomes",
      "Modular code for classroom demonstrations",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  },
  wf: {
    icon: "📉",
    title: "Selection Simulator (Wright–Fisher Model)",
    meta: "Python • Simulation • Data Visualization • 2025",
    desc:
      "A dual deterministic–stochastic simulator showing allele trajectories, mean fitness, and phenotype distributions in real time.",
    bullets: [
      "Deterministic vs stochastic dynamics side-by-side",
      "Phenotype distributions via mixture modeling",
      "Real-time visualization tuned for intuition",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  },
  proteinvis: {
    icon: "🧪",
    title: "ProteinVis (DNA → Protein Visualizer)",
    meta: "Python • Teaching Tool • 2025",
    desc:
      "A codon translation and amino acid visualization tool illustrating the DNA-to-protein relationship with strong validation and clean visuals.",
    bullets: [
      "Codon translation with input validation",
      "Optimized visual output for many sequences",
      "Built for teaching molecular biology concepts",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  },
  ash: {
    icon: "🎮",
    title: "To Ash Again (2D Platformer)",
    meta: "Python • Pygame • Game Dev • 2025",
    desc:
      "A pixel-art platformer featuring physics, enemy AI, cutscenes, and level progression—built with modular design and object management.",
    bullets: [
      "Player physics + responsive controls",
      "Enemy behaviors + progression structure",
      "Cutscenes and modular game architecture",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  },
  scroll: {
    icon: "🗂️",
    title: "Sc-Roll (Student Attendance System)",
    meta: "React • Project Management • 2025",
    desc:
      "Led a 4-member team to design and document an attendance web app for 200+ users, improving record accuracy by 35%.",
    bullets: [
      "Team leadership + project documentation",
      "UX focused on reliability and speed of entry",
      "Designed for real multi-user workflows",
    ],
    links: [
      { label: "GitHub (add link)", href: "https://github.com/PurplePoet25" }
    ]
  }
};

/* =========================
   Tabs
   ========================= */
const tabs = Array.from(document.querySelectorAll(".tab"));
const panels = Array.from(document.querySelectorAll(".panel"));
const indicator = document.querySelector(".tabs__indicator");

function setIndicatorTo(el) {
  const parent = el.closest(".tabs");
  if (!parent || !indicator) return;

  const pRect = parent.getBoundingClientRect();
  const bRect = el.getBoundingClientRect();
  const left = bRect.left - pRect.left;

  indicator.style.width = `${bRect.width}px`;
  indicator.style.transform = `translateX(${left}px)`;
}

function showPanel(name, pushHash = true) {
  // Update active tab
  tabs.forEach(t => {
    const active = t.dataset.tab === name;
    t.classList.toggle("is-active", active);
    t.setAttribute("aria-selected", active ? "true" : "false");
  });

  // Update panels
  panels.forEach(p => {
    const active = p.dataset.panel === name;
    p.classList.toggle("is-active", active);
    p.classList.remove("is-show");
    if (active) {
      // allow display before animating in
      requestAnimationFrame(() => p.classList.add("is-show"));
      p.focus({ preventScroll: true });
    }
  });

  // Indicator
  const activeTab = tabs.find(t => t.dataset.tab === name);
  if (activeTab) setIndicatorTo(activeTab);

  // Hash
  if (pushHash) {
    history.replaceState(null, "", `#${name}`);
  }
}

tabs.forEach((t) => {
  t.addEventListener("click", () => showPanel(t.dataset.tab, true));
  t.addEventListener("keydown", (e) => {
    // keyboard navigation: left/right
    const idx = tabs.indexOf(t);
    if (e.key === "ArrowRight") tabs[(idx + 1) % tabs.length].click();
    if (e.key === "ArrowLeft") tabs[(idx - 1 + tabs.length) % tabs.length].click();
  });
});

window.addEventListener("resize", () => {
  const activeTab = document.querySelector(".tab.is-active");
  if (activeTab) setIndicatorTo(activeTab);
});

function initFromHash() {
  const hash = (location.hash || "#home").replace("#", "");
  const allowed = new Set(["home", "projects", "resume", "contact"]);
  showPanel(allowed.has(hash) ? hash : "home", false);
}

initFromHash();
window.addEventListener("hashchange", initFromHash);

// Buttons/links that "jump" tabs
document.querySelectorAll("[data-jump]").forEach(el => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    const target = el.getAttribute("data-jump");
    showPanel(target, true);
  });
});

// Set initial indicator after layout paints
requestAnimationFrame(() => {
  const activeTab = document.querySelector(".tab.is-active");
  if (activeTab) setIndicatorTo(activeTab);
});

/* =========================
   Scroll reveal (IntersectionObserver)
   ========================= */
const revealEls = Array.from(document.querySelectorAll(".reveal"));
const io = new IntersectionObserver((entries) => {
  for (const ent of entries) {
    if (ent.isIntersecting) {
      ent.target.classList.add("is-in");
      io.unobserve(ent.target);
    }
  }
}, { threshold: 0.12 });

revealEls.forEach(el => io.observe(el));

/* =========================
   Project Modal
   ========================= */
const modal = document.getElementById("modal");
const modalIcon = document.getElementById("modalIcon");
const modalTitle = document.getElementById("modalTitle");
const modalMeta = document.getElementById("modalMeta");
const modalDesc = document.getElementById("modalDesc");
const modalBullets = document.getElementById("modalBullets");
const modalLinks = document.getElementById("modalLinks");

let lastFocus = null;

function openModal(key) {
  const data = PROJECTS[key];
  if (!data) return;

  lastFocus = document.activeElement;

  modalIcon.textContent = data.icon;
  modalTitle.textContent = data.title;
  modalMeta.textContent = data.meta;
  modalDesc.textContent = data.desc;

  modalBullets.innerHTML = "";
  data.bullets.forEach(b => {
    const div = document.createElement("div");
    div.className = "bullet";
    div.textContent = "✦ " + b;
    modalBullets.appendChild(div);
  });

  modalLinks.innerHTML = "";
  data.links?.forEach(l => {
    const a = document.createElement("a");
    a.className = "btn btn-primary";
    a.href = l.href;
    a.target = "_blank";
    a.rel = "noopener";
    a.textContent = l.label + " ↗";
    modalLinks.appendChild(a);
  });

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";

  // Focus close button
  const closeBtn = modal.querySelector("[data-close]");
  closeBtn?.focus();
}

function closeModal() {
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";

  if (lastFocus && typeof lastFocus.focus === "function") lastFocus.focus();
  lastFocus = null;
}

document.querySelectorAll("[data-project]").forEach(btn => {
  btn.addEventListener("click", () => openModal(btn.dataset.project));
});

modal.addEventListener("click", (e) => {
  const close = e.target?.getAttribute?.("data-close");
  if (close === "true") closeModal();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
});

/* =========================
   Copy + Toast
   ========================= */
const toast = document.getElementById("toast");

function showToast(msg) {
  if (!toast) return;
  toast.textContent = msg;
  toast.style.opacity = "1";
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.style.opacity = "0.85";
  }, 1400);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // fallback
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand("copy");
    document.body.removeChild(ta);
    return ok;
  }
}

document.getElementById("btnCopyEmail")?.addEventListener("click", async () => {
  const ok = await copyText(EMAIL);
  showToast(ok ? "Email copied ✦" : "Couldn’t copy (browser said no) 🙃");
});

document.getElementById("btnCopyLinks")?.addEventListener("click", async () => {
  const ok = await copyText(LINKS_TEXT);
  showToast(ok ? "Links copied ✦" : "Copy failed (rude browser) 🙃");
});

/* =========================
   Contact form -> opens mailto draft (static hosting friendly)
   ========================= */
document.getElementById("contactForm")?.addEventListener("submit", (e) => {
  e.preventDefault();
  const fd = new FormData(e.currentTarget);
  const name = String(fd.get("name") || "").trim();
  const email = String(fd.get("email") || "").trim();
  const message = String(fd.get("message") || "").trim();

  const subject = encodeURIComponent(`Portfolio message from ${name}`);
  const body = encodeURIComponent(
    `Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}\n\n— Sent from your website`
  );

  window.location.href = `mailto:${EMAIL}?subject=${subject}&body=${body}`;
});

/* =========================
   Theme toggle (“Glow”)
   ========================= */
const btnTheme = document.getElementById("btnTheme");
btnTheme?.addEventListener("click", () => {
  document.body.classList.toggle("glow");
});

/* =========================
   Footer year
   ========================= */
document.getElementById("year").textContent = String(new Date().getFullYear());

/* =========================
   Tiny easter egg: Press "G" to sparkle-confetti
   ========================= */
document.addEventListener("keydown", (e) => {
  if (e.key.toLowerCase() === "g") burstConfetti(22);
});

function burstConfetti(n = 20) {
  const root = document.body;
  const rect = root.getBoundingClientRect();

  for (let i = 0; i < n; i++) {
    const s = document.createElement("span");
    s.className = "confetti";
    const x = (rect.width * 0.5) + (Math.random() * 120 - 60);
    const y = 120 + (Math.random() * 30);
    s.style.left = `${x}px`;
    s.style.top = `${y}px`;

    const r = Math.random();
    const hue = r < 0.33 ? "rgba(109,94,252,0.95)" : r < 0.66 ? "rgba(72,183,255,0.95)" : "rgba(255,107,214,0.95)";
    s.style.background = `linear-gradient(180deg, ${hue}, rgba(255,255,255,0.9))`;

    const dx = Math.random() * 260 - 130;
    const dy = 260 + Math.random() * 220;
    const rot = Math.random() * 360;

    s.animate([
      { transform: "translate(0,0) rotate(0deg)", opacity: 1 },
      { transform: `translate(${dx}px, ${dy}px) rotate(${rot}deg)`, opacity: 0 }
    ], {
      duration: 900 + Math.random() * 700,
      easing: "cubic-bezier(.2,.8,.2,1)",
      fill: "forwards"
    });

    root.appendChild(s);
    setTimeout(() => s.remove(), 1800);
  }
}

/* Confetti styling injected (keeps CSS file cleaner) */
const confettiStyle = document.createElement("style");
confettiStyle.textContent = `
.confetti{
  position: fixed;
  width: 10px;
  height: 14px;
  border-radius: 6px;
  z-index: 999;
  pointer-events: none;
  box-shadow: 0 14px 40px rgba(0,0,0,0.18);
}
`;
document.head.appendChild(confettiStyle);

/* =========================
   Particles (canvas)
   ========================= */
const canvas = document.getElementById("particles");
const ctx = canvas.getContext("2d");

let W = 0, H = 0, DPR = 1;
let particles = [];
const COUNT = 70;

function resizeCanvas() {
  DPR = Math.max(1, Math.floor(window.devicePixelRatio || 1));
  W = Math.floor(window.innerWidth);
  H = Math.floor(window.innerHeight);

  canvas.width = W * DPR;
  canvas.height = H * DPR;
  canvas.style.width = W + "px";
  canvas.style.height = H + "px";
  ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
}

function rand(min, max){ return Math.random() * (max - min) + min; }

function initParticles() {
  particles = Array.from({ length: COUNT }, () => ({
    x: rand(0, W),
    y: rand(0, H),
    r: rand(1.2, 3.2),
    vx: rand(-0.25, 0.25),
    vy: rand(-0.15, 0.15),
    a: rand(0.25, 0.55),
    t: rand(0, Math.PI * 2)
  }));
}

function draw() {
  ctx.clearRect(0, 0, W, H);

  // soft glow lines when close
  for (let i = 0; i < particles.length; i++) {
    const p = particles[i];

    p.t += 0.01;
    p.x += p.vx + Math.cos(p.t) * 0.05;
    p.y += p.vy + Math.sin(p.t) * 0.05;

    if (p.x < -30) p.x = W + 30;
    if (p.x > W + 30) p.x = -30;
    if (p.y < -30) p.y = H + 30;
    if (p.y > H + 30) p.y = -30;

    // dots
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(109,94,252,${p.a})`;
    ctx.fill();

    for (let j = i + 1; j < particles.length; j++) {
      const q = particles[j];
      const dx = p.x - q.x;
      const dy = p.y - q.y;
      const d = Math.sqrt(dx*dx + dy*dy);

      if (d < 120) {
        const alpha = (1 - d/120) * 0.12;
        ctx.strokeStyle = `rgba(72,183,255,${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(p.x, p.y);
        ctx.lineTo(q.x, q.y);
        ctx.stroke();
      }
    }
  }

  requestAnimationFrame(draw);
}

window.addEventListener("resize", () => {
  resizeCanvas();
  initParticles();
});

resizeCanvas();
initParticles();
draw();
