// Date helpers for FINORA

export const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

export const SHORT_MONTHS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

/**
 * Returns YYYY-MM-DD for today
 */
export const getTodayString = (dateObj = new Date()) => {
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Returns current month key e.g. "2026-10"
 */
export const getCurrentMonthKey = () => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  return `${year}-${month}`;
};

/**
 * Formats a date string "YYYY-MM-DD" into "28 Oct, 2026"
 */
export const formatDisplayDate = (dateStr) => {
  if (!dateStr) return '';
  try {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const year = parseInt(parts[0], 10);
      const month = parseInt(parts[1], 10) - 1;
      const day = parseInt(parts[2], 10);
      const monthName = SHORT_MONTHS[month] || '';
      return `${day} ${monthName}, ${year}`;
    }
    const d = new Date(dateStr);
    return `${d.getDate()} ${SHORT_MONTHS[d.getMonth()]}, ${d.getFullYear()}`;
  } catch {
    return dateStr;
  }
};

/**
 * Returns formatted header date e.g., "Wednesday, 28 Oct"
 */
export const getFormattedCurrentDate = () => {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const dayName = days[d.getDay()];
  const dateNum = d.getDate();
  const monthName = SHORT_MONTHS[d.getMonth()];
  return `${dayName}, ${dateNum} ${monthName}`;
};

/**
 * Returns dynamic greeting based on current hour
 */
export const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
};

/**
 * Check if a date string is within the past N days (e.g., 7 for weekly report)
 */
export const isWithinPastDays = (dateStr, days = 7) => {
  if (!dateStr) return false;
  const targetDate = new Date(dateStr);
  targetDate.setHours(0, 0, 0, 0);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const diffTime = today.getTime() - targetDate.getTime();
  const diffDays = diffTime / (1000 * 3600 * 24);

  // Within past `days` and not in future
  return diffDays >= 0 && diffDays < days;
};

/**
 * Check if a date string is in the current month
 */
export const isCurrentMonth = (dateStr) => {
  if (!dateStr) return false;
  const currentKey = getCurrentMonthKey();
  return dateStr.startsWith(currentKey);
};

/**
 * Check if date string matches selected month key "YYYY-MM"
 */
export const isInMonth = (dateStr, monthKey) => {
  if (!dateStr || !monthKey) return false;
  return dateStr.startsWith(monthKey);
};

/**
 * Get human-readable month title from key e.g., "2026-10" -> "October 2026"
 */
export const formatMonthKey = (monthKey) => {
  if (!monthKey) return '';
  const parts = monthKey.split('-');
  if (parts.length === 2) {
    const year = parts[0];
    const month = parseInt(parts[1], 10) - 1;
    return `${MONTH_NAMES[month] || parts[1]} ${year}`;
  }
  return monthKey;
};

/**
 * Group transactions by date
 */
export const groupTransactionsByDate = (transactions) => {
  const groups = {};
  transactions.forEach((tx) => {
    const key = tx.date;
    if (!groups[key]) {
      groups[key] = [];
    }
    groups[key].push(tx);
  });

  // Convert to array sorted descending by date
  return Object.keys(groups)
    .sort((a, b) => b.localeCompare(a))
    .map((date) => ({
      date,
      displayDate: formatDisplayDate(date),
      data: groups[date],
    }));
};
