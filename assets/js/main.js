/* ============================================================
   KazManager — Logique principale
   Version : 1.0 · 2026-03-26
   ============================================================ */

(function () {
  'use strict';

  /* ── Sticky Nav ──────────────────────────────────────────── */
  function initStickyNav() {
    var nav = document.querySelector('.nav');
    if (!nav) return;

    var threshold = 20;

    function updateNav() {
      if (window.scrollY > threshold) {
        nav.classList.add('scrolled');
      } else {
        nav.classList.remove('scrolled');
      }
    }

    window.addEventListener('scroll', updateNav, { passive: true });
    updateNav();
  }

  /* ── Active Nav Link ─────────────────────────────────────── */
  function initActiveNavLink() {
    var navLinks = document.querySelectorAll('.nav-links a[href^="#"]');
    var sections = [];

    navLinks.forEach(function (link) {
      var id = link.getAttribute('href').substring(1);
      var section = document.getElementById(id);
      if (section) sections.push({ link: link, section: section });
    });

    if (!sections.length || !window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); });
          var active = sections.find(function (s) {
            return s.section === entry.target;
          });
          if (active) active.link.classList.add('active');
        }
      });
    }, {
      rootMargin: '-40% 0px -55% 0px',
      threshold: 0,
    });

    sections.forEach(function (s) { observer.observe(s.section); });
  }

  /* ── Scroll Animations (IntersectionObserver) ────────────── */
  function initScrollAnimations() {
    var elements = document.querySelectorAll('.animate-on-scroll');
    if (!elements.length || !window.IntersectionObserver) {
      /* Fallback: show all immediately */
      elements.forEach(function (el) { el.classList.add('in-view'); });
      return;
    }

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, {
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.08,
    });

    elements.forEach(function (el) { observer.observe(el); });
  }

  /* ── Smooth scroll for anchor links ─────────────────────── */
  function initSmoothScroll() {
    var anchors = document.querySelectorAll('a[href^="#"]');

    anchors.forEach(function (anchor) {
      anchor.addEventListener('click', function (e) {
        var id = this.getAttribute('href').substring(1);
        var target = document.getElementById(id);
        if (!target) return;

        e.preventDefault();
        var navHeight = 60;
        var top = target.getBoundingClientRect().top + window.scrollY - navHeight;

        window.scrollTo({ top: top, behavior: 'smooth' });
      });
    });
  }

  /* ── Code block: copy on click ───────────────────────────── */
  function initCodeCopy() {
    var codeBlocks = document.querySelectorAll('.code-block[data-copyable]');

    codeBlocks.forEach(function (block) {
      var pre = block.querySelector('pre');
      if (!pre) return;

      var btn = document.createElement('button');
      btn.className = 'code-copy-btn';
      btn.textContent = 'copier';
      btn.setAttribute('aria-label', 'Copier le code');
      block.appendChild(btn);

      btn.addEventListener('click', function () {
        var text = pre.innerText || pre.textContent;
        if (navigator.clipboard) {
          navigator.clipboard.writeText(text).then(function () {
            btn.textContent = 'copié ✓';
            btn.classList.add('copied');
            setTimeout(function () {
              btn.textContent = 'copier';
              btn.classList.remove('copied');
            }, 2000);
          }).catch(function () {
            fallbackCopy(text, btn);
          });
        } else {
          fallbackCopy(text, btn);
        }
      });
    });
  }

  function fallbackCopy(text, btn) {
    var ta = document.createElement('textarea');
    ta.value = text;
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      document.execCommand('copy');
      btn.textContent = 'copié ✓';
      btn.classList.add('copied');
      setTimeout(function () {
        btn.textContent = 'copier';
        btn.classList.remove('copied');
      }, 2000);
    } catch (e) {}
    document.body.removeChild(ta);
  }

  /* ── Code copy button style (injected) ──────────────────── */
  function injectCodeCopyStyles() {
    var style = document.createElement('style');
    style.textContent = [
      '.code-block { position: relative; }',
      '.code-copy-btn {',
      '  position: absolute;',
      '  top: 12px;',
      '  right: 12px;',
      '  font-family: var(--font-mono);',
      '  font-size: 9px;',
      '  letter-spacing: 0.1em;',
      '  text-transform: uppercase;',
      '  color: var(--text-muted);',
      '  background: var(--bg-tertiary);',
      '  border: 1px solid var(--border);',
      '  border-radius: 3px;',
      '  padding: 4px 8px;',
      '  cursor: pointer;',
      '  transition: all 0.2s ease;',
      '}',
      '.code-copy-btn:hover { color: var(--accent-cyan); border-color: var(--border-accent); }',
      '.code-copy-btn.copied { color: var(--accent-green); border-color: var(--accent-green); }',
    ].join('\n');
    document.head.appendChild(style);
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    injectCodeCopyStyles();
    initStickyNav();
    initActiveNavLink();
    initScrollAnimations();
    initSmoothScroll();
    initCodeCopy();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
