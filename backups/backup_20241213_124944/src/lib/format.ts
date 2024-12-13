export function formatDate(date: string | undefined, isRTL: boolean = false): string {
  if (!date) return '';
  try {
    return new Date(date).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US');
  } catch {
    return date;
  }
}

export function formatCurrency(value: number | string | undefined, isRTL: boolean = false): string {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();
  return new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US', {
    style: 'currency',
    currency: 'EGP'
  }).format(num);
}

export function formatArea(value: number | string | undefined, isRTL: boolean = false): string {
  if (!value) return '';
  const num = typeof value === 'string' ? parseFloat(value) : value;
  if (isNaN(num)) return value.toString();
  return `${new Intl.NumberFormat(isRTL ? 'ar-EG' : 'en-US').format(num)} م²`;
}
