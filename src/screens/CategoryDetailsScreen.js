// Category Details Screen for FINORA
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../data/mockData';
import { isCurrentMonth } from '../utils/dateUtils';

export const CategoryDetailsScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const categoryName = route?.params?.categoryName || 'Food';
  const { transactions } = useTransactions();

  // Find category metadata
  const categoryMeta =
    CATEGORIES.find((c) => c.name.toLowerCase() === categoryName.toLowerCase()) || {
      name: categoryName,
      icon: 'folder-outline',
      color: theme.primary,
      bgColor: isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6',
      description: 'Budget category',
    };

  // Filter transactions belonging exclusively to this category
  const categoryTransactions = useMemo(() => {
    return transactions.filter(
      (tx) => tx.category?.toLowerCase() === categoryName.toLowerCase()
    );
  }, [transactions, categoryName]);

  // Total spending & percentage calculations
  const stats = useMemo(() => {
    const totalExpensesAll = transactions
      .filter((tx) => tx.type === 'expense')
      .reduce((sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0), 0);

    const totalCategorySpent = categoryTransactions.reduce(
      (sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0),
      0
    );

    const currentMonthSpent = categoryTransactions
      .filter((tx) => isCurrentMonth(tx.date))
      .reduce((sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0), 0);

    const percentage =
      totalExpensesAll > 0
        ? Math.round((totalCategorySpent / totalExpensesAll) * 100)
        : 0;

    return {
      totalCategorySpent,
      currentMonthSpent,
      percentage,
      count: categoryTransactions.length,
    };
  }, [transactions, categoryTransactions]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title={categoryMeta.name}
        subtitle="Category expenditure breakdown"
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Hero Category Header Card */}
        <View
          style={[
            styles.heroCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.iconContainer,
              {
                backgroundColor: isDark
                  ? 'rgba(255, 214, 0, 0.12)'
                  : categoryMeta.bgColor || '#FFF9D6',
              },
            ]}
          >
            <Ionicons
              name={categoryMeta.icon}
              size={36}
              color={categoryMeta.color || theme.primary}
            />
          </View>

          <Text style={[styles.categoryTitle, { color: theme.textPrimary }]}>
            {categoryMeta.name}
          </Text>
          <Text style={[styles.categoryDesc, { color: theme.textSecondary }]}>
            {categoryMeta.description}
          </Text>

          <Text
            style={[styles.spendingAmount, { color: theme.textPrimary }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(stats.totalCategorySpent)}
          </Text>
          <Text style={[styles.spendingSubLabel, { color: theme.textSecondary }]}>
            Total Recorded Expenditure
          </Text>

          {/* Quick Metrics Row */}
          <View
            style={[
              styles.metaRow,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Share</Text>
              <Text
                style={[
                  styles.metaVal,
                  { color: isDark ? theme.primary : '#854D0E' },
                ]}
              >
                {stats.percentage}%
              </Text>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />

            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>This Month</Text>
              <Text
                style={[styles.metaVal, { color: theme.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
              >
                {formatCurrency(stats.currentMonthSpent)}
              </Text>
            </View>

            <View style={[styles.metaDivider, { backgroundColor: theme.border }]} />

            <View style={styles.metaItem}>
              <Text style={[styles.metaLabel, { color: theme.textSecondary }]}>Entries</Text>
              <Text style={[styles.metaVal, { color: theme.textPrimary }]}>{stats.count}</Text>
            </View>
          </View>
        </View>

        {/* Transactions list belonging strictly to this category */}
        <View style={styles.transactionsSection}>
          <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>
            {categoryMeta.name} Transactions
          </Text>

          {categoryTransactions.length > 0 ? (
            categoryTransactions.map((tx) => (
              <TransactionItem
                key={tx.id}
                transaction={tx}
                onPress={() =>
                  navigation.navigate('EditTransaction', { transactionId: tx.id })
                }
              />
            ))
          ) : (
            <EmptyState
              icon={categoryMeta.icon || 'receipt-outline'}
              title={`No ${categoryMeta.name} Transactions`}
              description={`You have not logged any expenses under ${categoryMeta.name} yet.`}
              actionLabel="Add Transaction"
              onAction={() =>
                navigation.navigate('AddTransaction', {
                  initialCategory: categoryMeta.name,
                  initialType: 'expense',
                })
              }
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
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
  },
  heroCard: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: 22,
    borderWidth: 1,
    marginBottom: 20,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  categoryTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.bold,
  },
  categoryDesc: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
    marginBottom: 12,
  },
  spendingAmount: {
    fontSize: 30,
    fontWeight: typography.weights.extraBold,
    letterSpacing: -0.5,
  },
  spendingSubLabel: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 16,
  },
  metaRow: {
    flexDirection: 'row',
    width: '100%',
    borderRadius: borderRadius.md,
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderWidth: 1,
  },
  metaItem: {
    flex: 1,
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 10,
    marginBottom: 4,
  },
  metaVal: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  metaDivider: {
    width: 1,
    height: 24,
  },
  transactionsSection: {
    marginTop: 4,
  },
  sectionHeader: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 12,
  },
});

export default CategoryDetailsScreen;
