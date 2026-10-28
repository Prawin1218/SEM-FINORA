// Month-wise Transactions Screen for FINORA - Yellow + Black Theme
import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';
import {
  groupTransactionsByDate,
  getCurrentMonthKey,
  formatMonthKey,
} from '../utils/dateUtils';
import { CATEGORIES } from '../data/mockData';

export const TransactionsScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { transactions, deleteTransaction } = useTransactions();

  const currentMonthKey = getCurrentMonthKey();
  const [selectedMonth, setSelectedMonth] = useState(currentMonthKey);
  const [selectedType, setSelectedType] = useState('ALL'); // 'ALL' | 'income' | 'expense'
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Extract all distinct months available in transactions
  const availableMonths = useMemo(() => {
    const monthSet = new Set([currentMonthKey]);
    transactions.forEach((tx) => {
      if (tx.date && tx.date.length >= 7) {
        monthSet.add(tx.date.substring(0, 7));
      }
    });
    return Array.from(monthSet).sort((a, b) => b.localeCompare(a));
  }, [transactions, currentMonthKey]);

  // Filter transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      if (selectedMonth !== 'ALL') {
        if (!tx.date || !tx.date.startsWith(selectedMonth)) {
          return false;
        }
      }

      if (selectedType !== 'ALL' && tx.type !== selectedType) {
        return false;
      }

      if (
        selectedCategory !== 'ALL' &&
        tx.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }

      if (searchQuery.trim()) {
        const query = searchQuery.trim().toLowerCase();
        const titleMatch = tx.title?.toLowerCase().includes(query);
        const descMatch = tx.description?.toLowerCase().includes(query);
        const catMatch = tx.category?.toLowerCase().includes(query);
        if (!titleMatch && !descMatch && !catMatch) {
          return false;
        }
      }

      return true;
    });
  }, [transactions, selectedMonth, selectedType, selectedCategory, searchQuery]);

  // Month-specific financial totals
  const monthTotals = useMemo(() => {
    let income = 0;
    let expense = 0;

    const monthPool =
      selectedMonth === 'ALL'
        ? transactions
        : transactions.filter((tx) => tx.date?.startsWith(selectedMonth));

    monthPool.forEach((tx) => {
      const amt = Math.abs(Number(tx.amount) || 0);
      if (tx.type === 'income') {
        income += amt;
      } else {
        expense += amt;
      }
    });

    return {
      income,
      expense,
      balance: income - expense,
      count: monthPool.length,
    };
  }, [transactions, selectedMonth]);

  const groupedTransactions = useMemo(() => {
    return groupTransactionsByDate(filteredTransactions);
  }, [filteredTransactions]);

  const handleDeletePrompt = (transaction) => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${transaction.title}"?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transaction.id);
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScreenHeader
        title="Transactions"
        subtitle="Month-wise cashflow and transaction logs"
        onOpenDrawer={() => navigation.openDrawer()}
        showThemeToggle
        rightAction={
          <TouchableOpacity
            style={[
              styles.headerAddBtn,
              { backgroundColor: theme.primary },
            ]}
            onPress={() => navigation.navigate('AddTransaction')}
            activeOpacity={0.8}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="add" size={22} color={theme.primaryText} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Month Selector Horizontal Scroll */}
        <View style={styles.monthScrollWrapper}>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.monthPillsRow}
          >
            <TouchableOpacity
              style={[
                styles.monthPill,
                {
                  backgroundColor:
                    selectedMonth === 'ALL'
                      ? theme.primary
                      : theme.surfaceSecondary,
                  borderColor:
                    selectedMonth === 'ALL' ? theme.primary : theme.border,
                },
              ]}
              onPress={() => setSelectedMonth('ALL')}
            >
              <Text
                style={[
                  styles.monthPillText,
                  {
                    color:
                      selectedMonth === 'ALL'
                        ? theme.primaryText
                        : theme.textSecondary,
                    fontWeight:
                      selectedMonth === 'ALL'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                All Months
              </Text>
            </TouchableOpacity>

            {availableMonths.map((mKey) => {
              const isSelected = selectedMonth === mKey;
              return (
                <TouchableOpacity
                  key={mKey}
                  style={[
                    styles.monthPill,
                    {
                      backgroundColor: isSelected
                        ? theme.primary
                        : theme.surfaceSecondary,
                      borderColor: isSelected ? theme.primary : theme.border,
                    },
                  ]}
                  onPress={() => setSelectedMonth(mKey)}
                >
                  <Text
                    style={[
                      styles.monthPillText,
                      {
                        color: isSelected
                          ? theme.primaryText
                          : theme.textSecondary,
                        fontWeight: isSelected
                          ? typography.weights.bold
                          : typography.weights.medium,
                      },
                    ]}
                  >
                    {formatMonthKey(mKey)}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        </View>

        {/* Selected Month Summary Card */}
        <View
          style={[
            styles.monthSummaryCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.summaryTitleRow}>
            <Text style={[styles.summaryTitle, { color: theme.textPrimary }]}>
              {selectedMonth === 'ALL'
                ? 'All-Time Totals'
                : `${formatMonthKey(selectedMonth)} Summary`}
            </Text>
            <Text style={[styles.summaryCountText, { color: theme.textMuted }]}>
              {monthTotals.count} {monthTotals.count === 1 ? 'record' : 'records'}
            </Text>
          </View>

          <View style={styles.summaryMetricsRow}>
            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Income
              </Text>
              <Text
                style={[styles.incomeText, { color: theme.income }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                +{formatCurrency(monthTotals.income)}
              </Text>
            </View>

            <View
              style={[
                styles.verticalDivider,
                { backgroundColor: theme.border },
              ]}
            />

            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Expense
              </Text>
              <Text
                style={[styles.expenseText, { color: theme.expense }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                -{formatCurrency(monthTotals.expense)}
              </Text>
            </View>

            <View
              style={[
                styles.verticalDivider,
                { backgroundColor: theme.border },
              ]}
            />

            <View style={styles.summaryCol}>
              <Text style={[styles.summaryLabel, { color: theme.textSecondary }]}>
                Net Balance
              </Text>
              <Text
                style={[
                  styles.balanceText,
                  {
                    color:
                      monthTotals.balance >= 0 ? theme.income : theme.expense,
                  },
                ]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatCurrency(monthTotals.balance)}
              </Text>
            </View>
          </View>
        </View>

        {/* Search Bar */}
        <View
          style={[
            styles.searchContainer,
            {
              backgroundColor: theme.inputBackground,
              borderColor: theme.border,
            },
          ]}
        >
          <Ionicons name="search-outline" size={17} color={theme.textMuted} />
          <TextInput
            placeholder="Search by title, description or category..."
            placeholderTextColor={theme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            style={[styles.searchInput, { color: theme.textPrimary }]}
          />
          {searchQuery ? (
            <TouchableOpacity onPress={() => setSearchQuery('')}>
              <Ionicons name="close-circle" size={17} color={theme.textSecondary} />
            </TouchableOpacity>
          ) : null}
        </View>

        {/* Transaction Type Filters */}
        <View
          style={[
            styles.typeFilterRow,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'ALL' && {
                backgroundColor: theme.primary, // Yellow active
              },
            ]}
            onPress={() => setSelectedType('ALL')}
          >
            <Text
              style={[
                styles.typeTabText,
                {
                  color:
                    selectedType === 'ALL'
                      ? theme.primaryText
                      : theme.textSecondary,
                  fontWeight:
                    selectedType === 'ALL'
                      ? typography.weights.bold
                      : typography.weights.medium,
                },
              ]}
            >
              All Types
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'income' && {
                backgroundColor: theme.incomeBg,
              },
            ]}
            onPress={() => setSelectedType('income')}
          >
            <Ionicons
              name="arrow-up"
              size={12}
              color={selectedType === 'income' ? theme.income : theme.textSecondary}
            />
            <Text
              style={[
                styles.typeTabText,
                {
                  color:
                    selectedType === 'income'
                      ? theme.income
                      : theme.textSecondary,
                  fontWeight:
                    selectedType === 'income'
                      ? typography.weights.bold
                      : typography.weights.medium,
                },
              ]}
            >
              Income
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.typeTab,
              selectedType === 'expense' && {
                backgroundColor: theme.expenseBg,
              },
            ]}
            onPress={() => setSelectedType('expense')}
          >
            <Ionicons
              name="arrow-down"
              size={12}
              color={selectedType === 'expense' ? theme.expense : theme.textSecondary}
            />
            <Text
              style={[
                styles.typeTabText,
                {
                  color:
                    selectedType === 'expense'
                      ? theme.expense
                      : theme.textSecondary,
                  fontWeight:
                    selectedType === 'expense'
                      ? typography.weights.bold
                      : typography.weights.medium,
                },
              ]}
            >
              Expenses
            </Text>
          </TouchableOpacity>
        </View>

        {/* Category Horizontal Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryPillsRow}
        >
          <TouchableOpacity
            style={[
              styles.catFilterPill,
              {
                backgroundColor:
                  selectedCategory === 'ALL'
                    ? (isDark ? 'rgba(255, 214, 0, 0.2)' : 'rgba(255, 214, 0, 0.35)')
                    : theme.surfaceSecondary,
                borderColor:
                  selectedCategory === 'ALL' ? theme.primary : theme.border,
              },
            ]}
            onPress={() => setSelectedCategory('ALL')}
          >
            <Text
              style={[
                styles.catFilterText,
                {
                  color:
                    selectedCategory === 'ALL'
                      ? (isDark ? theme.primary : '#B45309')
                      : theme.textSecondary,
                  fontWeight:
                    selectedCategory === 'ALL'
                      ? typography.weights.bold
                      : typography.weights.medium,
                },
              ]}
            >
              All Categories
            </Text>
          </TouchableOpacity>

          {CATEGORIES.map((cat) => {
            const isSelected =
              selectedCategory.toLowerCase() === cat.name.toLowerCase();
            return (
              <TouchableOpacity
                key={cat.id}
                style={[
                  styles.catFilterPill,
                  {
                    backgroundColor: isSelected
                      ? (isDark ? 'rgba(255, 214, 0, 0.2)' : 'rgba(255, 214, 0, 0.35)')
                      : theme.surfaceSecondary,
                    borderColor: isSelected ? theme.primary : theme.border,
                  },
                ]}
                onPress={() =>
                  setSelectedCategory(isSelected ? 'ALL' : cat.name)
                }
              >
                <Text
                  style={[
                    styles.catFilterText,
                    {
                      color: isSelected
                        ? (isDark ? theme.primary : '#B45309')
                        : theme.textSecondary,
                      fontWeight: isSelected
                        ? typography.weights.bold
                        : typography.weights.medium,
                    },
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Transactions List Grouped by Date */}
        <View style={styles.listSection}>
          {groupedTransactions.length > 0 ? (
            groupedTransactions.map((group) => (
              <View key={group.date} style={styles.dateGroup}>
                <View style={styles.dateHeaderRow}>
                  <Text
                    style={[
                      styles.dateHeaderText,
                      { color: theme.textSecondary },
                    ]}
                  >
                    {group.displayDate}
                  </Text>
                  <Text style={[styles.dateCountText, { color: theme.textMuted }]}>
                    {group.data.length} {group.data.length === 1 ? 'item' : 'items'}
                  </Text>
                </View>

                {group.data.map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={() =>
                      navigation.navigate('EditTransaction', { transactionId: tx.id })
                    }
                    onDelete={() => handleDeletePrompt(tx)}
                  />
                ))}
              </View>
            ))
          ) : (
            <EmptyState
              icon="calendar-outline"
              title="No Matching Transactions"
              description="No transactions found matching your selected month and filters."
              actionLabel="Add Transaction"
              onAction={() => navigation.navigate('AddTransaction')}
            />
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerAddBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
  },
  monthScrollWrapper: {
    marginVertical: 8,
    width: '100%',
  },
  monthPillsRow: {
    gap: 8,
  },
  monthPill: {
    paddingVertical: 6,
    paddingHorizontal: 13,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  monthPillText: {
    fontSize: typography.sizes.xs,
  },
  monthSummaryCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1.2,
    width: '100%',
  },
  summaryTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  summaryTitle: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  summaryCountText: {
    fontSize: 10,
  },
  summaryMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
  },
  summaryCol: {
    flex: 1,
    alignItems: 'center',
    flexShrink: 1,
  },
  verticalDivider: {
    width: 1,
    height: 28,
  },
  summaryLabel: {
    fontSize: 10,
    marginBottom: 2,
  },
  incomeText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  expenseText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  balanceText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    paddingHorizontal: 10,
    height: 42,
    borderWidth: 1,
    marginBottom: 10,
    gap: 6,
    width: '100%',
  },
  searchInput: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  typeFilterRow: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 10,
    borderWidth: 1,
    gap: 4,
    width: '100%',
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 7,
    borderRadius: borderRadius.sm,
    gap: 3,
  },
  typeTabText: {
    fontSize: typography.sizes.xs,
  },
  categoryPillsRow: {
    gap: 6,
    marginBottom: 12,
  },
  catFilterPill: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  catFilterText: {
    fontSize: 10,
  },
  listSection: {
    marginTop: 2,
    width: '100%',
  },
  dateGroup: {
    marginBottom: 12,
    width: '100%',
  },
  dateHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    paddingHorizontal: 2,
  },
  dateHeaderText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  dateCountText: {
    fontSize: 10,
  },
});

export default TransactionsScreen;
