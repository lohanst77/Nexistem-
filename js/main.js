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

  // ---------- ANIMATIONS D'APPARITION ----------
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });

  const seen = new Set();

  const addFade = (sel, cls = 'fade-in') => {
    document.querySelectorAll(sel).forEach(el => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add(cls);
      observer.observe(el);
    });
  };

  // Depuis le bas — éléments généraux
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

  // Depuis la droite — image service 1 (bloc normal, image à droite)
  addFade('.service-block:not(.service-block--reverse) .service-img-col', 'fade-in-right');
  // Depuis la gauche — image service 2 (bloc inversé, image à gauche visuellement)
  addFade('.service-block--reverse .service-img-col', 'fade-in-left');

  // ---------- TRANSITIONS DE PAGES ----------
  const initPageTransitions = () => {
    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (!href || href.startsWith('http') || href.startsWith('#') ||
          href.startsWith('mailto') || href.startsWith('tel')) return;

      link.addEventListener('click', (e) => {
        e.preventDefault();
        if (document.startViewTransition) {
          document.startViewTransition(() => { window.location.href = href; });
        } else {
          document.body.style.transition = 'opacity 0.3s ease';
          document.body.style.opacity = '0';
          setTimeout(() => { window.location.href = href; }, 300);
        }
      });
    });

    document.body.style.opacity = '0';
    requestAnimationFrame(() => {
      document.body.style.transition = 'opacity 0.4s ease';
      document.body.style.opacity = '1';
    });
  };

  initPageTransitions();

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
