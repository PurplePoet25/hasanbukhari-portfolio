/* Hasan Bukhari — Portfolio (vanilla JS)
   Features:
   - Tabbed navigation with animated indicator + URL hash
   - Projects grid + modal
   - Copy-to-clipboard buttons
   - Particle constellation background
   - "Glow" toggle (and press G)
*/

(() => {
  const qs = (s, el = document) => el.querySelector(s);
  const qsa = (s, el = document) => Array.from(el.querySelectorAll(s));

  // ---------- Data ----------
  const PROFILE = {
    email: "hasan.bukhari@usm.edu",
    github: "https://github.com/PurplePoet25",
    linkedin: "https://linkedin.com/in/hasan-bukhari-7ab080305/",
  };

  const PROJECTS = [
    {
      id: "qtl",
      title: "QTL Analysis Toolkit",
      meta: "Python • Pandas • Matplotlib",
      icon: "🧬",
      blurb:
        "Interactive genome‑wide QTL scans linking genotype to phenotype. Produces LOD plots + CSV outputs.",
      tags: ["Python", "Pandas", "Matplotlib", "Bioinformatics", "Data Viz"],
      bullets: [
        "Runs genome‑wide scans and summarizes peak regions with exportable tables.",
        "Plots LOD curves and clean, presentation‑ready figures.",
        "Designed for iterative experimentation and reproducible outputs.",
      ],
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/QTL-Analysis-Toolkit }
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
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/BuriDriftSimulator }
      ],
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
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/Selection-Simulator-Wright-Fisher-Deterministic-Stochastic- }
      ],
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
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/ProtienVis }
      ],
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
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/ToAshAgain }
      ],
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
      links: [
        { label: "GitHub", href: https://github.com/PurplePoet25/Sc-Roll-Concept-Project }
      ],
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
    const t = e.target;
    if (!(t instanceof HTMLElement)) return;

    const copyVal = t.getAttribute("data-copy");
    if (copyVal) {
      copyText(copyVal === "email" ? PROFILE.email : copyVal);
    }

    if (t.hasAttribute("data-copy-links")) {
      copyText(`GitHub: ${PROFILE.github}\nLinkedIn: ${PROFILE.linkedin}\nEmail: ${PROFILE.email}`);
      showToast("Profile links copied ✦");
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

  // ---------- Footer year ----------
  const year = qs("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  // ---------- Particle Constellation ----------
  const canvas = qs("#particles");
  const reduceMotion = window.matchMedia?.("(prefers-reduced-motion: reduce)")?.matches;

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
