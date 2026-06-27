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
  }, { threshold: 0.12 });

  document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));

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
