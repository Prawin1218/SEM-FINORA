// Financial calculation and report utilities for FINORA
import { getTodayString, isWithinPastDays, isCurrentMonth } from './dateUtils';

/**
 * Standard overall calculations from a list of transactions
 */
export const calculateTotals = (transactions = []) => {
  let totalIncome = 0;
  let totalExpense = 0;

  transactions.forEach((tx) => {
    const amt = Math.abs(Number(tx.amount) || 0);
    if (tx.type === 'income') {
      totalIncome += amt;
    } else {
      totalExpense += amt;
    }
  });

  const balance = totalIncome - totalExpense;

  // Savings rate calculation (handle zero/negative income safely)
  let savingsRate = 0;
  if (totalIncome > 0) {
    const rawRate = ((totalIncome - totalExpense) / totalIncome) * 100;
    savingsRate = Math.max(0, Math.min(100, Math.round(rawRate)));
  }

  return {
    totalIncome,
    totalExpense,
    balance,
    savingsRate,
    count: transactions.length,
  };
};

/**
 * Calculate report for Daily, Weekly, or Monthly period
 */
export const calculatePeriodReport = (transactions = [], period = 'monthly') => {
  const todayStr = getTodayString();

  let filtered = [];

  if (period === 'daily') {
    filtered = transactions.filter((tx) => tx.date === todayStr);
  } else if (period === 'weekly') {
    filtered = transactions.filter((tx) => isWithinPastDays(tx.date, 7));
  } else {
    // monthly
    filtered = transactions.filter((tx) => isCurrentMonth(tx.date));
  }

  let income = 0;
  let expense = 0;

  filtered.forEach((tx) => {
    const amt = Math.abs(Number(tx.amount) || 0);
    if (tx.type === 'income') {
      income += amt;
    } else {
      expense += amt;
    }
  });

  const netBalance = income - expense;

  return {
    period,
    income,
    expense,
    balance: netBalance,
    count: filtered.length,
    transactions: filtered,
  };
};

/**
 * Calculate category breakdown for expenses
 */
export const calculateCategoryBreakdown = (transactions = []) => {
  const expenseTransactions = transactions.filter((tx) => tx.type === 'expense');
  const categoryMap = {};
  let totalExpense = 0;

  expenseTransactions.forEach((tx) => {
    const amt = Math.abs(Number(tx.amount) || 0);
    totalExpense += amt;
    const cat = tx.category || 'Other';

    if (!categoryMap[cat]) {
      categoryMap[cat] = {
        name: cat,
        total: 0,
        count: 0,
      };
    }
    categoryMap[cat].total += amt;
    categoryMap[cat].count += 1;
  });

  // Calculate percentages and sort descending
  const breakdown = Object.values(categoryMap).map((catItem) => {
    const percentage =
      totalExpense > 0 ? Math.round((catItem.total / totalExpense) * 100) : 0;
    return {
      ...catItem,
      percentage,
    };
  });

  breakdown.sort((a, b) => b.total - a.total);

  const highestCategory = breakdown.length > 0 ? breakdown[0] : null;

  return {
    breakdown,
    totalExpense,
    highestCategory,
  };
};

/**
 * Calculate spending trend over past 7 days
 */
export const calculateSpendingTrend = (transactions = []) => {
  const days = [];
  const now = new Date();

  for (let i = 6; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(now.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    const dayLabel = d.toLocaleDateString('en-US', { weekday: 'short' });

    const dayTransactions = transactions.filter(
      (tx) => tx.date === dateStr && tx.type === 'expense'
    );
    const totalDayExpense = dayTransactions.reduce(
      (sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0),
      0
    );

    days.push({
      dateStr,
      dayLabel,
      amount: totalDayExpense,
    });
  }

  const maxAmount = Math.max(...days.map((d) => d.amount), 1);
  return days.map((d) => ({
    ...d,
    ratio: d.amount / maxAmount,
  }));
};
