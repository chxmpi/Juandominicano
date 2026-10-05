const nav = document.querySelector('.nav');
const navToggle = document.querySelector('.nav-toggle');
const navLinks = Array.from(document.querySelectorAll('.nav-list a'));
const header = document.querySelector('.header');
const yearEl = document.getElementById('year');

const closeNav = () => {
  if (!nav || !navToggle) return;
  nav.classList.remove('open');
  navToggle.setAttribute('aria-expanded', 'false');
  navToggle.setAttribute('aria-label', 'Abrir menú');
};

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
    navToggle.setAttribute('aria-label', isOpen ? 'Cerrar menú' : 'Abrir menú');
  });

  navLinks.forEach((link) => link.addEventListener('click', closeNav));

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape') closeNav();
  });

  document.addEventListener('click', (event) => {
    if (!nav.classList.contains('open')) return;
    if (nav.contains(event.target) || navToggle.contains(event.target)) return;
    closeNav();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 960) closeNav();
  });
}

if (yearEl) {
  yearEl.textContent = String(new Date().getFullYear());
}

if (header) {
  const onScrollHeader = () => {
    header.classList.toggle('is-stuck', window.scrollY > 24);
  };

  onScrollHeader();
  window.addEventListener('scroll', onScrollHeader, { passive: true });
}

const sections = navLinks
  .map((link) => {
    const id = link.getAttribute('href');
    if (!id || !id.startsWith('#')) return null;
    const section = document.querySelector(id);
    return section ? { link, section } : null;
  })
  .filter(Boolean);

if (sections.length && 'IntersectionObserver' in window) {
  const visible = new Map();

  const spy = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        visible.set(entry.target.id, entry.isIntersecting ? entry.intersectionRatio : 0);
      });

      let bestId = null;
      let bestRatio = 0;

      visible.forEach((ratio, id) => {
        if (ratio > bestRatio) {
          bestRatio = ratio;
          bestId = id;
        }
      });

      if (!bestId) return;

      sections.forEach(({ link, section }) => {
        link.classList.toggle('is-active', section.id === bestId);
      });
    },
    { rootMargin: '-45% 0px -45% 0px', threshold: [0, 0.25, 0.5, 0.75, 1] }
  );

  sections.forEach(({ section }) => spy.observe(section));
}

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
const revealTargets = Array.from(document.querySelectorAll('.card, .team-card, .review-card, .gallery-item, .stat, .price-table, .schedule-list, .visit-card, .map-wrapper, .promo-card, .section-header'));

if (!prefersReducedMotion && 'IntersectionObserver' in window) {
  revealTargets.forEach((el, index) => {
    el.setAttribute('data-reveal', '');
    el.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  const revealer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('is-visible');
        observer.unobserve(entry.target);
      });
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  );

  revealTargets.forEach((el) => revealer.observe(el));
}