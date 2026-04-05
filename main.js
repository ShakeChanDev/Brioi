document.documentElement.classList.add('js');

const PLAN_LABELS = {
  'day-pass': '日卡',
  'week-pass': '周卡',
  'plus-monthly': 'Plus 月卡',
  'pro-monthly': 'Pro 月卡',
  'max-monthly': 'Max 月卡'
};

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

  activate('monthly');
}

function initBuyPage() {
  const selectedPlan = document.querySelector('.buy-plan');

  if (!selectedPlan) {
    return;
  }

  const params = new URLSearchParams(window.location.search);
  const plan = params.get('plan');
  const label = PLAN_LABELS[plan] || PLAN_LABELS['plus-monthly'];

  selectedPlan.textContent = `已选择：${label}`;
}

if (document.body.dataset.page === 'home') {
  initPricingTabs();
}

if (document.body.dataset.page === 'buy') {
  initBuyPage();
}
