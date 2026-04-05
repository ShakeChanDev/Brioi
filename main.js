document.documentElement.classList.add('js');

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

if (document.body.dataset.page === 'home') {
  initPricingTabs();
}
