/* ============================================================
   KazManager — Analytics (PostHog)
   Version : 1.0 · 2026-03-26
   Remplacer POSTHOG_KEY par la clé réelle avant déploiement
   ============================================================ */

(function () {
  'use strict';

  /* ── Config ──────────────────────────────────────────────── */
  var POSTHOG_KEY  = 'POSTHOG_KEY';  // TODO: remplacer par la vraie clé
  var POSTHOG_HOST = 'https://eu.i.posthog.com';
  var IS_DEV       = window.location.hostname === 'localhost'
                  || window.location.hostname === '127.0.0.1';

  /* ── PostHog Init ────────────────────────────────────────── */
  function initPostHog() {
    if (POSTHOG_KEY === 'POSTHOG_KEY' || IS_DEV) {
      // Mode dev : log dans la console, pas d'envoi réel
      window.posthog = createDevAnalytics();
      console.log('[Analytics] Dev mode — PostHog non initialisé');
      return;
    }

    /* PostHog snippet minifié */
    !function(t,e){var o,n,p,r;e.__SV||(window.posthog=e,e._i=[],e.init=function(i,s,a){function g(t,e){var o=e.split(".");2==o.length&&(t=t[o[0]],e=o[1]);t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}}(p=t.createElement("script")).type="text/javascript",p.async=!0,p.src=s.api_host+"/static/array.js",(r=t.getElementsByTagName("script")[0]).parentNode.insertBefore(p,r);var u=e;for(void 0!==a?u=e[a]=[]:a="posthog",u.people=u.people||[],u.toString=function(t){var e="posthog";return"posthog"!==a&&(e+="."+a),t||(e+=" (stub)"),e},u.people.toString=function(){return u.toString(1)+" (stub)"},o="capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys".split(" "),n=0;n<o.length;n++)g(u,o[n]);e._i.push([i,s,a])},e.__SV=1)}(document,window.posthog||[]);

    posthog.init(POSTHOG_KEY, {
      api_host: POSTHOG_HOST,
      capture_pageview: false,
      persistence: 'localStorage+cookie',
      autocapture: false,
    });
  }

  /* ── Dev Analytics (console only) ───────────────────────── */
  function createDevAnalytics() {
    return {
      capture: function (event, props) {
        console.log('[Analytics]', event, props || '');
      },
      identify: function (id, props) {
        console.log('[Analytics] identify', id, props || '');
      },
      reset: function () {}
    };
  }

  /* ── Public track() helper ───────────────────────────────── */
  window.kaz = window.kaz || {};

  window.kaz.track = function (event, props) {
    if (!window.posthog) return;
    try {
      window.posthog.capture(event, props || {});
    } catch (e) {
      console.warn('[Analytics] track error:', e);
    }
  };

  /* ── Standard Events ─────────────────────────────────────── */
  window.kaz.events = {
    pageView: function () {
      kaz.track('page_view', { page: 'landing' });
    },

    ctaClick: function (cta, section) {
      kaz.track('cta_click', { cta: cta, section: section });
    },

    proofClick: function (gate) {
      kaz.track('proof_click', { gate: gate });
    },

    sectionView: function (section) {
      kaz.track('section_view', { section: section });
    },
  };

  /* ── Section Visibility Tracking ────────────────────────── */
  function initSectionTracking() {
    var sections = {
      'proof':    'proof',
      'aiact':    'ai_act',
      'pricing':  'pricing',
      'problem':  'problem',
      'solution': 'solution',
    };

    var tracked = {};

    if (!window.IntersectionObserver) return;

    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting && !tracked[entry.target.id]) {
          tracked[entry.target.id] = true;
          var sectionName = sections[entry.target.id];
          if (sectionName) {
            kaz.events.sectionView(sectionName);
          }
        }
      });
    }, { threshold: 0.3 });

    Object.keys(sections).forEach(function (id) {
      var el = document.getElementById(id);
      if (el) observer.observe(el);
    });
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    initPostHog();

    /* Page view */
    kaz.events.pageView();

    /* Section tracking after DOM ready */
    if (document.readyState === 'loading') {
      document.addEventListener('DOMContentLoaded', initSectionTracking);
    } else {
      initSectionTracking();
    }
  }

  init();

})();
