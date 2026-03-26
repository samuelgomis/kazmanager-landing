/* ============================================================
   KazManager — Formulaires & CTA
   Version : 1.0 · 2026-03-26
   ============================================================ */

(function () {
  'use strict';

  var SAMUEL_EMAIL = 'samuel@kazmanager.ai';

  /* ── Mailto builder ──────────────────────────────────────── */
  function buildMailto(subject, body) {
    return 'mailto:' + SAMUEL_EMAIL
      + '?subject=' + encodeURIComponent(subject)
      + '&body='    + encodeURIComponent(body);
  }

  var CTA_CONFIGS = {
    default: {
      subject: 'AgentOps Readiness Pack - POC 48h',
      body: [
        'Bonjour Samuel,',
        '',
        "Je souhaite démarrer un POC 48h sur le workflow suivant : [À compléter]",
        '',
        'Disponibilités : [À compléter]',
        '',
        '---',
        'Envoyé depuis kazmanager.ai',
      ].join('\n'),
    },

    poc: {
      subject: 'AgentOps Readiness Pack - POC 48h - [NOM AGENCE]',
      body: [
        'Bonjour Samuel,',
        '',
        'Je souhaite démarrer un POC 48h sur le workflow suivant :',
        '[Décrire le workflow cible]',
        '',
        'Stack actuelle :',
        '- n8n : [version]',
        '- Redis : [oui/non]',
        '- Hébergeur : [VPS/Cloud/autre]',
        '',
        'Disponibilités pour le kick-off 30 min :',
        '[Créneaux disponibles]',
        '',
        '---',
        'Envoyé depuis kazmanager.ai',
      ].join('\n'),
    },

    managed: {
      subject: 'AgentOps - Managed Reliability 990€/mois - [NOM AGENCE]',
      body: [
        'Bonjour Samuel,',
        '',
        "Je suis intéressé(e) par l'offre Managed Reliability.",
        '',
        'Contexte :',
        '- Nombre de workflows à monitorer : [X]',
        '- Volume mensuel estimé de runs : [X]',
        '- Stack : n8n [version] + Redis [oui/non]',
        '',
        'Disponibilités pour un appel de 15 min :',
        '[Créneaux disponibles]',
        '',
        '---',
        'Envoyé depuis kazmanager.ai',
      ].join('\n'),
    },
  };

  /* ── CTA click handler ───────────────────────────────────── */
  function handleCTAClick(e) {
    var btn   = e.currentTarget;
    var type  = btn.dataset.ctaType || 'default';
    var cta   = btn.dataset.ctaId   || 'unknown';
    var section = btn.dataset.section || 'unknown';

    var config = CTA_CONFIGS[type] || CTA_CONFIGS.default;
    var href   = buildMailto(config.subject, config.body);

    /* Analytics */
    if (window.kaz && window.kaz.events) {
      window.kaz.events.ctaClick(cta, section);
    }

    /* Open mail client */
    window.location.href = href;
  }

  /* ── Proof link handler ──────────────────────────────────── */
  function handleProofClick(e) {
    var link = e.currentTarget;
    var gate = link.dataset.gate || 'unknown';

    if (window.kaz && window.kaz.events) {
      window.kaz.events.proofClick(gate);
    }
  }

  /* ── Init ────────────────────────────────────────────────── */
  function init() {
    /* CTA buttons */
    var ctaBtns = document.querySelectorAll('[data-cta]');
    ctaBtns.forEach(function (btn) {
      btn.addEventListener('click', handleCTAClick);
    });

    /* Proof links */
    var proofLinks = document.querySelectorAll('[data-gate]');
    proofLinks.forEach(function (link) {
      link.addEventListener('click', handleProofClick);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

})();
