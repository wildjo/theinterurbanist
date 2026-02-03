// site.js — The Interurbanist
// Header collapse, view toggle, font sizing, lightbox
(() => {
  "use strict";

  const qs = (sel, ctx = document) => ctx.querySelector(sel);
  const qsa = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  // ==========================================================================
  // Header Collapse on Scroll
  // ==========================================================================

  const header = qs(".site-header");
  const isSingleEntry = document.body.classList.contains("single-entry");
  let lastScroll = 0;
  const collapseThreshold = 100;

  function handleScroll() {
    if (!header) return;
    if (isSingleEntry) {
      header.classList.add("collapsed");
      return;
    }
    const currentScroll = window.scrollY;
    const scrollingDown = currentScroll > lastScroll;

    if (currentScroll > collapseThreshold && scrollingDown) {
      header.classList.add("collapsed");
    } else if (currentScroll <= collapseThreshold) {
      header.classList.remove("collapsed");
    }

    lastScroll = currentScroll;
  }

  window.addEventListener("scroll", handleScroll, { passive: true });
  document.addEventListener("DOMContentLoaded", handleScroll);

  // ==========================================================================
  // View Switching (Timeline ↔ Sections)
  // ==========================================================================

  const sectionsView = qs(".sections-view");
  const timelineView = qs(".timeline-view");
  const onHome = !!sectionsView || !!timelineView;

  function setView(mode) {
    const root = document.documentElement;

    if (mode === "sections") {
      root.classList.add("mode-sections");
      root.classList.remove("mode-timeline");
    } else {
      root.classList.add("mode-timeline");
      root.classList.remove("mode-sections");
    }

    // Update button states
    qsa(".view-toggle-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.mode === mode);
    });

    // Save preference
    try {
      localStorage.setItem("viewMode", mode);
    } catch (e) {}

    // Update URL without reload
    const url = new URL(location.href);
    url.searchParams.set("view", mode);
    history.replaceState({}, "", url);
  }

  function initView() {
    // Check URL param first
    const params = new URLSearchParams(location.search);
    const urlMode = params.get("view");

    if (urlMode === "sections" || urlMode === "timeline") {
      setView(urlMode);
      return;
    }

    // Then check localStorage
    try {
      const saved = localStorage.getItem("viewMode");
      if (saved === "sections" || saved === "timeline") {
        setView(saved);
        return;
      }
    } catch (e) {}

    // Default to timeline
    setView("timeline");
  }

  // Set up toggle buttons
  document.addEventListener("DOMContentLoaded", () => {
    initView();

    qsa(".view-toggle-btn[data-mode]").forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        setView(btn.dataset.mode);
      });
    });

    // Also handle old-style tab links if present
    qsa("a.mode-toggle[data-mode]").forEach(a => {
      a.addEventListener("click", (e) => {
        e.preventDefault();
        setView(a.dataset.mode);
      });
    });

    // Elevator Uplifts random image
    const elevator = qs(".elevator-uplifts");
    if (elevator) {
      const img = qs(".elevator-uplifts-image", elevator);
      const btn = qs(".elevator-uplifts-button", elevator);
      const count = parseInt(elevator.dataset.count || "0", 10);
      const prefix = elevator.dataset.prefix || "";
      const ext = elevator.dataset.ext || "jpg";
      const pad = parseInt(elevator.dataset.pad || "3", 10);
      const dir = elevator.dataset.dir || "";

      const padNum = (n) => String(n).padStart(pad, "0");
      const srcFor = (n) => `${dir}/${prefix}${padNum(n)}.${ext}`;

      const pickRandom = () => {
        if (!img || !btn || count <= 0) return;
        if (count === 1) {
          img.src = srcFor(1);
          return;
        }
        const current = img.getAttribute("src") || "";
        let next = current;
        let guard = 0;
        while (next === current && guard < 10) {
          const n = Math.floor(Math.random() * count) + 1;
          next = srcFor(n);
          guard += 1;
        }
        img.src = next;
      };

      btn?.addEventListener("click", pickRandom);
    }
  });

  // ==========================================================================
  // Font Size Controls (Persisted)
  // ==========================================================================

  const minScale = 0.85;
  const maxScale = 1.6;
  const step = 0.1;

  let scale = 1;
  try {
    scale = parseFloat(localStorage.getItem("uiScale") || "1");
  } catch (e) {}

  function applyScale() {
    document.documentElement.style.fontSize = (scale * 100) + "%";
  }

  function saveScale() {
    try {
      localStorage.setItem("uiScale", String(scale));
    } catch (e) {}
    applyScale();
  }

  // Apply saved scale on load
  applyScale();

  document.addEventListener("DOMContentLoaded", () => {
    qsa(".fs-inc, .text-size-inc").forEach(btn => {
      btn.addEventListener("click", () => {
        scale = Math.min(maxScale, +(scale + step).toFixed(2));
        saveScale();
      });
    });

    qsa(".fs-dec, .text-size-dec").forEach(btn => {
      btn.addEventListener("click", () => {
        scale = Math.max(minScale, +(scale - step).toFixed(2));
        saveScale();
      });
    });
  });

  // ==========================================================================
  // Sections Horizontal Scroll (Wrap-around)
  // ==========================================================================

  document.addEventListener("DOMContentLoaded", () => {
    const strip = qs(".sections-strip");
    if (!strip) return;

    const columns = qsa(".section-column", strip);
    if (columns.length < 2) return;

    // Add navigation hints
    let currentSection = 0;

    // Detect which section is visible
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const index = columns.indexOf(entry.target);
          if (index !== -1) currentSection = index;
        }
      });
    }, {
      root: strip,
      threshold: 0.5
    });

    columns.forEach(col => observer.observe(col));

    // Keyboard navigation for sections
    strip.addEventListener("keydown", (e) => {
      if (e.key === "ArrowRight") {
        e.preventDefault();
        currentSection = (currentSection + 1) % columns.length;
        columns[currentSection].scrollIntoView({ behavior: "smooth", inline: "start" });
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        currentSection = (currentSection - 1 + columns.length) % columns.length;
        columns[currentSection].scrollIntoView({ behavior: "smooth", inline: "start" });
      }
    });
  });

  // ==========================================================================
  // Lightbox (if not already loaded)
  // ==========================================================================

  if (typeof window.Lightbox !== "object") {
    document.addEventListener("DOMContentLoaded", () => {
      // Create overlay if it doesn't exist
      if (qs(".lb-overlay")) return;

      const overlay = document.createElement("div");
      overlay.className = "lb-overlay";
      overlay.innerHTML = `
        <img class="lb-img" alt="">
        <div class="lb-ui">
          <button class="lb-btn prev" aria-label="Previous">◀</button>
          <button class="lb-btn next" aria-label="Next">▶</button>
          <button class="lb-btn close" aria-label="Close">✕</button>
        </div>
      `;
      document.body.appendChild(overlay);

      let group = [];
      let index = 0;

      const imgEl = () => overlay.querySelector(".lb-img");

      function openAt(i, arr) {
        group = arr || group;
        index = (i + group.length) % group.length;
        imgEl().src = group[index];
        overlay.classList.add("active");
        document.body.style.overflow = "hidden";
      }

      function close() {
        overlay.classList.remove("active");
        imgEl().src = "";
        document.body.style.overflow = "";
      }

      overlay.addEventListener("click", (e) => {
        if (e.target === overlay) close();
      });

      document.addEventListener("keydown", (e) => {
        if (!overlay.classList.contains("active")) return;
        if (e.key === "Escape") close();
        if (e.key === "ArrowRight") openAt(index + 1);
        if (e.key === "ArrowLeft") openAt(index - 1);
      });

      overlay.querySelector(".close").addEventListener("click", (e) => {
        e.stopPropagation();
        close();
      });

      overlay.querySelector(".next").addEventListener("click", (e) => {
        e.stopPropagation();
        openAt(index + 1);
      });

      overlay.querySelector(".prev").addEventListener("click", (e) => {
        e.stopPropagation();
        openAt(index - 1);
      });

      // Handle clicks on lightbox-enabled images
      document.addEventListener("click", (e) => {
        const a = e.target.closest("a.lb");
        if (!a) return;

        e.preventDefault();
        const g = a.dataset.group || ("solo-" + Math.random());
        const groupEls = qsa(`a.lb[data-group="${g}"]`);
        const arr = groupEls.length ? groupEls.map(el => el.getAttribute("href")) : [a.getAttribute("href")];
        openAt(arr.indexOf(a.getAttribute("href")), arr);
      });

      // Also handle images in entry body
      document.addEventListener("click", (e) => {
        const img = e.target.closest(".entry-body img");
        if (!img || img.closest("a")) return;

        e.preventDefault();
        openAt(0, [img.currentSrc || img.src]);
      });
    });
  }

})();
