// ================================
// GUIA DE INTEGRAÇÕES — SCRIPT
// ================================

// ---- SCROLL REVEAL ----
const revealEls = document.querySelectorAll(
  '.section-tag, .section-title, .section-desc, .definition-card, .before-after, ' +
  '.benefits-grid, .frase-venda, .signals-block, .questions-block, .examples-grid, ' +
  '.translation-block, .script-card, .objections-block, .checklist-block, .form-block, ' +
  '.final-cards, .example-card, .benefit-card, .final-card'
);

revealEls.forEach(el => el.classList.add('reveal'));

const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => {
        entry.target.classList.add('visible');
      }, (i % 6) * 80);
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(el => revealObserver.observe(el));

// ---- CHECKLIST PROGRESS ----
const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
const progressFill = document.getElementById('progressFill');
const progressLabel = document.getElementById('progressLabel');

function updateProgress() {
  const checked = document.querySelectorAll('.check-item input:checked').length;
  const total = checkboxes.length;
  const pct = (checked / total) * 100;
  progressFill.style.width = pct + '%';
  progressLabel.textContent = checked + ' de ' + total + ' concluídos';
  if (checked === total) {
    progressLabel.textContent = '✅ Levantamento completo! Pronto para enviar ao time técnico.';
    progressLabel.style.color = 'var(--accent)';
  } else {
    progressLabel.style.color = '';
  }
}

checkboxes.forEach(cb => cb.addEventListener('change', updateProgress));

// ---- COPY FORM ----
function copyForm() {
  const fields = document.querySelectorAll('.form-field');
  let text = '=== LEVANTAMENTO DE INTEGRAÇÃO ===\n\n';
  fields.forEach(field => {
    const label = field.querySelector('label') && field.querySelector('label').textContent.trim();
    const input = field.querySelector('input, textarea');
    const value = input && input.value.trim();
    if (label && value) {
      text += '• ' + label + ':\n  ' + value + '\n\n';
    }
  });

  const checksDone = document.querySelectorAll('.check-item input:checked').length;
  text += '\nChecklist: ' + checksDone + '/' + checkboxes.length + ' itens verificados\n';
  text += '\nGerado em: ' + new Date().toLocaleDateString('pt-BR') + ' às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

  if (!navigator.clipboard) {
    const ta = document.createElement('textarea');
    ta.value = text;
    document.body.appendChild(ta);
    ta.select();
    document.execCommand('copy');
    document.body.removeChild(ta);
    showCopyMsg();
    return;
  }
  navigator.clipboard.writeText(text).then(showCopyMsg);
}

function showCopyMsg() {
  const msg = document.getElementById('copyMsg');
  msg.style.display = 'block';
  setTimeout(function() { msg.style.display = 'none'; }, 3000);
}

// ---- ACTIVE NAV LINK ----
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

const navObserver = new IntersectionObserver(function(entries) {
  entries.forEach(function(entry) {
    if (entry.isIntersecting) {
      navLinks.forEach(function(link) {
        link.style.color = '';
        if (link.getAttribute('href') === '#' + entry.target.id) {
          link.style.color = 'var(--accent)';
        }
      });
    }
  });
}, { threshold: 0.4 });

sections.forEach(function(s) { navObserver.observe(s); });

// ---- DEMO TABS ----
var systemLabels = {
  boleto:   { icon: '🏦', name: 'Sistema Financeiro',    sub: 'API integrada' },
  rastreio: { icon: '🚛', name: 'Sistema Logístico',     sub: 'SEFAZ / Transportadora' },
  fgts:     { icon: '💰', name: 'API FGTS / Facta',      sub: 'Saque aniversário' },
  agenda:   { icon: '📅', name: 'Sistema de Agenda',     sub: 'Calendário integrado' }
};

function switchDemo(demoId) {
  document.querySelectorAll('.demo-body').forEach(function(b) {
    b.classList.remove('active');
    b.querySelectorAll('.msg').forEach(function(m) {
      m.style.opacity = '0';
      m.style.animation = 'none';
    });
  });

  document.querySelectorAll('.demo-tab').forEach(function(t) {
    t.classList.remove('active');
  });

  var body = document.getElementById('demo-' + demoId);
  body.classList.add('active');
  document.querySelector('[data-demo="' + demoId + '"]').classList.add('active');

  setTimeout(function() {
    body.querySelectorAll('.msg').forEach(function(m) {
      m.style.animation = '';
    });
  }, 30);

  // Scroll to bottom after all messages animate in
  var lastDelay = body.querySelectorAll('.msg').length * 250 + 400;
  setTimeout(function() {
    body.scrollTop = body.scrollHeight;
  }, lastDelay);

  var badge = document.getElementById('systemBadge');
  var info = systemLabels[demoId];
  if (badge && info) {
    badge.querySelector('.sys-icon').textContent = info.icon;
    badge.querySelector('.sys-name').textContent = info.name;
    badge.querySelector('.sys-sub').textContent  = info.sub;
  }
}

document.querySelectorAll('.demo-tab').forEach(function(tab) {
  tab.addEventListener('click', function() {
    switchDemo(tab.getAttribute('data-demo'));
  });
});

// ---- SMOOTH SCROLL ----
document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    var target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ---- BACK TO TOP ----
var backToTop = document.getElementById('backToTop');
window.addEventListener('scroll', function() {
  if (window.scrollY > 400) {
    backToTop.classList.add('visible');
  } else {
    backToTop.classList.remove('visible');
  }
});
