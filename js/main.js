/* ============================================================
   NEXISTEM — JavaScript principal
   - Menu burger mobile
   - Lien actif dans la navbar
   - Animations d'apparition (IntersectionObserver)
   - Formulaire de contact (Netlify Forms)
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- LUCIDE ICONS ----------
  if (window.lucide) lucide.createIcons();

  // ---------- MENU BURGER ----------
  const burger  = document.querySelector('.navbar__burger');
  const mobileNav = document.querySelector('.navbar__mobile');

  if (burger && mobileNav) {
    burger.addEventListener('click', () => {
      const isOpen = burger.classList.toggle('open');
      mobileNav.classList.toggle('open', isOpen);
      document.body.style.overflow = isOpen ? 'hidden' : '';
    });

    // Fermer si on clique sur un lien
    mobileNav.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        burger.classList.remove('open');
        mobileNav.classList.remove('open');
        document.body.style.overflow = '';
      });
    });
  }

  // ---------- LIEN ACTIF NAVBAR ----------
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.navbar__links a, .navbar__mobile a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage || (currentPage === '' && href === 'index.html')) {
      link.classList.add('active');
    }
  });

  // ---------- TRANSITIONS DE PAGE (body opacity piloté par CSS + JS) ----------
  // Le CSS démarre body à opacity:0 (render-blocking → pas de flash).
  // Ici on le remet à 1 pour déclencher le fade-in via la transition CSS.
  document.body.style.opacity = '1';

  document.querySelectorAll('a[href]').forEach(link => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('#') ||
        href.startsWith('mailto') || href.startsWith('tel')) return;
    link.addEventListener('click', (e) => {
      e.preventDefault();
      document.body.style.opacity = '0';
      setTimeout(() => { window.location.href = href; }, 450);
    });
  });

  // ---------- BARRE DE PROGRESSION ----------
  const progressBar = document.createElement('div');
  progressBar.id = 'scroll-progress';
  document.body.prepend(progressBar);
  window.addEventListener('scroll', () => {
    const max = document.body.scrollHeight - window.innerHeight;
    progressBar.style.width = max > 0 ? `${(window.scrollY / max) * 100}%` : '0%';
  }, { passive: true });

  // ---------- NAVBAR AU SCROLL ----------
  const navbar = document.querySelector('.navbar');
  if (navbar) {
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    }, { passive: true });
  }

  // ---------- ANIMATIONS D'APPARITION ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

  const seen = new Set();
  const addFade = (sel, cls = 'fade-in') => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add(cls);
      observer.observe(el);
    });
  };

  addFade('.fade-in');
  addFade('section h2');
  addFade('section h3');
  addFade('.pricing-card');
  addFade('.exp-card');
  addFade('.why-card-new');
  addFade('.review-card');
  addFade('.logo-card');
  addFade('.pricing-launch-banner');
  addFade('.pricing-enterprise-banner');
  addFade('.service-block:not(.service-block--reverse) .service-img-col', 'fade-in-right');
  addFade('.service-block--reverse .service-img-col', 'fade-in-left');

  // ---------- FORMULAIRE DE CONTACT ----------
  const form = document.querySelector('#contact-form');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn    = form.querySelector('[type="submit"]');
      const status = document.querySelector('#form-status');

      btn.disabled    = true;
      btn.textContent = 'Envoi en cours…';

      try {
        const data = new FormData(form);
        const res  = await fetch('/', {
          method:  'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body:    new URLSearchParams(data).toString(),
        });

        if (res.ok) {
          status.className  = 'form-status success';
          status.textContent = '✓ Message envoyé ! Je vous réponds sous 24h.';
          form.reset();
        } else {
          throw new Error('Erreur réseau');
        }
      } catch {
        status.className  = 'form-status error';
        status.textContent = 'Une erreur s\'est produite. Écrivez-moi directement : contact.nexistem@gmail.com';
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Envoyer';
      }
    });
  }
});
