export const CurrencyUtils = {
  format: (amount: number, currency = 'USD', locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  },

  formatCompact: (amount: number, currency = 'USD', locale = 'en-US'): string => {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      notation: 'compact',
      compactDisplay: 'short',
    }).format(amount);
  },

  parse: (value: string): number => {
    const cleaned = value.replace(/[^0-9.,-]/g, '').replace(/,/g, '');
    return parseFloat(cleaned);
  },

  isValid: (value: unknown): value is number => {
    return typeof value === 'number' && !isNaN(value) && isFinite(value);
  },

  toCents: (amount: number): number => {
    return Math.round(amount * 100);
  },

  fromCents: (cents: number): number => {
    return cents / 100;
  },
};
