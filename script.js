
/* ==========================================
   RUTHVIK REDDY — F1 PORTFOLIO JAVASCRIPT
   ========================================== */

"use strict";

document.addEventListener("DOMContentLoaded", () => {
  console.log("F1 Portfolio loaded successfully!");

  // CURRENT YEAR
  const year = document.getElementById("year");

  if (year) {
    year.textContent = new Date().getFullYear();
  }

  // ACCESSIBILITY
  const reducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  // SMOOTH SECTION REVEALS
  const sections = document.querySelectorAll(
    ".overview-grid .panel, " +
    ".experience-section, " +
    ".projects-section, " +
    ".telemetry-section, " +
    ".contact-section"
  );

  if (reducedMotion || !("IntersectionObserver" in window)) {
    sections.forEach(section => {
      section.classList.add("visible");
    });
  } else {
    const revealObserver = new IntersectionObserver(
      (entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add("visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.08,
        rootMargin: "0px 0px -30px 0px"
      }
    );

    sections.forEach(section => {
      section.classList.add("reveal");
      revealObserver.observe(section);
    });
  }

  // TELEMETRY COUNTERS
  const counters = document.querySelectorAll(".counter");

  function animateCounter(counter) {
    if (counter.dataset.animated === "true") return;

    counter.dataset.animated = "true";

    const target = Number(counter.dataset.target);

    if (!Number.isFinite(target)) return;

    if (reducedMotion) {
      counter.textContent = target.toLocaleString();
      return;
    }

    const duration = 1500;
    const startTime = performance.now();

    function update(now) {
      const progress = Math.min(
        (now - startTime) / duration,
        1
      );

      const eased = 1 - Math.pow(1 - progress, 3);

      const value = Math.round(target * eased);

      counter.textContent = value.toLocaleString();

      if (progress < 1) {
        requestAnimationFrame(update);
      } else {
        counter.textContent = target.toLocaleString();
      }
    }

    requestAnimationFrame(update);
  }

  const telemetry = document.querySelector(
    ".telemetry-section"
  );

  if (telemetry) {
    if (!("IntersectionObserver" in window)) {
      telemetry.classList.add("visible");
      counters.forEach(animateCounter);
    } else {
      const telemetryObserver = new IntersectionObserver(
        (entries, observer) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              telemetry.classList.add("visible");
              counters.forEach(animateCounter);
              observer.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.15 }
      );

      telemetryObserver.observe(telemetry);
    }
  }

  // ACTIVE NAVIGATION
  const navLinks = document.querySelectorAll(
    ".nav-links a"
  );

  const navSections = document.querySelectorAll(
    "main section[id]"
  );

  function updateActiveNavigation() {
    let current = "home";

    navSections.forEach(section => {
      if (section.getBoundingClientRect().top <= 180) {
        current = section.id;
      }
    });

    navLinks.forEach(link => {
      const active = link.getAttribute("href") ===
        "#" + current;

      link.classList.toggle("active", active);

      if (active) {
        link.setAttribute("aria-current", "location");
      } else {
        link.removeAttribute("aria-current");
      }
    });
  }

  window.addEventListener(
    "scroll",
    updateActiveNavigation,
    { passive: true }
  );

  updateActiveNavigation();

  console.log("Telemetry counters found:", counters.length);
});
