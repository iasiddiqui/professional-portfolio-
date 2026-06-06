export function formatNumber(value: number, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat('en-US', options).format(value);
}

export function formatCurrency(value: number, currency = 'USD'): string {
  return formatNumber(value, { style: 'currency', currency });
}

export function formatCompact(value: number): string {
  return formatNumber(value, { notation: 'compact', compactDisplay: 'short' });
}

export function formatPercent(value: number, decimals = 0): string {
  return formatNumber(value / 100, {
    style: 'percent',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}
