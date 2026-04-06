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

const SOFTWARE_DETAILS = {
  codex: {
    title: 'Codex 使用方式',
    mode: '适合直接在 Codex 工作流中登录后开始使用。',
    steps: [
      '打开 Codex 客户端。',
      '使用购买后的账号完成登录。',
      '进入项目后直接开始对话或编码。'
    ],
    note: '建议优先使用较新版本客户端，减少登录态兼容问题。'
  },
  'claude-code': {
    title: 'Claude Code 使用方式',
    mode: '适合命令行驱动的代码工作流，登录后即可进入会话。',
    steps: [
      '打开 Claude Code。',
      '使用购买后的账号完成登录。',
      '进入工作区后按默认命令流开始使用。'
    ],
    note: '建议优先使用较新版本客户端，减少登录态兼容问题。'
  },
  opencode: {
    title: 'OpenCode 使用方式',
    mode: '适合开放式代码工作流，登录后按默认入口直接使用。',
    steps: [
      '打开 OpenCode 客户端。',
      '使用购买后的账号完成登录。',
      '进入项目后按默认界面开始工作。'
    ],
    note: '首次使用时确认网络与账号状态正常，再进入长期会话。'
  },
  openclaw: {
    title: 'OpenClaw 使用方式',
    mode: '适合 Brioi 当前支持的 OpenClaw 客户端场景，登录后即可进入。',
    steps: [
      '打开 OpenClaw 客户端。',
      '使用购买后的账号完成登录。',
      '进入界面后直接按默认流程开始使用。'
    ],
    note: '如遇到登录态异常，先退出并重新进入客户端。'
  }
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

function initSoftwareModal() {
  const modal = document.querySelector('[data-software-modal]');
  const triggers = [...document.querySelectorAll('.software-trigger')];

  if (!modal || !triggers.length) {
    return;
  }

  const title = modal.querySelector('#software-modal-title');
  const modalIconImage = modal.querySelector('[data-modal-icon-image]');
  const mode = modal.querySelector('[data-modal-mode]');
  const steps = modal.querySelector('[data-modal-steps]');
  const note = modal.querySelector('[data-modal-note]');
  const dialog = modal.querySelector('.software-modal');
  const closeButton = modal.querySelector('[data-close-software-modal]');
  const mainContent = modal.parentElement;
  const inertTargets = [...document.body.children].flatMap((element) => {
    if (element === mainContent) {
      return [...element.children].filter((child) => child !== modal);
    }

    return [element];
  });
  const previousInertState = new Map();
  let activeTrigger = null;

  if (!title || !modalIconImage || !mode || !steps || !note || !dialog || !closeButton) {
    return;
  }

  function setBackgroundInert(isInert) {
    inertTargets.forEach((element) => {
      if (isInert) {
        previousInertState.set(element, element.inert);
        element.inert = true;
      } else {
        element.inert = previousInertState.get(element) ?? false;
      }
    });

    if (!isInert) {
      previousInertState.clear();
    }
  }

  function getFocusableElements() {
    return [...dialog.querySelectorAll(
      'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])'
    )];
  }

  function closeModal() {
    if (modal.hidden) {
      return;
    }

    modal.hidden = true;
    document.body.classList.remove('modal-open');
    setBackgroundInert(false);

    if (activeTrigger) {
      activeTrigger.focus();
      activeTrigger = null;
    }
  }

  function openModal(key, trigger) {
    const details = SOFTWARE_DETAILS[key];
    const softwareCard = trigger.closest('.software-card');
    const iconSrc = softwareCard?.dataset.softwareIconSrc ?? '';

    if (!details || !iconSrc) {
      return;
    }

    title.textContent = details.title;
    modalIconImage.src = iconSrc;
    modalIconImage.alt = '';
    mode.textContent = details.mode;
    note.textContent = details.note;
    steps.innerHTML = details.steps.map((step) => `<li>${step}</li>`).join('');
    activeTrigger = trigger;
    modal.hidden = false;
    document.body.classList.add('modal-open');
    setBackgroundInert(true);
    dialog.scrollTop = 0;
    dialog.focus();
  }

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => openModal(trigger.dataset.software, trigger));
  });

  closeButton.addEventListener('click', closeModal);

  modal.addEventListener('click', (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === 'Escape') {
      closeModal();
      return;
    }

    if (event.key !== 'Tab') {
      return;
    }

    const focusableElements = getFocusableElements();

    if (!focusableElements.length) {
      event.preventDefault();
      dialog.focus();
      return;
    }

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    if (document.activeElement === dialog) {
      event.preventDefault();

      if (event.shiftKey) {
        lastElement.focus();
      } else {
        firstElement.focus();
      }

      return;
    }

    if (event.shiftKey && document.activeElement === firstElement) {
      event.preventDefault();
      lastElement.focus();
    } else if (!event.shiftKey && document.activeElement === lastElement) {
      event.preventDefault();
      firstElement.focus();
    }
  });
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
  initSoftwareModal();
}

if (document.body.dataset.page === 'buy') {
  initBuyPage();
}
