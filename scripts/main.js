/* ============================================================
   Brioi API — Main JavaScript
   ============================================================ */

document.documentElement.classList.add('js');

/* --- Pricing Tabs --- */
function initPricingTabs() {
  const tabs = document.querySelectorAll('.pricing-tab');
  const contents = document.querySelectorAll('.pricing-content');

  if (!tabs.length || !contents.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Remove active from all tabs
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      
      // Add active to clicked tab
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      // Hide all contents
      contents.forEach(c => {
        c.classList.remove('active');
        // also set display none to let animation rerun smoothly if prefered or just let class manage it
      });
      
      // Show target content
      const targetId = tab.dataset.target;
      const targetContent = document.getElementById(targetId);
      if (targetContent) {
        targetContent.classList.add('active');
      }
    });
  });
}

// Interactive FAQ accordion detail toggle (optional logic for single-open)
if (document.body.dataset.page === 'home') {
  initPricingTabs();
  
  const details = document.querySelectorAll('details[name="faq"]');
  details.forEach(targetDetail => {
    targetDetail.addEventListener('click', () => {
      details.forEach(detail => {
        if (detail !== targetDetail) {
          detail.removeAttribute('open');
        }
      });
    });
  });

  /* --- Modals Init --- */
  const openBtns = document.querySelectorAll('[data-modal="contact"]');
  const modal = document.getElementById('contact-modal');
  if (modal) {
    const closeBtn = modal.querySelector('.js-modal-close');

    openBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        modal.setAttribute('aria-hidden', 'false');
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    closeBtn.addEventListener('click', () => {
      modal.setAttribute('aria-hidden', 'true');
      modal.classList.remove('active');
      document.body.style.overflow = '';
    });

    modal.addEventListener('click', (e) => {
      if (e.target === modal) {
        modal.setAttribute('aria-hidden', 'true');
        modal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }
}
