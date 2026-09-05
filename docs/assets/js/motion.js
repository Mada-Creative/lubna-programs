// motion.js — presentational-only scroll reveal.
// Purely additive: does not read/modify catalog data, forms, or any other
// script's state. Toggles a class once per element via IntersectionObserver
// so CSS ([data-reveal] rules in style.css) can animate opacity/transform.
// Respects prefers-reduced-motion by no-op'ing (CSS already shows the
// resolved end-state when that media query matches).
(function () {
  var prefersReduced = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  var targets = document.querySelectorAll("[data-reveal]");

  if (!targets.length) return;

  if (prefersReduced || typeof IntersectionObserver === "undefined") {
    targets.forEach(function (el) {
      el.classList.add("is-revealed");
    });
    return;
  }

  var observer = new IntersectionObserver(
    function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          var el = entry.target;
          var delay = (i % 6) * 60;
          setTimeout(function () {
            el.classList.add("is-revealed");
          }, delay);
          observer.unobserve(el);
        }
      });
    },
    { threshold: 0.2, rootMargin: "0px 0px -10% 0px" }
  );

  targets.forEach(function (el) {
    observer.observe(el);
  });
})();
