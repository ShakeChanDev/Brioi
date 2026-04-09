import { getSiteConfig } from '/scripts/site-config.js';

function parsePriceText(priceText) {
  const matchedPrice = priceText.match(/^(?<currency>[^\d]*)(?<amount>\d+(?:\.\d+)?)(?<period>.*)$/u);

  if (!matchedPrice?.groups) {
    return {
      currency: '',
      amount: priceText,
      period: '',
    };
  }

  return {
    currency: matchedPrice.groups.currency ?? '',
    amount: matchedPrice.groups.amount ?? priceText,
    period: matchedPrice.groups.period ?? '',
  };
}

function createPricePart(className, textContent) {
  const node = document.createElement('span');
  node.className = className;
  node.textContent = textContent;
  return node;
}

function applyStructuredPrice(priceNode, priceText) {
  const { currency, amount, period } = parsePriceText(priceText);
  const currencyNode = priceNode.querySelector('.price-currency');
  const amountNode = priceNode.querySelector('.price-amount');
  const periodNode = priceNode.querySelector('.price-period');

  if (currencyNode && amountNode) {
    currencyNode.textContent = currency;
    amountNode.textContent = amount;

    if (periodNode) {
      periodNode.textContent = period;
      return;
    }

    if (period) {
      priceNode.append(createPricePart('price-period', period));
    }

    return;
  }

  const priceParts = [];

  if (currency) {
    priceParts.push(createPricePart('price-currency', currency));
  }

  priceParts.push(createPricePart('price-amount', amount));

  if (period) {
    priceParts.push(createPricePart('price-period', period));
  }

  priceNode.replaceChildren(...priceParts);
}

function applyTheme(siteConfig) {
  const root = document.documentElement;
  root.style.setProperty('--accent', siteConfig.theme.accent);
  root.style.setProperty('--accent-hover', siteConfig.theme.accentHover);
  root.style.setProperty('--accent-light', siteConfig.theme.accentLight);
  root.style.setProperty('--border-green', siteConfig.theme.borderGreen);
  root.style.setProperty('--shadow-glow', siteConfig.theme.shadowGlow);
}

function applyBrand(siteConfig) {
  document.documentElement.style.setProperty('--brand-font-family', siteConfig.brand.fontFamily);

  document.querySelectorAll('[data-brand-name]').forEach((node) => {
    node.textContent = siteConfig.brand.name;
  });

  document.querySelectorAll('[data-buy-heading]').forEach((node) => {
    if (!node.querySelector('[data-brand-name]')) {
      node.textContent = siteConfig.brand.buyHeading;
    }
  });

  document.querySelectorAll('[data-brand-logo]').forEach((node) => {
    const logoUse = node.querySelector('use');
    if (logoUse) {
      logoUse.setAttribute('href', siteConfig.brand.logo);
    }
  });
}

function applyHero(siteConfig) {
  const heroTitle = document.querySelector('[data-hero-title]');
  if (!heroTitle) return;

  heroTitle.replaceChildren(
    ...siteConfig.hero.titleLines.map(({ text, accent }) => {
      const span = document.createElement('span');
      span.className = accent ? 'hero-line hero-line--accent' : 'hero-line';
      span.textContent = text;
      return span;
    })
  );

  document.querySelectorAll('[data-copy="hero.subtitle"]').forEach((node) => {
    node.textContent = siteConfig.hero.subtitle;
  });
}

function applyPricing(siteConfig) {
  document.querySelectorAll('[data-plan-id]').forEach((card) => {
    const planId = card.dataset.planId;
    const plan = siteConfig.pricing.plans[planId];

    if (!plan || !plan.enabled) {
      card.remove();
      return;
    }

    const labelNode = card.querySelector('[data-plan-label]');
    const priceNode = card.querySelector('[data-plan-price]');
    const buyLink = card.querySelector('[data-plan-buy]');

    if (labelNode) labelNode.textContent = plan.label;
    if (priceNode) applyStructuredPrice(priceNode, plan.priceText);
    if (buyLink) buyLink.setAttribute('href', `./buy.html?plan=${planId}`);
  });
}

function initBuyPage(siteConfig) {
  const selectedPlanNode = document.querySelector('[data-selected-plan]');
  if (!selectedPlanNode) return;

  const params = new URLSearchParams(window.location.search);
  const requestedPlan = params.get('plan');
  const enabledPlans = siteConfig.pricing.order.filter((planId) => {
    return siteConfig.pricing.plans[planId]?.enabled;
  });
  const finalPlanId = enabledPlans.includes(requestedPlan) ? requestedPlan : enabledPlans[0];
  const planLabel = siteConfig.pricing.plans[finalPlanId].label;

  selectedPlanNode.textContent = `已选择：${planLabel}`;
}

function initSiteRuntime() {
  const siteKey = document.body.dataset.site || 'brioi';
  const siteConfig = getSiteConfig(siteKey);

  applyTheme(siteConfig);
  applyBrand(siteConfig);
  applyHero(siteConfig);
  applyPricing(siteConfig);
  initBuyPage(siteConfig);
}

document.addEventListener('DOMContentLoaded', initSiteRuntime);
