export const BASE_SITE = {
  brand: {
    name: 'Brioi',
    logo: '/assets/brands/shared-logo.svg#brand-mark',
    buyHeading: '购买 Brioi API',
    fontFamily: "'Bungee', \"Avenir Next\", Avenir, \"Corbel\", sans-serif",
  },
  hero: {
    titleLines: [
      { text: '更强的 AI，', accent: false },
      { text: '不该只有少数人在用', accent: true },
    ],
    subtitle: '顶级 GPT-5.4 全系列 AI 模型直连，稳定、高速、安全',
  },
  theme: {
    accent: '#00E676',
    accentHover: '#00C853',
    accentLight: '#E5FFE9',
    borderGreen: 'rgba(0, 230, 118, 0.3)',
    shadowGlow: '0 12px 32px rgba(0, 230, 118, 0.25)',
  },
  pricing: {
    buyOrder: ['plus-monthly', 'pro-monthly', 'max-monthly'],
    plans: {
      'plus-monthly': { label: 'Plus 月卡', priceText: '¥299/月' },
      'pro-monthly': { label: 'Pro 月卡', priceText: '¥399/月' },
      'max-monthly': { label: 'Max 月卡', priceText: '¥799/月' },
    },
  },
};

export const SITE_OVERRIDES = {
  brioi: {},
  cradeo: {
    brand: {
      name: 'CradEO',
      buyHeading: '购买 CradEO API',
      fontFamily: "'Black Han Sans', 'Bungee', \"Avenir Next\", Avenir, \"Corbel\", sans-serif",
    },
    theme: {
      accent: '#22C55E',
      accentHover: '#16A34A',
      accentLight: '#ECFDF3',
      borderGreen: 'rgba(34, 197, 94, 0.3)',
      shadowGlow: '0 12px 32px rgba(34, 197, 94, 0.22)',
    },
    pricing: {
      buyOrder: ['plus-monthly', 'pro-monthly', 'max-monthly'],
      plans: {
        'plus-monthly': { priceText: '¥399/月' },
        'pro-monthly': { priceText: '¥499/月' },
        'max-monthly': { priceText: '¥999/月' },
      },
    },
  },
  drigeo: {
    brand: {
      name: 'Drigeo',
      buyHeading: '购买 Drigeo API',
    },
    hero: {
      titleLines: [
        { text: '让每个人，都能接入更强的 AI', accent: true },
      ],
    },
    theme: {
      accent: '#10B981',
      accentHover: '#059669',
      accentLight: '#ECFDF5',
      borderGreen: 'rgba(16, 185, 129, 0.3)',
      shadowGlow: '0 12px 32px rgba(16, 185, 129, 0.22)',
    },
    pricing: {
      buyOrder: ['plus-monthly', 'pro-monthly', 'max-monthly', 'day-pass'],
      plans: {
        'plus-monthly': { priceText: '¥199/月' },
        'pro-monthly': { priceText: '¥299/月' },
        'max-monthly': { priceText: '¥599/月' },
        'day-pass': { label: '日卡', priceText: '¥9' },
      },
    },
  },
};

function isPlainObject(value) {
  return Boolean(value) && typeof value === 'object' && !Array.isArray(value);
}

function deepMerge(base, override) {
  const output = { ...base };

  for (const [key, value] of Object.entries(override)) {
    if (isPlainObject(value) && isPlainObject(base[key])) {
      output[key] = deepMerge(base[key], value);
      continue;
    }

    output[key] = value;
  }

  return output;
}

export function getSiteConfig(siteKey) {
  const resolvedKey = SITE_OVERRIDES[siteKey] ? siteKey : 'brioi';
  return deepMerge(BASE_SITE, SITE_OVERRIDES[resolvedKey]);
}
