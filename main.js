/* ============================================================
   Brioi API — Main JavaScript
   Progressive enhancement: page works fully without JS
   ============================================================ */

document.documentElement.classList.add('js');

/* --- Plan label mapping --- */
const PLAN_LABELS = {
  'day-pass': '日卡',
  'week-pass': '周卡',
  'plus-monthly': 'Plus 月卡',
  'pro-monthly': 'Pro 月卡',
  'max-monthly': 'Max 月卡'
};

/* --- Pricing Tab Switching --- */
function initPricingTabs() {
  const tabs = [...document.querySelectorAll('.pricing-tab')];
  const panels = {
    experience: document.getElementById('panel-experience'),
    monthly: document.getElementById('panel-monthly')
  };

  if (!tabs.length || !panels.experience || !panels.monthly) {
    return;
  }

  function activate(target) {
    tabs.forEach((tab) => {
      const selected = tab.dataset.target === target;
      tab.classList.toggle('is-active', selected);
      tab.setAttribute('aria-selected', String(selected));
    });

    Object.entries(panels).forEach(([key, panel]) => {
      panel.hidden = key !== target;
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activate(tab.dataset.target));
  });

  /* Keyboard navigation for tabs */
  tabs.forEach((tab, index) => {
    tab.addEventListener('keydown', (e) => {
      let nextIndex = index;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        nextIndex = (index + 1) % tabs.length;
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        nextIndex = (index - 1 + tabs.length) % tabs.length;
      } else {
        return;
      }
      e.preventDefault();
      tabs[nextIndex].focus();
      activate(tabs[nextIndex].dataset.target);
    });
  });

  activate('monthly');
}

/* --- Scroll-triggered Reveal Animations --- */
function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.hero-copy, .hero-side-card, .hero-summary, .editorial-blocks, .pricing, .faq, .site-footer'
  );

  if (!targets.length) return;

  /* Use IntersectionObserver for performant scroll detection */
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    targets.forEach((el) => observer.observe(el));
  } else {
    /* Fallback: show everything immediately */
    targets.forEach((el) => el.classList.add('is-visible'));
  }
}

/* --- Buy Page Plan Display --- */
function initBuyPage() {
  const selectedPlan = document.querySelector('[data-selected-plan]');

  if (!selectedPlan) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const planKey = params.get('plan');
  const label = PLAN_LABELS[planKey] ?? 'Plus 月卡';

  selectedPlan.textContent = `已选择：${label}`;
}

/* --- Init --- */
if (document.body.dataset.page === 'home') {
  initPricingTabs();
  initScrollReveal();
}

if (document.body.dataset.page === 'buy') {
  initBuyPage();
}
