/* =========================================================
   MY TOP AGENT — Interaction layer
   Lenis smooth scroll + GSAP scroll animations
   GHL-safe: waits for DOM, self-scoped, mobile-aware
   ========================================================= */

(function () {
  'use strict';

  const isMobile = window.matchMedia('(max-width: 900px)').matches;
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---------- Lenis (desktop only; skip on mobile & GHL popups) ----------
  let lenis = null;
  function initLenis() {
    if (isMobile || prefersReduced || typeof Lenis === 'undefined') return;
    lenis = new Lenis({
      duration: 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: false,
      wheelMultiplier: 1,
      lerp: 0.09,
    });
    window.lenis = lenis;
    document.documentElement.classList.add('lenis');

    function raf(time) { lenis.raf(time); requestAnimationFrame(raf); }
    requestAnimationFrame(raf);

    // Bridge Lenis → GSAP ScrollTrigger
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update);
      gsap.ticker.add((time) => lenis.raf(time * 1000));
      gsap.ticker.lagSmoothing(0);
    }

    // Anchor links via Lenis
    document.querySelectorAll('a[href^="#"]').forEach((a) => {
      a.addEventListener('click', (e) => {
        const id = a.getAttribute('href');
        if (id.length > 1) {
          const el = document.querySelector(id);
          if (el) { e.preventDefault(); lenis.scrollTo(el, { offset: -80, duration: 1.4 }); }
        }
      });
    });
  }

  // ---------- Nav scrolled state ----------
  function initNav() {
    const nav = document.getElementById('mta-nav');
    if (!nav) return;
    const onScroll = () => nav.classList.toggle('is-scrolled', window.scrollY > 20);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    const burger = nav.querySelector('.mta-nav__burger');
    const menu = nav.querySelector('.mta-nav__menu');
    if (burger && menu) {
      const closeMenu = () => {
        menu.classList.remove('is-open');
        burger.setAttribute('aria-expanded', 'false');
        document.body.classList.remove('mta-menu-open');
      };
      burger.addEventListener('click', () => {
        const open = menu.classList.toggle('is-open');
        burger.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.classList.toggle('mta-menu-open', open);
      });
      // Close on link click
      menu.querySelectorAll('a').forEach((a) => a.addEventListener('click', closeMenu));
      // Close on Escape
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });
    }
  }

  // ---------- Wrap agent portraits in a track + duplicate for endless mobile marquee ----------
  function initMobilePortraitMarquee() {
    if (!window.matchMedia('(max-width: 900px)').matches) return;
    const scroll = document.querySelector('.mta-split__scroll');
    if (!scroll || scroll.dataset.mobileMarquee === '1') return;
    const originals = Array.from(scroll.querySelectorAll('.mta-portrait'));
    if (!originals.length) return;
    // Build the track (animated)
    const track = document.createElement('div');
    track.className = 'mta-portraits-track';
    originals.forEach((p) => track.appendChild(p));
    // Duplicate once so translateX(-50%) loops seamlessly
    originals.forEach((p) => {
      const c = p.cloneNode(true);
      c.setAttribute('aria-hidden', 'true');
      c.classList.add('is-in');
      track.appendChild(c);
    });
    scroll.appendChild(track);
    scroll.dataset.mobileMarquee = '1';
  }

  // ---------- Sticky mobile bottom CTA (appears after hero scrolls out) ----------
  function initMobileCTA() {
    const hero = document.querySelector('.mta-hero');
    if (!hero) return;
    const cta = document.createElement('a');
    cta.href = '#quiz';
    cta.className = 'mta-mobile-cta';
    cta.innerHTML = 'Find My Top Agent Now <span aria-hidden="true" style="margin-left:6px;">→</span>';
    document.body.appendChild(cta);
    if (!('IntersectionObserver' in window)) { cta.classList.add('is-visible'); return; }
    const io = new IntersectionObserver((entries) => {
      // Show CTA once the hero is >50% out of view (user has scrolled past)
      entries.forEach((e) => cta.classList.toggle('is-visible', !e.isIntersecting || e.intersectionRatio < 0.4));
    }, { threshold: [0, 0.4, 1] });
    io.observe(hero);
  }

  // ---------- Reveal animations (IntersectionObserver — GHL-safe, no lib deps) ----------
  function initReveals() {
    const els = document.querySelectorAll('[data-mta-anim]');
    if (!('IntersectionObserver' in window)) {
      els.forEach((el) => el.classList.add('is-in'));
      return;
    }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    els.forEach((el) => io.observe(el));

    // Safety: any element still not revealed 4s after page becomes idle
    // (e.g. observer missed due to layout shifts) — force it visible.
    setTimeout(() => {
      document.querySelectorAll('[data-mta-anim]:not(.is-in)').forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) el.classList.add('is-in');
      });
    }, 2500);
  }

  // ---------- How It Works clip-path reveals ----------
  function initSteps() {
    const steps = document.querySelectorAll('.mta-step');
    if (!steps.length) return;
    if (!('IntersectionObserver' in window)) { steps.forEach((s) => s.classList.add('is-in')); return; }
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.25 });
    steps.forEach((s) => io.observe(s));
  }

  // ---------- Hero floating badges: pure CSS idle animation (no JS parallax) ----------
  // Kept as a no-op so `boot()` doesn't need changing; all motion is CSS-driven now.
  function initHeroFloats() { /* CSS handles idle drift; no JS to avoid transform conflicts */ }

  // ---------- Stats counter ----------
  function initCounters() {
    const nums = document.querySelectorAll('[data-mta-count]');
    if (!nums.length) return;
    const format = (n, target) => {
      if (target >= 1000) return Math.round(n).toLocaleString();
      if (target % 1 !== 0) return n.toFixed(1);
      return Math.round(n).toString();
    };
    const animate = (el) => {
      const target = parseFloat(el.dataset.mtaCount);
      const start = performance.now();
      const dur = 1600;
      const step = (now) => {
        const p = Math.min(1, (now - start) / dur);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = format(target * eased, target);
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) { animate(entry.target); io.unobserve(entry.target); }
      });
    }, { threshold: 0.5 });
    nums.forEach((n) => io.observe(n));
  }

  // ---------- Modal (full-window popup for the quiz) ----------
  function initModal() {
    const modal = document.getElementById('quiz');
    if (!modal) return;

    let lastFocused = null;

    function open() {
      lastFocused = document.activeElement;
      modal.classList.add('is-open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.classList.add('mta-modal-open');
      if (window.lenis) window.lenis.stop();
      // focus first input
      setTimeout(() => {
        const first = modal.querySelector('input, button');
        if (first) first.focus();
      }, 400);
    }
    function close() {
      modal.classList.remove('is-open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.classList.remove('mta-modal-open');
      if (window.lenis) window.lenis.start();
      if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    }

    // Intercept all links pointing at the modal
    document.querySelectorAll('a[href="#quiz"]').forEach((a) => {
      a.addEventListener('click', (e) => { e.preventDefault(); open(); });
    });
    // Close controls
    modal.querySelectorAll('[data-mta-close]').forEach((el) => {
      el.addEventListener('click', close);
    });
    // Esc key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('is-open')) close();
    });

    // Expose so quiz code doesn't need to know about scrolling
    modal._close = close;
  }

  // ---------- Quiz (multi-step form) ----------
  function initQuiz() {
    const quiz = document.querySelector('[data-mta-quiz]');
    if (!quiz) return;

    const steps = quiz.querySelectorAll('.mta-quiz__step');
    const progressEl = quiz.querySelector('.mta-quiz__progress');
    const stepLabel = quiz.querySelector('[data-mta-quiz-step]');
    const totalSteps = 3; // step 4 is the "done" screen
    let current = 1;

    function show(n) {
      steps.forEach((s) => s.classList.toggle('is-active', parseInt(s.dataset.step) === n));
      if (n <= totalSteps) {
        stepLabel.textContent = String(n);
        const pct = (n / totalSteps) * 100;
        progressEl.style.setProperty('--mta-progress', pct + '%');
        // manually re-apply bar via inline
        progressEl.style.background = `linear-gradient(90deg, var(--mta-gold) ${pct}%, var(--mta-cream-2) ${pct}%)`;
      }
      current = n;
      // scroll into view a touch
      if (window.lenis) window.lenis.scrollTo(quiz, { offset: -100, duration: .9 });
      else quiz.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
    // init progress
    (function () {
      const pct = (1 / totalSteps) * 100;
      progressEl.style.setProperty('--mta-progress', pct + '%');
    })();

    // Validate the current step's required fields
    function validateStep(stepEl) {
      const inputs = stepEl.querySelectorAll('input, select');
      let valid = true;
      inputs.forEach((el) => {
        if (el.required && !el.value.trim()) {
          valid = false;
          el.style.borderColor = '#e53e3e';
          el.addEventListener('input', () => (el.style.borderColor = ''), { once: true });
        }
      });
      return valid;
    }

    quiz.querySelectorAll('[data-mta-next]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const stepEl = btn.closest('.mta-quiz__step');
        if (!validateStep(stepEl)) return;
        show(current + 1);
      });
    });
    quiz.querySelectorAll('[data-mta-back]').forEach((btn) => {
      btn.addEventListener('click', () => show(Math.max(1, current - 1)));
    });

    // Chips → hidden input
    quiz.querySelectorAll('[data-mta-chips]').forEach((group) => {
      const hidden = group.parentElement.querySelector('input[type="hidden"]');
      group.querySelectorAll('button').forEach((b) => {
        b.addEventListener('click', () => {
          group.querySelectorAll('button').forEach((x) => x.classList.remove('is-selected'));
          b.classList.add('is-selected');
          hidden.value = b.dataset.value;
        });
      });
    });

    // Submit
    const submitBtn = quiz.querySelector('[data-mta-submit]');
    if (submitBtn) {
      submitBtn.addEventListener('click', async (e) => {
        e.preventDefault();
        const stepEl = submitBtn.closest('.mta-quiz__step');
        if (!validateStep(stepEl)) return;

        const form = quiz.querySelector('.mta-quiz__form');
        const data = {};
        form.querySelectorAll('input, select').forEach((el) => {
          if (el.name) data[el.name] = el.value;
        });

        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';

        // === REPLACE THIS URL with your GHL Inbound Webhook URL ===
        const GHL_WEBHOOK = 'https://services.leadconnectorhq.com/hooks/REPLACE_ME';
        try {
          if (GHL_WEBHOOK && !GHL_WEBHOOK.includes('REPLACE_ME')) {
            await fetch(GHL_WEBHOOK, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(data),
            });
          } else {
            console.log('MTA quiz submit (webhook not set):', data);
          }
        } catch (err) {
          console.warn('MTA quiz webhook failed:', err);
        }
        show(4);
      });
    }
  }

  // ---------- Marquee: pause on hover handled by CSS; nothing else needed ----------
  // ---------- Cards subtle tilt on hover ----------
  function initTilt() {
    if (isMobile || prefersReduced) return;
    document.querySelectorAll('.mta-card, .mta-sale').forEach((card) => {
      card.addEventListener('mousemove', (e) => {
        const r = card.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width - 0.5;
        const y = (e.clientY - r.top) / r.height - 0.5;
        card.style.transform = `translateY(-6px) rotateX(${-y * 4}deg) rotateY(${x * 4}deg)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = ''; });
    });
  }

  // ---------- Boot ----------
  function boot() {
    initLenis();
    initNav();
    initMobilePortraitMarquee();
    initMobileCTA();
    initReveals();
    initSteps();
    initHeroFloats();
    initCounters();
    initTilt();
    initQuiz();
    if (window.ScrollTrigger) ScrollTrigger.refresh();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else { boot(); }

  // GHL soft-navigation safety: re-init if the page container is swapped
  window.addEventListener('load', () => { if (window.ScrollTrigger) ScrollTrigger.refresh(); });
})();
