/* =========================================================
   Hasan Bukhari — Portfolio JS (cross-platform, resilient)
========================================================= */

const PROFILE = {
  email: "hasan.bukhari@usm.edu",
  github: "https://github.com/PurplePoet25",
  linkedin: "https://linkedin.com/in/hasan-bukhari-7ab080305",
};

const PROJECTS = [
  {
    id: "qtl",
    title: "QTL Analysis Toolkit",
    year: "2025",
    tags: ["Python", "Pandas", "Matplotlib", "Bioinformatics"],
    summary: "Interactive genome-wide QTL scans linking genotype to phenotype, with LOD plots and CSV outputs.",
    details: [
      "Built analysis pipeline for QTL scanning and interpretation using clean, reproducible outputs.",
      "Generates publication-ready visualizations and structured CSV exports for downstream work.",
      "Designed for clarity: results are easy to audit and explain."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PurplePoet25/QTL-Analysis-Toolkit" }
    ]
  },
  {
    id: "buri",
    title: "Buri Drift Simulator",
    year: "2025",
    tags: ["Python", "NumPy", "Simulation"],
    summary: "Genetic drift simulator reproducing classic results via stochastic modeling and interactive visuals.",
    details: [
      "Implements stochastic drift dynamics with configurable parameters and multiple runs.",
      "Focus on interpretability: charts and outputs emphasize learning and comparison."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PurplePoet25" }
    ]
  },
  {
    id: "proteinvis",
    title: "ProteinVis (DNA → Protein)",
    year: "2024",
    tags: ["Python", "Validation", "Visualization"],
    summary: "Codon translation and amino-acid visualization tool designed for teaching molecular biology.",
    details: [
      "Translates sequences into proteins and visualizes results in a learner-friendly way.",
      "Validation-first approach: detects common input issues and provides clear feedback."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PurplePoet25" }
    ]
  },
  {
    id: "toashagain",
    title: "To Ash Again (2D Platformer)",
    year: "2025",
    tags: ["Python", "Pygame", "Game Dev"],
    summary: "Pixel-art platformer with physics, modular enemy logic, and progression systems.",
    details: [
      "Modularized gameplay systems: movement, collisions, enemies, UI, and progression.",
      "Designed cutscenes and multi-act structure with consistent asset organization."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PurplePoet25" }
    ]
  },
  {
    id: "scroll",
    title: "Sc-Roll (Attendance Web App)",
    year: "2024",
    tags: ["React", "Product", "Docs"],
    summary: "Led a 4-member team; built an attendance system used by 200+ users; improved record accuracy.",
    details: [
      "Product-oriented build: consistent flows, error prevention, and readable admin views.",
      "Team leadership: coordinated tasks, reviews, and documentation."
    ],
    links: [
      { label: "GitHub", href: "https://github.com/PurplePoet25" }
    ]
  }
];

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  document.getElementById("year").textContent = new Date().getFullYear();

  // Email link + text
  const emailText = document.getElementById("emailText");
  const emailLink = document.getElementById("emailLink");
  emailText.textContent = PROFILE.email;
  emailLink.href = `mailto:${encodeURIComponent(PROFILE.email)}`;

  // Glow mode (Studio ↔ Nebula)
  const glowToggle = document.getElementById("glowToggle");
  const glowLabel = document.getElementById("glowLabel");

  const savedMode = localStorage.getItem("hb_mode");
  if (savedMode === "nebula" || savedMode === "studio") {
    setMode(savedMode, false);
  } else {
    setMode("studio", false);
  }

  glowToggle.addEventListener("click", () => {
    const current = document.body.getAttribute("data-mode") || "studio";
    setMode(current === "studio" ? "nebula" : "studio", true);
  });

  // Press "g" to toggle glow mode (nice power user touch)
  document.addEventListener("keydown", (e) => {
    if (e.key.toLowerCase() === "g" && !isTypingTarget(e.target)) {
      const current = document.body.getAttribute("data-mode") || "studio";
      setMode(current === "studio" ? "nebula" : "studio", true);
    }
  });

  function setMode(mode, announce){
    document.body.setAttribute("data-mode", mode);
    localStorage.setItem("hb_mode", mode);
    glowToggle.setAttribute("aria-pressed", mode === "nebula" ? "true" : "false");
    glowLabel.textContent = mode === "nebula" ? "Glow: On" : "Glow: Off";
    if (announce) toast(mode === "nebula" ? "Glow enabled" : "Glow disabled");
  }

  // Copy buttons
  document.querySelectorAll("[data-copy]").forEach(btn => {
    btn.addEventListener("click", async () => {
      const what = btn.getAttribute("data-copy");
      let text = "";
      if (what === "email") text = PROFILE.email;
      if (what === "profiles") text = `GitHub: ${PROFILE.github}\nLinkedIn: ${PROFILE.linkedin}`;

      const ok = await copyToClipboard(text);
      toast(ok ? "Copied" : "Copy failed (browser blocked clipboard)");
    });
  });

  // View projects button
  const viewProjectsBtn = document.getElementById("viewProjectsBtn");
  viewProjectsBtn.addEventListener("click", (e) => {
    // anchor does most of it; keep it clean and reliable
  });

  // Nav active state based on scroll
  setupActiveNav();

  // Projects render + filtering
  renderProjects(PROJECTS);
  setupProjectFilters(PROJECTS);

  // Modal
  setupModal();

  // Contact form => mailto draft
  const form = document.getElementById("contactForm");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const from = (data.get("from") || "").toString().trim();
    const msg = (data.get("message") || "").toString().trim();

    const subject = `Portfolio inquiry — ${name}`;
    const body = `Name: ${name}\nEmail: ${from}\n\nMessage:\n${msg}\n`;
    const mailto = `mailto:${encodeURIComponent(PROFILE.email)}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailto;
  });

  // Stats count-up (never blank: HTML provides defaults)
  animateStatsOnView();

  // Background particles
  startParticles();
});

/* ----------------- Utilities ----------------- */

function isTypingTarget(el){
  if (!el) return false;
  const tag = el.tagName?.toLowerCase();
  return tag === "input" || tag === "textarea" || el.isContentEditable;
}

async function copyToClipboard(text){
  try{
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
      return true;
    }
  }catch(_){}
  // Fallback
  try{
    const ta = document.createElement("textarea");
    ta.value = text;
    ta.style.position = "fixed";
    ta.style.left = "-9999px";
    ta.style.top = "-9999px";
    document.body.appendChild(ta);
    ta.focus();
    ta.select();
    const ok = document.execCommand("copy");
    ta.remove();
    return ok;
  }catch(_){
    return false;
  }
}

/* ----------------- Toast ----------------- */

let toastTimer = null;
function toast(msg){
  const t = document.getElementById("toast");
  if (!t) return;
  t.textContent = msg;
  t.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => {
    t.hidden = true;
  }, 1400);
}

/* ----------------- Active Nav ----------------- */

function setupActiveNav(){
  const sections = ["home","projects","resume","contact"].map(id => document.getElementById(id)).filter(Boolean);
  const navLinks = Array.from(document.querySelectorAll(".dockItem"));

  const setActive = (id) => {
    navLinks.forEach(a => a.classList.toggle("active", a.dataset.nav === id));
  };

  const obs = new IntersectionObserver((entries) => {
    // pick the most visible section
    const visible = entries
      .filter(e => e.isIntersecting)
      .sort((a,b) => b.intersectionRatio - a.intersectionRatio)[0];
    if (visible?.target?.id) setActive(visible.target.id);
  }, { threshold: [0.35, 0.5, 0.65] });

  sections.forEach(s => obs.observe(s));

  // Also update on hash change
  window.addEventListener("hashchange", () => {
    const id = (location.hash || "#home").replace("#","");
    setActive(id);
  });
}

/* ----------------- Projects ----------------- */

function renderProjects(list){
  const grid = document.getElementById("projectsGrid");
  grid.innerHTML = "";

  if (!list.length){
    const empty = document.createElement("div");
    empty.className = "projectCard";
    empty.style.cursor = "default";
    empty.innerHTML = `<h3 class="projectTitle">No matches</h3>
      <p class="projectDesc">Try a different keyword or remove filters.</p>`;
    grid.appendChild(empty);
    return;
  }

  for (const p of list){
    const card = document.createElement("article");
    card.className = "projectCard";
    card.tabIndex = 0;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open project: ${p.title}`);
    card.addEventListener("click", () => openProjectModal(p.id));
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") openProjectModal(p.id);
    });

    const tags = p.tags.slice(0, 4).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("");
    card.innerHTML = `
      <h3 class="projectTitle">${escapeHtml(p.title)}</h3>
      <p class="projectDesc">${escapeHtml(p.summary)}</p>
      <div class="projectMetaRow">
        <span class="tag">${escapeHtml(p.year)}</span>
        ${tags}
      </div>
    `;
    grid.appendChild(card);
  }
}

function setupProjectFilters(all){
  const search = document.getElementById("projectSearch");
  const tagWrap = document.getElementById("tagFilters");

  // Build tag set
  const tagSet = new Set();
  all.forEach(p => p.tags.forEach(t => tagSet.add(t)));
  const tags = Array.from(tagSet).sort();

  const state = { q: "", tag: "All" };

  // Render filters
  const makeBtn = (label) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "filterBtn";
    b.textContent = label;
    b.addEventListener("click", () => {
      state.tag = label;
      update();
      Array.from(tagWrap.children).forEach(x => x.classList.toggle("active", x.textContent === state.tag));
    });
    return b;
  };

  tagWrap.innerHTML = "";
  const allBtn = makeBtn("All");
  allBtn.classList.add("active");
  tagWrap.appendChild(allBtn);
  tags.forEach(t => tagWrap.appendChild(makeBtn(t)));

  search.addEventListener("input", () => {
    state.q = search.value.trim().toLowerCase();
    update();
  });

  function update(){
    let filtered = all;

    if (state.tag !== "All"){
      filtered = filtered.filter(p => p.tags.includes(state.tag));
    }

    if (state.q){
      filtered = filtered.filter(p => {
        const hay = `${p.title} ${p.summary} ${p.tags.join(" ")} ${p.year}`.toLowerCase();
        return hay.includes(state.q);
      });
    }

    renderProjects(filtered);
  }
}

function escapeHtml(str){
  return String(str)
    .replaceAll("&","&amp;")
    .replaceAll("<","&lt;")
    .replaceAll(">","&gt;")
    .replaceAll('"',"&quot;")
    .replaceAll("'","&#039;");
}

/* ----------------- Modal ----------------- */

let modalProjectIndex = new Map();
function setupModal(){
  modalProjectIndex = new Map(PROJECTS.map(p => [p.id, p]));

  const overlay = document.getElementById("modalOverlay");
  const modal = overlay.querySelector(".modal");
  const closeBtn = document.getElementById("modalClose");

  closeBtn.addEventListener("click", closeModal);
  overlay.addEventListener("click", (e) => {
    if (e.target === overlay) closeModal();
  });

  document.addEventListener("keydown", (e) => {
    if (!overlay.hidden && e.key === "Escape") closeModal();
  });

  function closeModal(){
    overlay.hidden = true;
    document.body.style.overflow = "";
  }

  window.openProjectModal = (id) => {
    const p = modalProjectIndex.get(id);
    if (!p) return;

    document.getElementById("modalTitle").textContent = p.title;
    document.getElementById("modalMeta").textContent = `${p.tags[0] || "Project"} • ${p.year}`;

    const body = document.getElementById("modalBody");
    body.innerHTML = `
      <p>${escapeHtml(p.summary)}</p>
      <ul>
        ${p.details.map(x => `<li>${escapeHtml(x)}</li>`).join("")}
      </ul>
    `;

    const foot = document.getElementById("modalFoot");
    foot.innerHTML = "";
    (p.links || []).forEach(l => {
      const a = document.createElement("a");
      a.className = "modalLink";
      a.href = l.href;
      a.target = "_blank";
      a.rel = "noopener";
      a.textContent = `${l.label} ↗`;
      foot.appendChild(a);
    });

    overlay.hidden = false;
    document.body.style.overflow = "hidden";
    // focus for accessibility
    setTimeout(() => modal.focus(), 0);
  };
}

/* ----------------- Stats Animation ----------------- */

function animateStatsOnView(){
  const els = Array.from(document.querySelectorAll(".statNumber"));
  if (!els.length) return;

  const animateEl = (el) => {
    if (el.dataset.animated === "1") return;
    el.dataset.animated = "1";

    const raw = el.getAttribute("data-count");
    const suffix = el.getAttribute("data-suffix") || "";
    const target = raw ? Number(raw) : null;
    if (!Number.isFinite(target)) return;

    const isFloat = String(raw).includes(".");
    const duration = 800;
    const start = performance.now();

    const tick = (t) => {
      const p = Math.min(1, (t - start) / duration);
      const eased = 1 - Math.pow(1 - p, 3);
      const val = target * eased;

      el.textContent = isFloat ? val.toFixed(1) + suffix : Math.round(val).toString() + suffix;
      if (p < 1) requestAnimationFrame(tick);
    };

    requestAnimationFrame(tick);
  };

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) animateEl(e.target);
    });
  }, { threshold: 0.55 });

  els.forEach(el => obs.observe(el));
}

/* ----------------- Particles Background ----------------- */

function startParticles(){
  const canvas = document.getElementById("bg");
  const ctx = canvas.getContext("2d", { alpha: true });

  let w = 0, h = 0;
  const DPR = Math.min(2, window.devicePixelRatio || 1);

  const resize = () => {
    w = canvas.clientWidth = window.innerWidth;
    h = canvas.clientHeight = window.innerHeight;
    canvas.width = Math.floor(w * DPR);
    canvas.height = Math.floor(h * DPR);
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  };
  window.addEventListener("resize", resize);
  resize();

  const count = Math.floor(Math.max(50, (w * h) / 24000));
  const pts = Array.from({ length: count }).map(() => ({
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.18,
    vy: (Math.random() - 0.5) * 0.18,
    r: Math.random() * 1.8 + 0.6
  }));

  function draw(){
    ctx.clearRect(0,0,w,h);

    // read glow strength from CSS mode (subtle shift)
    const mode = document.body.getAttribute("data-mode") || "studio";
    const alphaDot = mode === "nebula" ? 0.18 : 0.12;
    const alphaLine = mode === "nebula" ? 0.10 : 0.07;

    // move
    for (const p of pts){
      p.x += p.vx; p.y += p.vy;
      if (p.x < -20) p.x = w + 20;
      if (p.x > w + 20) p.x = -20;
      if (p.y < -20) p.y = h + 20;
      if (p.y > h + 20) p.y = -20;
    }

    // lines
    for (let i=0;i<pts.length;i++){
      for (let j=i+1;j<pts.length;j++){
        const a = pts[i], b = pts[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 120){
          ctx.globalAlpha = alphaLine * (1 - d/120);
          ctx.strokeStyle = "rgba(140,170,255,1)";
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // dots
    for (const p of pts){
      ctx.globalAlpha = alphaDot;
      ctx.fillStyle = "rgba(170,190,255,1)";
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  requestAnimationFrame(draw);
}
      ],
    },
    {
      id: "buri",
      title: "Buri Drift Simulator",
      meta: "Python • NumPy • GUI",
      icon: "🧪",
      blurb:
        "Genetic drift simulator that reproduces class results via stochastic modeling + interactive visuals.",
      tags: ["Python", "NumPy", "Simulation", "Visualization", "GUI"],
      bullets: [
        "Stochastic population sampling with adjustable parameters.",
        "Interactive graphs for allele frequency trajectories.",
        "Built as a learning tool — fast feedback, clear visuals.",
      ],
      links: [],
    },
    {
      id: "wright",
      title: "Selection Simulator (Wright–Fisher)",
      meta: "Python • Simulation • Data Viz",
      icon: "📈",
      blurb:
        "Deterministic + stochastic simulator with allele trajectories, fitness effects, and phenotype distributions.",
      tags: ["Python", "Simulation", "Statistics", "Data Viz"],
      bullets: [
        "Models selection under multiple regimes and population sizes.",
        "Compares deterministic vs stochastic trajectories side‑by‑side.",
        "Exports runs for analysis and report workflows.",
      ],
      links: [],
    },
    {
      id: "proteinvis",
      title: "ProteinVis (DNA → Protein)",
      meta: "Python • Validation • Teaching Tool",
      icon: "🧫",
      blurb:
        "Codon translation + amino acid visualization tool for teaching molecular biology concepts.",
      tags: ["Python", "Bio", "Visualization", "Education"],
      bullets: [
        "Translates sequences and highlights codon boundaries.",
        "Visualizes amino acid chains with human‑readable legends.",
        "Built to make abstract processes feel tangible.",
      ],
      links: [],
    },
    {
      id: "toashagain",
      title: "To Ash Again (2D Platformer)",
      meta: "Python • Pygame • Game Dev",
      icon: "🎮",
      blurb:
        "Pixel‑art platformer with physics, enemy AI, cutscenes, progression — modular object management.",
      tags: ["Python", "Pygame", "Physics", "Game Dev", "Systems"],
      bullets: [
        "Custom movement physics (jump, glide/flight variants, collision).",
        "Enemy framework (melee, ranged, boss) + cutscene sequencing.",
        "Modularized codebase for sanity and scale.",
      ],
      links: [],
    },
    {
      id: "scroll",
      title: "Sc‑Roll (Attendance Web App)",
      meta: "React • PM Docs • Web",
      icon: "🧾",
      blurb:
        "Led a 4‑member team; designed attendance system for 200+ users; improved record accuracy.",
      tags: ["React", "Web", "Team Lead", "UX", "Docs"],
      bullets: [
        "Designed the user flow for fast check‑ins and fewer errors.",
        "Coordinated team responsibilities and delivery milestones.",
        "Produced clear documentation for handoff + maintenance.",
      ],
      links: [],
    },
  ];

  // ---------- Tabs ----------
  const dock = qs(".dock");
  const indicator = qs(".dock__indicator");
  const tabs = qsa(".dock__tab");
  const panels = qsa(".panel");

  function setIndicatorTo(tab) {
    if (!tab || !indicator) return;
    const dockRect = dock.getBoundingClientRect();
    const r = tab.getBoundingClientRect();
    const x = r.left - dockRect.left;
    indicator.style.width = `${r.width}px`;
    indicator.style.transform = `translate3d(${x}px, -50%, 0)`;
  }

  function activate(panelName, { pushHash = true } = {}) {
    tabs.forEach((t) => {
      const isTarget = t.dataset.panel === panelName;
      t.setAttribute("aria-selected", isTarget ? "true" : "false");
      if (isTarget) setIndicatorTo(t);
    });

    panels.forEach((p) => p.classList.toggle("is-active", p.id === `panel-${panelName}`));

    // Keep focus sane for keyboard users
    const panel = qs(`#panel-${panelName}`);
    if (panel) panel.focus({ preventScroll: true });

    if (pushHash) {
      history.replaceState(null, "", `#${panelName}`);
    }
  }

  tabs.forEach((t) => {
    t.addEventListener("click", () => activate(t.dataset.panel));
  });

  // CTA jump buttons
  qsa("[data-jump]").forEach((btn) => {
    btn.addEventListener("click", () => activate(btn.dataset.jump));
  });

  // Initial panel from hash
  const initial = (location.hash || "#home").replace("#", "");
  activate(["home", "projects", "resume", "contact"].includes(initial) ? initial : "home", { pushHash: false });

  // Update indicator on resize
  window.addEventListener("resize", () => {
    const activeTab = qs('.dock__tab[aria-selected="true"]');
    setIndicatorTo(activeTab);
    resizeCanvas();
  });

  // Keyboard tab cycling
  dock.addEventListener("keydown", (e) => {
    const idx = tabs.findIndex((t) => t.getAttribute("aria-selected") === "true");
    if (e.key === "ArrowRight" || e.key === "ArrowLeft") {
      e.preventDefault();
      const dir = e.key === "ArrowRight" ? 1 : -1;
      const next = (idx + dir + tabs.length) % tabs.length;
      tabs[next].focus();
      activate(tabs[next].dataset.panel);
    }
  });

  // ---------- Projects ----------
  const grid = qs("#projectGrid");
  const search = qs("#projectSearch");
  const clearSearch = qs("#clearSearch");

  function projectCard(p) {
    const el = document.createElement("article");
    el.className = "card pcard";
    el.tabIndex = 0;
    el.dataset.id = p.id;
    el.innerHTML = `
      <div class="pcard__head">
        <div>
          <h3 class="pcard__title">${escapeHtml(p.title)}</h3>
          <div class="pcard__meta">${escapeHtml(p.blurb)}</div>
          <div class="pcard__meta"><strong>${escapeHtml(p.meta)}</strong></div>
        </div>
        <div class="pcard__icon" aria-hidden="true">${p.icon}</div>
      </div>
      <div class="pcard__tags">
        ${p.tags.slice(0, 5).map(t => `<span class="tag">${escapeHtml(t)}</span>`).join("")}
      </div>
    `;
    el.addEventListener("click", () => openProject(p.id));
    el.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        openProject(p.id);
      }
    });
    return el;
  }

  function renderProjects(list) {
    grid.innerHTML = "";
    if (!list.length) {
      const empty = document.createElement("div");
      empty.className = "card";
      empty.innerHTML = `<strong>No matches.</strong><div style="margin-top:6px;color:var(--muted)">Try a different keyword — or delete the search.</div>`;
      grid.appendChild(empty);
      return;
    }
    list.forEach((p) => grid.appendChild(projectCard(p)));
  }

  if (grid) renderProjects(PROJECTS);

  function filterProjects(q) {
    const s = q.trim().toLowerCase();
    if (!s) return PROJECTS;
    return PROJECTS.filter((p) => {
      const blob = `${p.title} ${p.meta} ${p.blurb} ${p.tags.join(" ")} ${p.bullets.join(" ")}`.toLowerCase();
      return blob.includes(s);
    });
  }

  if (search) {
    search.addEventListener("input", () => renderProjects(filterProjects(search.value)));
    clearSearch?.addEventListener("click", () => {
      search.value = "";
      renderProjects(PROJECTS);
      search.focus();
    });
  }

  // ---------- Modal ----------
  const modal = qs("#modal");
  const modalTitle = qs("#modalTitle");
  const modalDesc = qs("#modalDesc");
  const modalMeta = qs("#modalMeta");
  const modalTags = qs("#modalTags");
  const modalLinks = qs("#modalLinks");
  const modalBullets = qs("#modalBullets");
  let lastFocus = null;

  function openModal() {
    modal.classList.add("is-open");
    modal.setAttribute("aria-hidden", "false");
    document.body.style.overflow = "hidden";
  }

  function closeModal() {
    modal.classList.remove("is-open");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
    if (lastFocus) lastFocus.focus();
  }

  function openProject(id) {
    const p = PROJECTS.find((x) => x.id === id);
    if (!p) return;
    lastFocus = document.activeElement;

    modalMeta.textContent = p.meta;
    modalTitle.textContent = p.title;
    modalDesc.textContent = p.blurb;

    modalTags.innerHTML = p.tags.map((t) => `<span class="tag">${escapeHtml(t)}</span>`).join("");

    const links = (p.links && p.links.length) ? p.links : [];
    modalLinks.innerHTML = [
      ...links.map((l) => `<a class="btn btn--ghost btn--sm" href="${escapeAttr(l.href)}" target="_blank" rel="noopener">${escapeHtml(l.label)} ↗</a>`),
      `<button class="btn btn--ghost btn--sm" type="button" data-copy="${escapeAttr(id)}">Copy project ID</button>`,
    ].join("");

    modalBullets.innerHTML = `<ul class="bullets">${p.bullets.map(b => `<li>${escapeHtml(b)}</li>`).join("")}</ul>`;

    openModal();
    // Move focus into modal close button
    const closeBtn = qs('[data-close]', modal);
    closeBtn?.focus();
  }

  // Close modal interactions
  qsa("[data-close]", modal).forEach((el) => el.addEventListener("click", closeModal));
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && modal.classList.contains("is-open")) closeModal();
  });

  // ---------- Copy ----------
  const toast = qs("#toast");
  let toastTimer = null;

  function showToast(msg) {
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add("is-show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove("is-show"), 1800);
  }

  async function copyText(text) {
    try {
      await navigator.clipboard.writeText(text);
      showToast("Copied ✦");
    } catch {
      // Fallback
      const ta = document.createElement("textarea");
      ta.value = text;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      ta.remove();
      showToast("Copied ✦");
    }
  }

  document.addEventListener("click", (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (!el) return;

  // Copy helpers (works even if user clicks on an icon/span inside the button)
  const copyBtn = el.closest("[data-copy]");
  if (copyBtn instanceof HTMLElement) {
    const copyVal = copyBtn.getAttribute("data-copy") || "";
    copyText(copyVal === "email" ? PROFILE.email : copyVal);
  }

  const linksBtn = el.closest("[data-copy-links]");
  if (linksBtn) {
    copyText(`GitHub: ${PROFILE.github}
LinkedIn: ${PROFILE.linkedin}
Email: ${PROFILE.email}`);
    showToast("Profile links copied ✦");
  }

  // Jump buttons (hero CTAs)
  const jumpBtn = el.closest("[data-jump]");
  if (jumpBtn instanceof HTMLElement) {
    const id = jumpBtn.getAttribute("data-jump");
    if (id) {
      e.preventDefault();
      activate(id);
      history.replaceState(null, "", `#${id}`);
      // optional: keep it snappy
      qs(`#panel-${id}`)?.scrollIntoView({ behavior: prefersReducedMotion() ? "auto" : "smooth", block: "start" });
    }
  }
});

// ---------- Contact form (mailto draft) ----------
  const form = qs("#contactForm");
  form?.addEventListener("submit", (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const name = (fd.get("name") || "").toString().trim();
    const email = (fd.get("email") || "").toString().trim();
    const message = (fd.get("message") || "").toString().trim();

    const subject = encodeURIComponent(`Portfolio message${name ? " from " + name : ""}`);
    const body = encodeURIComponent(
      [
        message || "(No message provided — but hey, you made it to my portfolio.)",
        "",
        "—",
        name ? `Name: ${name}` : null,
        email ? `Email: ${email}` : null,
        `Sent from: ${location.href}`,
      ].filter(Boolean).join("\n")
    );

    window.location.href = `mailto:${PROFILE.email}?subject=${subject}&body=${body}`;
  });

  // ---------- Glow mode (and press G) ----------
  const glowBtn = qs("#glowBtn");
  const glowKey = "hb_glow";

  function setGlow(on) {
    document.body.classList.toggle("glow", on);
    try { localStorage.setItem(glowKey, on ? "1" : "0"); } catch {}
    showToast(on ? "Glow on ✦" : "Glow off");
  }

  const savedGlow = (() => {
    try { return localStorage.getItem(glowKey) === "1"; } catch { return false; }
  })();

  setGlow(savedGlow);

  glowBtn?.addEventListener("click", () => setGlow(!document.body.classList.contains("glow")));
  window.addEventListener("keydown", (e) => {
    // Don't hijack typing in inputs
    const tag = (document.activeElement?.tagName || "").toLowerCase();
    if (tag === "input" || tag === "textarea") return;
    if (e.key.toLowerCase() === "g") setGlow(!document.body.classList.contains("glow"));
  });

  // ---------- Stats count-up ----------
const statEls = qsa(".stat__num[data-count]");
const animateStat = (el) => {
  if (el.dataset.done === "1") return;
  el.dataset.done = "1";

  const raw = el.getAttribute("data-count") || el.textContent.trim();
  const target = Number(raw);
  if (!Number.isFinite(target)) return;

  const suffix = el.getAttribute("data-suffix") || "";
  const decimalsAttr = el.getAttribute("data-decimals");
  const decimals = decimalsAttr ? Number(decimalsAttr) : (String(raw).includes(".") ? 1 : 0);
  const duration = prefersReducedMotion() ? 0 : 900;

  if (duration === 0) {
    el.textContent = `${target.toFixed(decimals)}${suffix}`;
    return;
  }

  const start = performance.now();
  const from = 0;

  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    // easeOutCubic
    const eased = 1 - Math.pow(1 - t, 3);
    const val = from + (target - from) * eased;
    el.textContent = `${val.toFixed(decimals)}${suffix}`;
    if (t < 1) requestAnimationFrame(tick);
  };
  requestAnimationFrame(tick);
};

if (statEls.length) {
  const statsWrap = qs(".stats") || statEls[0].closest("section");
  if (statsWrap && "IntersectionObserver" in window) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          statEls.forEach(animateStat);
          io.disconnect();
        }
      });
    }, { threshold: 0.35 });
    io.observe(statsWrap);
  } else {
    // fallback
    statEls.forEach(animateStat);
  }
}

// ---------- Footer year ----------
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- Particle Constellation ----------
  const canvas = qs("#particles");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;
  const prefersReducedMotion = () => !!reduceMotion;

  const ctx = canvas?.getContext("2d");
  let W = 0, H = 0, DPR = 1;
  let particles = [];
  const N = 56;

  function resizeCanvas() {
    if (!canvas || !ctx) return;
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = Math.floor(window.innerWidth);
    H = Math.floor(window.innerHeight);
    canvas.width = Math.floor(W * DPR);
    canvas.height = Math.floor(H * DPR);
    canvas.style.width = W + "px";
    canvas.style.height = H + "px";
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
  }

  function rand(min, max) { return Math.random() * (max - min) + min; }

  function initParticles() {
    particles = Array.from({ length: N }, () => ({
      x: rand(0, W),
      y: rand(0, H),
      vx: rand(-0.18, 0.18),
      vy: rand(-0.14, 0.14),
      r: rand(1.2, 2.2),
    }));
  }

  function draw() {
    if (!ctx || reduceMotion) return;

    ctx.clearRect(0, 0, W, H);

    // nodes
    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      if (p.x < -20) p.x = W + 20;
      if (p.x > W + 20) p.x = -20;
      if (p.y < -20) p.y = H + 20;
      if (p.y > H + 20) p.y = -20;
    }

    // edges
    const maxDist = 130;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const a = particles[i], b = particles[j];
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        const d = Math.hypot(dx, dy);
        if (d < maxDist) {
          const alpha = (1 - d / maxDist) * 0.18;
          ctx.strokeStyle = `rgba(124, 58, 237, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    // points
    for (const p of particles) {
      const glow = document.body.classList.contains("glow") ? 0.35 : 0.22;
      ctx.fillStyle = `rgba(37, 99, 235, ${glow})`;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fill();
    }

    requestAnimationFrame(draw);
  }

  if (canvas && ctx) {
    resizeCanvas();
    initParticles();
    if (!reduceMotion) requestAnimationFrame(draw);
  }

  // ---------- Helpers ----------
  function escapeHtml(str) {
    return String(str)
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#039;");
  }
  function escapeAttr(str) {
    return String(str).replaceAll('"', "&quot;");
  }
})();
