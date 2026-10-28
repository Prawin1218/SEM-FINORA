// Utility formatters for FINORA

/**
 * Format a number into Indian Rupee (INR) currency representation
 * e.g., 150000 -> ₹1,50,000
 */
export const formatCurrency = (amount, includeDecimal = false) => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return '₹0';
  }

  const isNegative = amount < 0;
  const absAmount = Math.abs(Number(amount));

  let formatted = '';
  if (includeDecimal) {
    formatted = absAmount.toLocaleString('en-IN', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  } else {
    formatted = Math.round(absAmount).toLocaleString('en-IN');
  }

  return `${isNegative ? '-' : ''}₹${formatted}`;
};

/**
 * Format signed amount with explicit + or - indicator
 */
export const formatSignedCurrency = (amount, type = 'expense') => {
  const abs = Math.abs(Number(amount || 0));
  const formatted = Math.round(abs).toLocaleString('en-IN');
  if (type === 'income') {
    return `+₹${formatted}`;
  }
  return `-₹${formatted}`;
};

/**
 * Format percentage
 */
export const formatPercent = (value, decimals = 1) => {
  if (value === null || value === undefined || isNaN(value)) {
    return '0%';
  }
  return `${Number(value).toFixed(decimals)}%`;
};

/**
 * Capitalize first letter
 */
export const capitalize = (str) => {
  if (!str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};
