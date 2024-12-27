const formatter = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

const numberFormatter = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatNumber(
  input: any,
  type: 'currency' | 'number' = 'number',
): string {
  const value = parseFloat(input) || 0;

  if (value === 0) return '0';

  if (value < 0) {
    return `-${formatNumber(Math.abs(value), type)}`;
  }

  // Handle very large numbers
  if (value >= 1e12) {
    return `${type === 'currency' ? '$' : ''}${(value / 1e12).toFixed(2)}T`;
  }
  if (value >= 1e9) {
    return `${type === 'currency' ? '$' : ''}${(value / 1e9).toFixed(2)}B`;
  }
  if (value >= 1e6) {
    return `${type === 'currency' ? '$' : ''}${(value / 1e6).toFixed(2)}M`;
  }
  if (value >= 1e3) {
    return `${type === 'currency' ? '$' : ''}${(value / 1e3).toFixed(2)}K`;
  }

  return type === 'currency'
    ? formatter.format(value)
    : numberFormatter.format(value);
}
