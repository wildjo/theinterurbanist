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

  // ----- Horizontal navigation in Sections view (arrows + swipe) -----
  const scroller = qs(".grid");
  const leftBtn  = qs(".nav-arrows .left");
  const rightBtn = qs(".nav-arrows .right");

  if (scroller && leftBtn && rightBtn) {
    const page = () => Math.max(1, Math.floor(scroller.clientWidth * 0.9));

    const updateArrows = () => {
      const max = scroller.scrollWidth - scroller.clientWidth;
      if (max <= 4) {
        leftBtn.style.display = "none";
        rightBtn.style.display = "none";
        return;
      }
      leftBtn.style.display  = scroller.scrollLeft > 4 ? "flex" : "none";
      rightBtn.style.display = scroller.scrollLeft < max - 4 ? "flex" : "none";
    };

    leftBtn.addEventListener("click",  () => scroller.scrollBy({ left: -page(), behavior: "smooth" }));
    rightBtn.addEventListener("click", () => scroller.scrollBy({ left:  page(), behavior: "smooth" }));
    scroller.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);
    updateArrows();

    // basic swipe (don’t fight vertical scrolling)
    let startX = null, startY = null;
    scroller.addEventListener("touchstart", e => {
      if (e.touches.length !== 1) return;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
    }, { passive: true });

    scroller.addEventListener("touchend", e => {
      if (startX == null || startY == null) return;
      const dx = e.changedTouches[0].clientX - startX;
      const dy = Math.abs(e.changedTouches[0].clientY - startY);
      startX = startY = null;
      if (dy > 40 || Math.abs(dx) < 50) return; // vertical intent or tiny swipe
      scroller.scrollBy({ left: dx > 0 ? -page() : page(), behavior: "smooth" });
    });
  }

  // ----- Lightbox safe init (if present) -----
  if (typeof window.Lightbox === "object" && typeof window.Lightbox.init === "function") {
    try { window.Lightbox.init(); } catch (_) {}
  }
})();
