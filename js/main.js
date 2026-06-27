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
      // Éléments gérés par leurs propres observateurs dédiés
      if (el.closest('.service-block') || el.closest('.about-hero') || el.closest('.why-cheaper') || el.closest('.pricing-grid')) return;
      seen.add(el);
      el.classList.add(cls);
      observer.observe(el);
    });
  };

  addFade('.fade-in');
  addFade('section h2');
  addFade('section h3');
  addFade('.exp-card');
  addFade('.why-card-new');
  addFade('.review-card');
  addFade('.logo-card');
  addFade('.pricing-launch-banner');
  addFade('.pricing-enterprise-banner');

  // ---- Blocs service : rideau clip-path (se lève de bas en haut) + titre ligne par ligne ----

  function wrapLines(heading) {
    const parts = heading.innerHTML.split(/<br\s*\/?>/i);
    heading.innerHTML = parts.map((part, i) =>
      `<span class="line-wrap"><span class="line-inner" style="transition-delay:${0.1 + i * 0.13}s">${part.trim()}</span></span>`
    ).join('');
  }

  document.querySelectorAll('.service-block').forEach(block => {
    const content = block.querySelector('.service-block__content');
    if (!content) return;

    const num   = content.querySelector('.service-block__number');
    const h2    = content.querySelector('h2');
    const paras = [...content.querySelectorAll('p')].filter(p => !p.classList.contains('service-block__number'));
    const btns  = [...content.children].find(el => el.tagName === 'DIV');

    if (num) { num.classList.add('svc-fade'); num.style.transitionDelay = '0s'; }
    if (h2)  wrapLines(h2);

    if (paras.length) {
      const group = document.createElement('div');
      group.classList.add('svc-fade');
      group.style.transitionDelay = '0.3s';
      paras[0].before(group);
      paras.forEach(p => group.appendChild(p));
    }

    if (btns) { btns.classList.add('svc-fade'); btns.style.transitionDelay = '0.42s'; }

    const imgCol = block.querySelector('.service-img-col');
    if (imgCol) { imgCol.classList.add('clip-reveal'); imgCol.style.transitionDelay = '0.08s'; }
  });

  const serviceObs = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.querySelectorAll('.svc-fade, .line-wrap, .clip-reveal').forEach(c => c.classList.add('visible'));
      serviceObs.unobserve(entry.target);
    });
  }, { threshold: 0.1 });
  document.querySelectorAll('.service-block').forEach(b => serviceObs.observe(b));

  // ---- About hero : texte staggeré + photo révélation circulaire ----
  const aboutHero = document.querySelector('.about-hero');
  if (aboutHero) {
    const content = aboutHero.querySelector('.about-hero__content');
    if (content) {
      [...content.children].forEach((child, i) => {
        child.classList.add('stagger-item');
        child.style.transitionDelay = `${i * 0.08}s`;
      });
    }
    const photoImg = aboutHero.querySelector('.about-hero__photo img');
    if (photoImg) photoImg.classList.add('about-photo-reveal');

    const aboutObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        content?.querySelectorAll('.stagger-item').forEach(c => c.classList.add('visible'));
        if (photoImg) setTimeout(() => photoImg.classList.add('visible'), 480);
        aboutObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    aboutObs.observe(aboutHero);
  }

  // ---- Pourquoi Nexistem est moins cher : paragraphes staggerés ----
  const whyCheaper = document.querySelector('.why-cheaper');
  if (whyCheaper) {
    [...whyCheaper.children].forEach((child, i) => {
      child.classList.add('stagger-item');
      child.style.transitionDelay = `${i * 0.1}s`;
    });
    const whyObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        [...entry.target.querySelectorAll('.stagger-item')].forEach(c => c.classList.add('visible'));
        whyObs.unobserve(entry.target);
      });
    }, { threshold: 0.1 });
    whyObs.observe(whyCheaper);
  }

  // ---- Cartes tarifs : cascade gauche → milieu → droite ----
  const pricingGrid = document.querySelector('.pricing-grid');
  if (pricingGrid) {
    const cards = [...pricingGrid.querySelectorAll('.pricing-card')];
    cards.forEach((card, i) => {
      card.style.transition = `opacity 0.6s ease-out, transform 0.6s ease-out`;
      card.style.transitionDelay = `${i * 0.15}s`;
    });

    const pricingObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        cards.forEach(card => card.classList.add('visible'));
        pricingObs.unobserve(entry.target);
      });
    }, { threshold: 0.15 });

    pricingObs.observe(pricingGrid);
  }

  // ---- FAQ : questions en cascade ----
  const faqList = document.querySelector('.faq-list');
  if (faqList) {
    [...faqList.children].forEach((child, i) => {
      child.classList.add('stagger-item');
      child.style.transitionDelay = `${i * 0.1}s`;
    });
    const faqObs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        [...entry.target.querySelectorAll('.stagger-item')].forEach(c => c.classList.add('visible'));
        faqObs.unobserve(entry.target);
      });
    }, { threshold: 0.05 });
    faqObs.observe(faqList);
  }

  // ---------- FORMULAIRE DE CONTACT (Formspree via fetch) ----------
  const contactForm = document.querySelector('#contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn    = contactForm.querySelector('[type="submit"]');
      const status = document.querySelector('#form-status');

      btn.disabled    = true;
      btn.textContent = 'Envoi en cours…';
      status.className = '';
      status.innerHTML = '';

      try {
        const res = await fetch(contactForm.action, {
          method:  'POST',
          headers: { 'Accept': 'application/json' },
          body:    new FormData(contactForm),
        });

        if (res.ok) {
          status.className = 'form-status success';
          status.textContent = '✓ Message envoyé ! Je vous réponds sous 24h.';
          contactForm.reset();
        } else {
          throw new Error('error');
        }
      } catch {
        status.className = 'form-status error';
        status.innerHTML = 'Une erreur s\'est produite. Envoyez-moi directement un email à <a href="mailto:contact.nexistem@gmail.com">contact.nexistem@gmail.com</a> — je vous réponds sous 24h.';
      } finally {
        btn.disabled    = false;
        btn.textContent = 'Envoyer →';
      }
    });
  }

});
