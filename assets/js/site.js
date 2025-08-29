// site.js — sane, self-contained behaviors
(() => {
  "use strict";

  const qs  = (sel, ctx=document) => ctx.querySelector(sel);
  const qsa = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // ----- View switching (Timeline ↔ Sections) -----
  const sectionsView = qs(".sections-view");
  const timelineView = qs(".timeline-view");
  const onHome = !!sectionsView && !!timelineView;

  function show(mode) {
    if (!onHome) return;
    if (mode === "sections") {
      sectionsView.style.display = "";
      timelineView.style.display = "none";
      document.documentElement.classList.add("mode-sections");
      document.documentElement.classList.remove("mode-timeline");
    } else {
      sectionsView.style.display = "none";
      timelineView.style.display = "";
      document.documentElement.classList.add("mode-timeline");
      document.documentElement.classList.remove("mode-sections");
    }
  }

  // Honor ?view=sections|timeline on load
  document.addEventListener("DOMContentLoaded", () => {
    const params = new URLSearchParams(location.search);
    const requested = params.get("view");
    if (onHome && (requested === "sections" || requested === "timeline")) {
      show(requested);
    }

    // On Home, intercept tab clicks for instant switching; elsewhere, let them navigate home
    if (onHome) {
      qsa("a.mode-toggle[data-mode]").forEach(a => {
        a.addEventListener("click", ev => {
          ev.preventDefault();
          const mode = a.dataset.mode === "sections" ? "sections" : "timeline";
          show(mode);
          const url = new URL(location.href);
          url.searchParams.set("view", mode);
          history.replaceState({}, "", url);
        });
      });
    }
  });

  // ----- Font size controls (persisted) -----
  const minScale = 0.85, maxScale = 1.6, step = 0.1;
  let scale = parseFloat(localStorage.getItem("uiScale") || "1");
  applyScale();

  function applyScale() {
    document.documentElement.style.fontSize = (scale * 100) + "%";
  }
  function saveScale() {
    localStorage.setItem("uiScale", String(scale));
    applyScale();
  }

  qsa(".fs-inc").forEach(btn => btn.addEventListener("click", () => {
    scale = Math.min(maxScale, +(scale + step).toFixed(2));
    saveScale();
  }));
  qsa(".fs-dec").forEach(btn => btn.addEventListener("click", () => {
    scale = Math.max(minScale, +(scale - step).toFixed(2));
    saveScale();
  }));

  // ----- Lightbox safe init (if present) -----
  if (typeof window.Lightbox === "object" && typeof window.Lightbox.init === "function") {
    try { window.Lightbox.init(); } catch (_) {}
  }
})();
