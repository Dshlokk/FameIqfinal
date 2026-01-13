// main.js
// FAMEIQ – shared behavior for all pages
// Clean, conflict-free, responsive-safe



/* =========================================
   GLOBAL SAFE RESIZE GUARD (TOUCH DEVICES)
   Prevents animation refresh on scroll
========================================= */

const SafeViewport = (() => {
  let lastWidth = window.innerWidth;
  let lastHeight = window.innerHeight;

  function isRealResize() {
    const w = window.innerWidth;
    const h = window.innerHeight;

    const widthChanged = Math.abs(w - lastWidth) > 80;
    const heightChanged = Math.abs(h - lastHeight) > 120;

    lastWidth = w;
    lastHeight = h;

    return widthChanged || heightChanged;
  }

  return {
    onResize(callback) {
      window.addEventListener(
        "resize",
        () => {
          // Ignore scroll-induced resize on touch devices
          const isTouch =
            "ontouchstart" in window ||
            navigator.maxTouchPoints > 0;

          if (isTouch && !isRealResize()) return;

          callback();
        },
        { passive: true }
      );
    }
  };
})();



(() => {
  "use strict";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ===============================
     DOM READY HELPER
  =============================== */
  function onReady(fn) {
    if (document.readyState === "loading") {
      document.addEventListener("DOMContentLoaded", fn);
    } else {
      fn();
    }
  }

  /* ===============================
     PAGE FADE-IN
  =============================== */
  function initPageTransition() {
    document.documentElement.classList.add("page-is-ready");
  }

  /* ===============================
     SCROLL REVEAL
  =============================== */
  function initScrollReveal() {
    const elements = document.querySelectorAll(".reveal-up, .reveal-fade");
    if (!elements.length) return;

    if (!prefersReducedMotion && "IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              entry.target.classList.add("reveal-visible");
              obs.unobserve(entry.target);
            }
          });
        },
        {
          threshold: 0.2,
          rootMargin: "0px 0px -60px 0px"
        }
      );

      elements.forEach(el => observer.observe(el));
    } else {
      elements.forEach(el => el.classList.add("reveal-visible"));
    }
  }

  /* ===============================
     METRIC COUNT UP
  =============================== */
  function initMetricCountUp() {
    const metrics = document.querySelectorAll(".metric-value[data-target]");
    if (!metrics.length) return;

    function animate(el) {
      const target = Number(el.dataset.target);
      if (!target) return;

      const duration = 1200;
      const start = performance.now();

      function tick(now) {
        const progress = Math.min((now - start) / duration, 1);
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);

        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }

      requestAnimationFrame(tick);
    }

    if ("IntersectionObserver" in window && !prefersReducedMotion) {
      const observer = new IntersectionObserver(
        (entries, obs) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              animate(entry.target);
              obs.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.6 }
      );

      metrics.forEach(el => observer.observe(el));
    } else {
      metrics.forEach(el => (el.textContent = el.dataset.target));
    }
  }

  /* ===============================
     FAQ TOGGLE
  =============================== */
  function initFaq() {
    const items = document.querySelectorAll(".faq-item");
    if (!items.length) return;

    items.forEach(item => {
      item.addEventListener("click", () => {
        item.classList.toggle("is-open");
      });
    });
  }

  /* ===============================
     YELLOW BOX ROLLOUT (AKIO STYLE)
  =============================== */
  function initHighlightRollout() {
    const highlights = document.querySelectorAll(".highlight-inline");
    if (!highlights.length) return;

    if (prefersReducedMotion) {
      highlights.forEach(el => el.classList.add("is-active"));
      return;
    }

    highlights.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add("is-active");
      }, 150 + index * 160);
    });
  }

  /* ===============================
     FOOTER YEAR
  =============================== */
  function initFooterYear() {
    const yearEl = document.getElementById("year");
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }


/* =========================================
   ADVANCED WEB — PREMIUM BUBBLE WORD ROTATION
========================================= */
function initAdvancedWebBubble() {
  const wrapper = document.querySelector(".highlight-rollout");
  if (!wrapper) return;

  // Ensure inner span exists
  let textEl = wrapper.querySelector(".roll-text");
  if (!textEl) {
    textEl = document.createElement("span");
    textEl.className = "roll-text roll-in";
    textEl.textContent = wrapper.textContent.trim();
    wrapper.textContent = "";
    wrapper.appendChild(textEl);
  }

  const words = wrapper.dataset.words
    .split(",")
    .map(w => w.trim());

  let index = 0;
  let direction = true; // true = LTR, false = RTL
  const INTERVAL = 2600;

  if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    textEl.textContent = words[0];
    return;
  }

  setInterval(() => {
    // TEXT EXIT
    textEl.classList.remove("roll-in");
    textEl.classList.add("roll-out");

    // BUBBLE retreats
    wrapper.style.transformOrigin = direction ? "right center" : "left center";
    wrapper.style.transform = "scaleX(0.92)";

    setTimeout(() => {
      // CHANGE WORD
      index = (index + 1) % words.length;
      textEl.textContent = words[index];

      // SWITCH DIRECTION
      direction = !direction;

      // BUBBLE rolls in opposite direction
      wrapper.style.transformOrigin = direction ? "left center" : "right center";
      wrapper.style.transform = "scaleX(1)";

      // TEXT ENTER
      textEl.classList.remove("roll-out");
      textEl.classList.add("roll-in");
    }, 420);

  }, INTERVAL);
}



// FAB Navigation Toggle
function initFabNav() {
  const container = document.querySelector('.fab-nav-container');
  if (!container) return;
  
  const btn = container.querySelector('.fab-nav-btn');
  
  btn.addEventListener('click', () => {
    const isOpen = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', !isOpen);
  });
}

// Initialize
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initFabNav);
} else {
  initFabNav();
}


// ChatGPT-style Plus Menu
(() => {
  const root = document.getElementById("plusMenuRoot");
  const toggle = document.getElementById("plusToggle");

  if (!root || !toggle) return;

  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    root.classList.toggle("open");
  });

  document.addEventListener("click", (e) => {
    if (!root.contains(e.target)) {
      root.classList.remove("open");
    }
  });
})();

// ============ Scroll-driven 3D Illusion Background ============

// Guard: if element or environment is missing, safely exit
const scrollIllusionEl = document.querySelector('.scroll-illusion-bg');
if (scrollIllusionEl) {
  const prefersReducedMotion = window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Scroll configuration (can be tweaked per brand feel)
  const MIN_SCALE = 0.88; // very top of page
  const MAX_SCALE = 2.4;  // bottom of page on desktop
  const MOBILE_MAX_SCALE = 1.7; // capped for small screens
  const TABLET_MAX_SCALE = 2.0;

  let latestScrollY = window.scrollY || window.pageYOffset || 0;
  let ticking = false;

  // Helper: figure out how far down the page we are (0 → top, 1 → bottom)
  function getScrollProgress() {
    const doc = document.documentElement;
    const scrollTop = window.scrollY || window.pageYOffset || doc.scrollTop || 0;
    const scrollHeight = doc.scrollHeight - doc.clientHeight;
    if (scrollHeight <= 0) return 0;
    return Math.min(1, Math.max(0, scrollTop / scrollHeight));
  }

  // Helper: device-aware max scale (desktop > tablet > mobile)
  function getDeviceMaxScale() {
    const width = window.innerWidth || document.documentElement.clientWidth;
    if (width < 768) return MOBILE_MAX_SCALE;
    if (width < 1024) return TABLET_MAX_SCALE;
    return MAX_SCALE;
  }

  // Core function: update transform based on scroll position
  function updateScrollIllusion() {
    ticking = false;

    // Respect motion preferences: keep element mostly static
    if (prefersReducedMotion) {
      scrollIllusionEl.style.transform =
        'translate3d(0, 0, 0) scale(1)';
      return;
    }

    const progress = getScrollProgress(); // 0 → 1
    const maxScale = getDeviceMaxScale();

    // Use a slightly eased curve for more premium feel
    const eased = progress * progress * (3 - 2 * progress); // smoothstep

    const scale = MIN_SCALE + (maxScale - MIN_SCALE) * eased;

  // Depth illusion: subtle upward movement + perspective
const depthY = (1 - eased) * 18; // px (far → near)
const perspective = 900; // fixed, safe value

scrollIllusionEl.style.transform =
  `perspective(${perspective}px)
  translate3d(0, ${depthY.toFixed(2)}px, 0)
  scale(${scale.toFixed(3)})`;

// State classes for visual tuning
scrollIllusionEl.classList.toggle('is-near', eased > 0.85);
scrollIllusionEl.classList.toggle('is-far', eased < 0.25);

  }

  // Run on scroll using requestAnimationFrame for performance
  function onScroll() {
    latestScrollY = window.scrollY || window.pageYOffset || 0;
    if (!ticking) {
      ticking = true;
      window.requestAnimationFrame(updateScrollIllusion);
    }
  }

  // Keep responsive behaviour on resize and orientation change
  function onResize() {
    window.requestAnimationFrame(updateScrollIllusion);
  }

  // Initial paint
  updateScrollIllusion();
  


  // Passive listeners for scroll / resize
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', onResize);
  window.addEventListener('orientationchange', onResize);
}

// --- Add rotational depth based on scroll ---
const rotationBase = 360;

function updateRotation(progress) {
  const angle = rotationBase * progress;

  document.querySelectorAll('.scroll-illusion-bg').forEach((el, index) => {
    const multiplier = index === 0 ? 1 : index === 1 ? 0.6 : 0.4;
    el.style.rotate = `${angle * multiplier}deg`;
  });
}

/* =========================================
   PREMIUM VELOCITY CURSOR SYSTEM
========================================= */

(() => {
  const blob = document.createElement("div");
  blob.className = "cursor-blob";
  blob.innerHTML = "<span></span>";
  document.body.appendChild(blob);

  let x = window.innerWidth / 2;
  let y = window.innerHeight / 2;
  let tx = x;
  let ty = y;

  let lastX = x;
  let lastY = y;
  let velocity = 0;

  let idleTimer;
  const IDLE_DELAY = 900;

  function activate() {
    blob.classList.add("is-visible");
    blob.classList.remove("is-idle");
    clearTimeout(idleTimer);

    idleTimer = setTimeout(() => {
      blob.classList.add("is-idle");
    }, IDLE_DELAY);
  }

  function animate() {
    x += (tx - x) * 0.18;
    y += (ty - y) * 0.18;

    const dx = tx - lastX;
    const dy = ty - lastY;
    velocity = Math.min(30, Math.hypot(dx, dy));

    /* Velocity scale */
    const scale = 1 + velocity * 0.015;
    blob.style.transform =
      `translate(-50%, -50%) scale(${scale.toFixed(2)})`;

    /* Directional light illusion */
    const lx = 35 + dx * 0.8;
    const ly = 35 + dy * 0.8;
    blob.style.setProperty("--lx", `${lx}%`);
    blob.style.setProperty("--ly", `${ly}%`);

    blob.style.left = x + "px";
    blob.style.top = y + "px";

    lastX = x;
    lastY = y;

    requestAnimationFrame(animate);
  }
  animate();

  /* Desktop */
  window.addEventListener("mousemove", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("mousedown", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();

    blob.style.transform += " scale(0.85)";
  });

  /* Mobile & tablet */
  window.addEventListener("touchstart", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });
})();

/* =========================================
   PREMIUM FLUID CURSOR TAIL (DIV ONLY)
========================================= */

(() => {
  const container = document.getElementById("cursorFluid");
  if (!container) return;

  const DOTS = 14;              // tail length
  const SPACING = 0.18;         // fluid smoothness
  const OFFSET = 14;            // stays behind cursor
  const IDLE_DELAY = 900;

  let tx = innerWidth / 2;
  let ty = innerHeight / 2;

  let idleTimer;
  let isActive = false;

  const points = Array.from({ length: DOTS }).map(() => ({
    x: tx,
    y: ty
  }));

  const dots = points.map((_, i) => {
    const el = document.createElement("div");
    el.className = "cursor-fluid-dot";
    el.style.width = `${10 - i * 0.45}px`;
    el.style.height = el.style.width;
    el.style.filter = `blur(${6 + i * 0.6}px)`;
    container.appendChild(el);
    return el;
  });

  function activate() {
    isActive = true;
    dots.forEach(d => d.classList.add("is-active"));
    dots.forEach(d => d.classList.remove("is-idle"));

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      isActive = false;
      dots.forEach(d => d.classList.add("is-idle"));
    }, IDLE_DELAY);
  }

  function animate() {
    // Lead point (offset behind cursor)
    const dx = points[0].x - tx;
    const dy = points[0].y - ty;
    const dist = Math.hypot(dx, dy) || 1;

    const ox = tx + (dx / dist) * OFFSET;
    const oy = ty + (dy / dist) * OFFSET;

    points[0].x += (ox - points[0].x) * 0.35;
    points[0].y += (oy - points[0].y) * 0.35;

    // Follow chain (fluid physics illusion)
    for (let i = 1; i < points.length; i++) {
      points[i].x += (points[i - 1].x - points[i].x) * SPACING;
      points[i].y += (points[i - 1].y - points[i].y) * SPACING;
    }

    // Render
    dots.forEach((dot, i) => {
      dot.style.transform =
        `translate(${points[i].x}px, ${points[i].y}px) translate(-50%, -50%)`;
    });

    requestAnimationFrame(animate);
  }

  animate();

  /* INPUT */
  window.addEventListener("mousemove", e => {
    tx = e.clientX;
    ty = e.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchstart", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    const t = e.touches[0];
    tx = t.clientX;
    ty = t.clientY;
    activate();
  }, { passive: true });
})();




/* =========================================
   FAMEIQ — PREMIUM CURSOR + FLUID TAIL
   Mobile & Tablet Optimized (NO LAG)
========================================= */

(() => {
  const blob = document.querySelector(".cursor-blob");
  if (!blob) return;

  const isMobile = window.innerWidth < 768;
  const isTablet = window.innerWidth >= 768 && window.innerWidth < 1024;

  /* ===============================
     TAIL CONFIG (DEVICE AWARE)
  =============================== */

  const TAIL_COUNT = isMobile ? 6 : isTablet ? 7 : 8;

  const FOLLOW_SPEED = isMobile
    ? 0.35
    : isTablet
    ? 0.28
    : 0.18;

  const IDLE_DELAY = 900;

  /* ===============================
     CREATE TAIL ELEMENTS
  =============================== */

  const tails = [];
  for (let i = 0; i < TAIL_COUNT; i++) {
    const t = document.createElement("div");
    t.className = "cursor-tail is-idle";
    document.body.appendChild(t);
    tails.push({
      el: t,
      x: window.innerWidth / 2,
      y: window.innerHeight / 2
    });
  }

  /* ===============================
     POSITION TRACKING
  =============================== */

  let tx = window.innerWidth / 2;
  let ty = window.innerHeight / 2;
  let idleTimer;

  function activate() {
    blob.classList.add("is-active");
    blob.classList.remove("is-idle");

    tails.forEach(t => {
      t.el.classList.add("is-active");
      t.el.classList.remove("is-idle");
    });

    clearTimeout(idleTimer);
    idleTimer = setTimeout(() => {
      blob.classList.add("is-idle");
      tails.forEach(t => t.el.classList.add("is-idle"));
    }, IDLE_DELAY);
  }

  /* ===============================
     MAIN ANIMATION LOOP
  =============================== */

  function animate() {
    let prevX = tx;
    let prevY = ty;

    tails.forEach((t, i) => {
      const delay = (i + 1) * 0.55;

      t.x += (prevX - t.x) * FOLLOW_SPEED;
      t.y += (prevY - t.y) * FOLLOW_SPEED;

      t.el.style.left = t.x + "px";
      t.el.style.top = t.y + "px";
      t.el.style.transform =
        `translate(-50%, -50%) scale(${0.7 - i * 0.05})`;

      prevX = t.x;
      prevY = t.y;
    });

    requestAnimationFrame(animate);
  }

  animate();

  /* ===============================
     INPUT EVENTS
  =============================== */

  window.addEventListener(
    "mousemove",
    e => {
      tx = e.clientX;
      ty = e.clientY;
      activate();
    },
    { passive: true }
  );

  window.addEventListener(
    "touchstart",
    e => {
      const t = e.touches[0];
      tx = t.clientX;
      ty = t.clientY;
      activate();
    },
    { passive: true }
  );

  window.addEventListener(
    "touchmove",
    e => {
      const t = e.touches[0];
      tx = t.clientX;
      ty = t.clientY;
      activate();
    },
    { passive: true }
  );

})();




/* =========================================
   DIRECTIONAL 3D BACKGROUND OBJECT FIELD
   (FINAL – ALL DEVICES)
========================================= */

(() => {
  // ❌ Disable on Home page
  if (document.body.dataset.page === "home") return;

  const layer = document.createElement("div");
  layer.className = "bg-objects";
  document.body.appendChild(layer);

  const SHAPES = ["shape-cube", "shape-cylinder", "shape-cone"];
  const OBJECT_COUNT = 20;
  const objects = [];

  /* ===============================
     CREATE OBJECTS
  =============================== */

  for (let i = 0; i < OBJECT_COUNT; i++) {
  const el = document.createElement("div");

  const size = 40 + Math.random() * 80;
  const power = 6 + Math.random() * 10;

  const depthRand = Math.random();
  let depth = "mid";
  if (depthRand < 0.33) depth = "far";
  else if (depthRand > 0.66) depth = "near";

  el.className = `bg-object ${SHAPES[i % SHAPES.length]}`;


  
  el.style.setProperty("--size", `${size}px`);
  el.style.left = `${Math.random() * 100}%`;
  el.style.top = `${Math.random() * 100}%`;

  el.dataset.power = power;
  el.dataset.depth = depth;

  // random drift offsets
  el.dataset.dx = (Math.random() - 0.5) * 30;
  el.dataset.dy = (Math.random() - 0.5) * 30;

  layer.appendChild(el);
  objects.push(el);
}

  /* ===============================
     INPUT NORMALIZATION
  =============================== */

  let tx = 0.5;
  let ty = 0.5;
  let cx = tx;
  let cy = ty;

  function setTarget(x, y) {
    tx = x;
    ty = y;
  }

  /* Mouse */
  window.addEventListener("mousemove", e => {
    setTarget(
      e.clientX / window.innerWidth,
      e.clientY / window.innerHeight
    );
  }, { passive: true });

  /* Touch */
  window.addEventListener("touchmove", e => {
    if (!e.touches[0]) return;
    setTarget(
      e.touches[0].clientX / window.innerWidth,
      e.touches[0].clientY / window.innerHeight
    );
  }, { passive: true });

  /* Gyroscope (mobile premium effect) */
  if (window.DeviceOrientationEvent) {
    window.addEventListener("deviceorientation", e => {
      if (e.beta == null || e.gamma == null) return;

      const x = Math.max(-30, Math.min(30, e.gamma)) / 60 + 0.5;
      const y = Math.max(-30, Math.min(30, e.beta)) / 60 + 0.5;

      setTarget(x, y);
    }, true);
  }



  /* ===============================
     ANIMATION LOOP (SPRING BASED)
  =============================== */

  function animate() {
    // smooth follow (elastic)
    cx += (tx - cx) * 0.06;
    cy += (ty - cy) * 0.06;

    const nx = (cx - 0.5) * 2;
    const ny = (cy - 0.5) * 2;
    const time = Date.now() * 0.00035;

    objects.forEach((el, i) => {
      const depth =
        el.dataset.depth === "near" ? 1 :
        el.dataset.depth === "mid" ? 0.6 : 0.35;

      const baseX = el.dataset.ox * depth;
      const baseY = el.dataset.oy * depth;

      /* Subtle idle motion */
      const idleX = Math.sin(time + i) * 10 * depth;
      const idleY = Math.cos(time + i) * 10 * depth;

      /* Cursor influence (VIDEO STYLE) */
      const pullX = nx * 40 * depth;
      const pullY = ny * 40 * depth;

      const rotateX = ny * 18 * depth;
      const rotateY = -nx * 18 * depth;
      const rotateZ = Math.sin(time + i) * 8;

      el.style.transform = `
        translate3d(${baseX + idleX + pullX}px, ${baseY + idleY + pullY}px, 0)
        rotateX(${rotateX}deg)
        rotateY(${rotateY}deg)
        rotateZ(${rotateZ}deg)
      `;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();



/* =====================================================
   VIDEO-STYLE FLOATING BACKGROUND ENGINE (FINAL)
===================================================== */

(() => {
  const shapes = document.querySelectorAll('.bg-shape');
  if (!shapes.length) return;

  const prefersReducedMotion = window.matchMedia(
    '(prefers-reduced-motion: reduce)'
  ).matches;

  if (prefersReducedMotion) return;

  let mx = 0.5, my = 0.5;
  let cx = mx, cy = my;

  /* Mouse / touch input */
  function setTarget(x, y) {
    mx = x;
    my = y;
  }

  window.addEventListener('mousemove', e => {
    setTarget(e.clientX / innerWidth, e.clientY / innerHeight);
  }, { passive: true });

  window.addEventListener('touchmove', e => {
    if (!e.touches[0]) return;
    setTarget(
      e.touches[0].clientX / innerWidth,
      e.touches[0].clientY / innerHeight
    );
  }, { passive: true });

  /* Scroll influence */
  function getScrollFactor() {
    const h = document.documentElement.scrollHeight - innerHeight;
    return h > 0 ? window.scrollY / h : 0;
  }

  /* Animation loop */
  function animate() {
    cx += (mx - cx) * 0.04;
    cy += (my - cy) * 0.04;

    const nx = (cx - 0.5) * 2;
    const ny = (cy - 0.5) * 2;
    const scroll = getScrollFactor();
    const t = Date.now() * 0.00025;

    shapes.forEach((el, i) => {
      const depth = 0.25 + i * 0.12;

      const floatX = Math.sin(t + i) * 18;
      const floatY = Math.cos(t * 1.2 + i) * 14;

      const parallaxX = nx * 40 * depth;
      const parallaxY = ny * 40 * depth;

      const scrollLift = scroll * -120 * depth;

      el.style.transform = `
        translate3d(
          ${floatX + parallaxX}px,
          ${floatY + parallaxY + scrollLift}px,
          0
        )
      `;
    });

    requestAnimationFrame(animate);
  }

  requestAnimationFrame(animate);
})();

/* =====================================================
   AWARD-SITE 3D BACKGROUND BLOBS (CANVAS)
   Premium SILVER & GOLD only
===================================================== */

(function init3DBlobs() {
  const canvas = document.getElementById("bgCanvas");
  if (!canvas) return;

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;
  if (prefersReducedMotion) return;

  const ctx = canvas.getContext("2d");
  let blobs = [];

  let mx = 0.5, my = 0.5;
  let cx = mx, cy = my;

  /* ===============================
     METALLIC COLOR PRESETS
  =============================== */

const METALS = {
  silver: {
    light: "rgba(255,255,255,0.95)",   // sharp highlight
    mid:   "rgba(200,200,205,0.75)",   // body tone
    dark:  "rgba(90,90,100,0.35)",     // deep shadow
    glow:  "rgba(230,230,240,0.45)"    // premium halo
  },

  gold: {
    light: "rgba(255,235,175,0.95)",   // bright gold highlight
    mid:   "rgba(215,170,85,0.75)",    // rich metallic body
    dark:  "rgba(110,75,20,0.42)",     // deep gold shadow
    glow:  "rgba(255,200,120,0.55)"    // cinematic glow
  }
};


  /* ===============================
     RESIZE & INIT
  =============================== */

function isTooClose(x, y, r, existing) {
  return existing.some(b => {
    const dx = b.x - x;
    const dy = b.y - y;
    const minDist = (b.r + r) * 0.65; // spacing factor
    return dx * dx + dy * dy < minDist * minDist;
  });
}
  function resize() {
    const dpr = window.devicePixelRatio || 1;
    canvas.width = innerWidth * dpr;
    canvas.height = innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    const COUNT =
  innerWidth < 640 ? 14 :     // mobile (still safe)
  innerWidth < 1024 ? 20 :    // tablet
  20;                         // desktop (premium density)


    blobs = Array.from({ length: COUNT }).map(() => {
      const depth = Math.random();
      const metal = Math.random() > 0.5 ? METALS.gold : METALS.silver;

      return {
        x: Math.random() * innerWidth,
        y: Math.random() * innerHeight,
        r:
  Math.random() < 0.35 ? 40 + Math.random() * 50 :   // small blobs
  Math.random() < 0.7  ? 80 + Math.random() * 60 :   // medium blobs
                         140 + Math.random() * 90, // large blobs

        depth,
        offset: Math.random() * Math.PI * 2,
        metal
      };
    });
  }

  SafeViewport.onResize(() => {
  resize();
});


  /* ===============================
     INPUT
  =============================== */
  window.addEventListener("mousemove", e => {
    mx = e.clientX / innerWidth;
    my = e.clientY / innerHeight;
  }, { passive: true });

  window.addEventListener("touchmove", e => {
    if (!e.touches[0]) return;
    mx = e.touches[0].clientX / innerWidth;
    my = e.touches[0].clientY / innerHeight;
  }, { passive: true });

  /* ===============================
     DRAW BLOB (METALLIC)
  =============================== */
  function drawBlob(b, t) {
    const nx = (cx - 0.5) * 2;
    const ny = (cy - 0.5) * 2;

    const driftX = Math.sin(t * 0.0004 + b.offset) * 40;
    const driftY = Math.cos(t * 0.0005 + b.offset) * 40;

    const parallaxX = nx * 100 * b.depth;
    const parallaxY = ny * 100 * b.depth;


    const x = b.x + driftX + parallaxX;
    const y = b.y + driftY + parallaxY;

    const g = ctx.createRadialGradient(
      x - b.r * 0.35,
      y - b.r * 0.35,
      b.r * 0.2,
      x,
      y,
      b.r
    );

    g.addColorStop(0, b.metal.light);
    g.addColorStop(0.55, b.metal.mid);
    g.addColorStop(1, b.metal.dark);

    ctx.beginPath();
    ctx.fillStyle = g;
    ctx.shadowColor = b.metal.glow;
    ctx.shadowBlur = 40 * b.depth;
    ctx.arc(x, y, b.r, 0, Math.PI * 2);
    ctx.fill();
  }

  /* ===============================
     ANIMATION LOOP
  =============================== */
  function animate(time) {
    cx += (mx - cx) * 0.04;
    cy += (my - cy) * 0.04;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    blobs
      .sort((a, b) => a.depth - b.depth)
      .forEach(b => drawBlob(b, time));

    requestAnimationFrame(animate);
  }

  resize();
  requestAnimationFrame(animate);
})();

/*
/* =====================================================
   FAMEIQ — PREMIUM 3D BIRDS BACKGROUND (SAFE TUNED)
   Slower motion + slightly more birds on mobile
===================================================== */

(() => {
  if (document.body.dataset.page !== "home") return;

  let vantaEffect = null;
  let spreadTimeout = null;

  function initBirds() {
    const el = document.getElementById("birds-bg");
    if (!el || !window.VANTA) return;

    const w = window.innerWidth;

    const isMobile = w < 768;
    const isTablet = w >= 768 && w < 1024;
    const isLaptop  = w >= 1024 && w < 1440; // ✅ LAPTOP RANGE
    const isDesktop = w >= 1024;

// Small controlled randomness (NO chaos)
    const randomBirdSize =
      0.95 + Math.random() * 0.25; // 0.95 → 1.20

    const randomWingSpan =
      16 + Math.random() * 6; // 16 → 22
    vantaEffect = VANTA.BIRDS({
      el,

      mouseControls: true,
      touchControls: true,
      gyroControls: false,

      backgroundAlpha: 0.0,

      scale: 1.0,
      scaleMobile: 0.75,

      color1: 0xD8B06A, // GOLD → near birds
      color2: 0xE3E1DE, // SILVER → far birds

       /* ✅ CHANGED HERE — quantity reduced ONLY for laptop */
      quantity: isMobile
        ? 4.5
        : isTablet
        ? 5
        : isLaptop
        ? 4   // 🔻 reduced for laptops
        : 4,    // desktops unchanged

       /* ✅ RANDOMIZED SIZE (NEW) */
      birdSize: randomBirdSize,
      wingSpan: randomWingSpan,

      separation: isMobile ? 72.0 : 56.0,
      alignment: isMobile ? 22.0 : 28.0,
      cohesion: isMobile ? 16.0 : 22.0,

      /* 🔽 FIX: MUCH SLOWER SPEED FOR MOBILE & TABLET */
      speedLimit: isMobile ? 1.9 : isTablet ? 2.4 : 3.2
    });
  }

  /* ===============================
     TOUCH SPREAD (MOBILE / TABLET)
  =============================== */

  function spreadBirds() {
    if (!vantaEffect) return;

    vantaEffect.setOptions({
      separation: 120.0,
      cohesion: 7.0,

      /* 🔽 FIX: SPREAD SPEED ALSO REDUCED */
      speedLimit: 3.0
    });

    clearTimeout(spreadTimeout);
    spreadTimeout = setTimeout(() => {
      if (!vantaEffect) return;
      vantaEffect.setOptions({
        separation: 56.0,
        cohesion: 22.0,

        /* 🔽 FIX: RESET MATCHES NEW BASE SPEED */
        speedLimit: 2.4
      });
    }, 900);
  }

  const isTouch =
    "ontouchstart" in window ||
    navigator.maxTouchPoints > 0;

  if (isTouch) {
    window.addEventListener(
      "touchstart",
      () => {
        spreadBirds();
      },
      { passive: true }
    );
  }

  initBirds();

  SafeViewport.onResize(() => {
  if (vantaEffect) {
    vantaEffect.destroy();
    vantaEffect = null;
  }
  initBirds();
});
})();

window.addEventListener("orientationchange", () => {
  setTimeout(() => {
    if (vantaEffect) {
      vantaEffect.destroy();
      vantaEffect = null;
    }
    initBirds();
  }, 300);
});



  /* ===============================
     INIT
  =============================== */
  onReady(() => {
    initPageTransition();
    initScrollReveal();
    initMetricCountUp();
    initFaq();
    initHighlightRollout();
    initFooterYear();
    initAdvancedWebBubble();

  });

})();
