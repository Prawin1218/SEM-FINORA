// Advanced Financial Analysis Screen for Customer & Admin - Yellow + Black Theme
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
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateTotals, calculateCategoryBreakdown, calculateSpendingTrend } from '../utils/reportUtils';

export const AnalysisScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { users, isAdmin } = useAuth();
  const { transactions, allTransactions } = useTransactions();

  // Metrics for active user (Customer)
  const customerTotals = useMemo(() => calculateTotals(transactions), [transactions]);
  const customerBreakdown = useMemo(() => calculateCategoryBreakdown(transactions), [transactions]);
  const spendingTrend = useMemo(() => calculateSpendingTrend(transactions), [transactions]);

  // Metrics for Admin (Platform-wide demo aggregation)
  const adminTotals = useMemo(() => calculateTotals(allTransactions), [allTransactions]);
  const adminBreakdown = useMemo(() => calculateCategoryBreakdown(allTransactions), [allTransactions]);

  const customerComparison = useMemo(() => {
    const totalVolume = customerTotals.totalIncome + customerTotals.totalExpense;
    return {
      incomePercent: totalVolume > 0 ? (customerTotals.totalIncome / totalVolume) * 100 : 50,
      expensePercent: totalVolume > 0 ? (customerTotals.totalExpense / totalVolume) * 100 : 50,
    };
  }, [customerTotals]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScreenHeader
        title={isAdmin ? 'Platform Analytics' : 'Financial Analysis'}
        subtitle={
          isAdmin
            ? 'Application-wide demo telemetry'
            : 'Deep-dive insights into cashflow & spending'
        }
        onOpenDrawer={() => navigation.openDrawer()}
        showThemeToggle
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {isAdmin ? (
          /* ===================================
             ADMIN ANALYTICS VIEW
             =================================== */
          <View style={styles.viewWrapper}>
            {/* Admin Stats Grid */}
            <View style={styles.metricsGrid}>
              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.primaryMuted },
                  ]}
                >
                  <Ionicons name="people-outline" size={16} color={theme.primary} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Demo Users
                </Text>
                <Text style={[styles.gridValue, { color: theme.textPrimary }]}>
                  {users.length}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Registered accounts
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.warningBg },
                  ]}
                >
                  <Ionicons name="receipt-outline" size={16} color={theme.warning} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Transactions
                </Text>
                <Text style={[styles.gridValue, { color: theme.textPrimary }]}>
                  {allTransactions.length}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  System total
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.incomeBg },
                  ]}
                >
                  <Ionicons name="trending-up-outline" size={16} color={theme.income} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Platform Income
                </Text>
                <Text
                  style={[styles.gridValue, { color: theme.income }]}
                  numberOfLines={1}
                >
                  {formatCurrency(adminTotals.totalIncome)}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Inflows logged
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.expenseBg },
                  ]}
                >
                  <Ionicons name="trending-down-outline" size={16} color={theme.expense} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Platform Expenses
                </Text>
                <Text
                  style={[styles.gridValue, { color: theme.expense }]}
                  numberOfLines={1}
                >
                  {formatCurrency(adminTotals.totalExpense)}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Outflows logged
                </Text>
              </View>
            </View>

            {/* Overall Category Distribution across all users */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="pie-chart-outline" size={17} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Overall Category Distribution
                </Text>
              </View>
              <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                Aggregated expenditure proportion across all customer transactions
              </Text>

              <View style={styles.distributionList}>
                {adminBreakdown.breakdown.map((item, index) => (
                  <View key={index} style={styles.distRow}>
                    <View style={styles.distMeta}>
                      <Text style={[styles.distName, { color: theme.textPrimary }]}>
                        {item.name}
                      </Text>
                      <Text style={[styles.distAmount, { color: theme.textSecondary }]}>
                        {formatCurrency(item.total)} ({item.percentage}%)
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.barTrack,
                        { backgroundColor: theme.surfaceSecondary },
                      ]}
                    >
                      <View
                        style={[
                          styles.barProgress,
                          {
                            width: `${item.percentage}%`,
                            backgroundColor:
                              theme.categories[item.name] || theme.primary,
                          },
                        ]}
                      />
                    </View>
                  </View>
                ))}
              </View>
            </View>
          </View>
        ) : (
          /* ===================================
             CUSTOMER ANALYTICS VIEW
             =================================== */
          <View style={styles.viewWrapper}>
            {/* Top 4 Key Metric Cards */}
            <View style={styles.metricsGrid}>
              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.incomeBg },
                  ]}
                >
                  <Ionicons name="arrow-up" size={15} color={theme.income} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Total Inflow
                </Text>
                <Text
                  style={[styles.gridValue, { color: theme.income }]}
                  numberOfLines={1}
                >
                  {formatCurrency(customerTotals.totalIncome)}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Earned to date
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.expenseBg },
                  ]}
                >
                  <Ionicons name="arrow-down" size={15} color={theme.expense} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Total Outflow
                </Text>
                <Text
                  style={[styles.gridValue, { color: theme.expense }]}
                  numberOfLines={1}
                >
                  {formatCurrency(customerTotals.totalExpense)}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Spent to date
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: 'rgba(255, 214, 0, 0.18)' },
                  ]}
                >
                  <Ionicons name="wallet-outline" size={15} color={theme.primary} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Net Balance
                </Text>
                <Text
                  style={[styles.gridValue, { color: theme.textPrimary }]}
                  numberOfLines={1}
                >
                  {formatCurrency(customerTotals.balance)}
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Current liquidity
                </Text>
              </View>

              <View
                style={[
                  styles.gridCard,
                  {
                    backgroundColor: theme.surface,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View
                  style={[
                    styles.gridIconCircle,
                    { backgroundColor: theme.primaryMuted },
                  ]}
                >
                  <Ionicons name="sparkles-outline" size={15} color={theme.primary} />
                </View>
                <Text style={[styles.gridLabel, { color: theme.textSecondary }]}>
                  Savings Rate
                </Text>
                <Text
                  style={[
                    styles.gridValue,
                    { color: isDark ? theme.primary : '#B45309' },
                  ]}
                  numberOfLines={1}
                >
                  {customerTotals.savingsRate}%
                </Text>
                <Text style={[styles.gridSub, { color: theme.textMuted }]}>
                  Target: &gt; 25%
                </Text>
              </View>
            </View>

            {/* Income vs Expense Comparative Visual Chart */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="git-compare-outline" size={17} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Income vs Expense Flow
                </Text>
              </View>
              <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                Proportional breakdown of total volume
              </Text>

              <View
                style={[
                  styles.visualComparison,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                  },
                ]}
              >
                <View style={styles.compareValuesRow}>
                  <View>
                    <Text style={[styles.compareSub, { color: theme.textSecondary }]}>
                      Total Inflow
                    </Text>
                    <Text style={[styles.compareValue, { color: theme.income }]}>
                      +{formatCurrency(customerTotals.totalIncome)}
                    </Text>
                    <Text style={[styles.comparePercent, { color: theme.income }]}>
                      {formatPercent(customerComparison.incomePercent, 1)}
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={[styles.compareSub, { color: theme.textSecondary }]}>
                      Total Outflow
                    </Text>
                    <Text style={[styles.compareValue, { color: theme.expense }]}>
                      -{formatCurrency(customerTotals.totalExpense)}
                    </Text>
                    <Text style={[styles.comparePercent, { color: theme.expense }]}>
                      {formatPercent(customerComparison.expensePercent, 1)}
                    </Text>
                  </View>
                </View>

                {/* Proportion bar */}
                <View
                  style={[
                    styles.proportionBar,
                    { backgroundColor: theme.background },
                  ]}
                >
                  <View
                    style={[
                      styles.propIncome,
                      {
                        width: `${customerComparison.incomePercent}%`,
                        backgroundColor: theme.income,
                      },
                    ]}
                  />
                  <View
                    style={[
                      styles.propExpense,
                      {
                        width: `${customerComparison.expensePercent}%`,
                        backgroundColor: theme.expense,
                      },
                    ]}
                  />
                </View>
              </View>
            </View>

            {/* Weekly Spending Trend Visual Chart */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="bar-chart-outline" size={17} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Daily Outflow Trend
                </Text>
              </View>
              <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                Expenditures over the past 7 days
              </Text>

              <View style={styles.chartArea}>
                <View style={styles.barsContainer}>
                  {spendingTrend.map((d, i) => (
                    <View key={i} style={styles.barColumn}>
                      <Text style={[styles.barAmountText, { color: theme.textMuted }]}>
                        {d.amount > 0 ? `₹${d.amount}` : '-'}
                      </Text>
                      <View
                        style={[
                          styles.barVerticalTrack,
                          { backgroundColor: theme.surfaceSecondary },
                        ]}
                      >
                        <View
                          style={[
                            styles.barVerticalFill,
                            {
                              height: `${Math.max(10, Math.round(d.ratio * 100))}%`,
                              backgroundColor:
                                d.amount > 0 ? theme.expense : theme.border,
                            },
                          ]}
                        />
                      </View>
                      <Text style={[styles.barLabelText, { color: theme.textSecondary }]}>
                        {d.dayLabel}
                      </Text>
                    </View>
                  ))}
                </View>
              </View>
            </View>

            {/* Expense Category Breakdown */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="pie-chart-outline" size={17} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Expense Category Breakdown
                </Text>
              </View>
              <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
                Ranked by expenditure
              </Text>

              <View style={styles.breakdownList}>
                {customerBreakdown.breakdown.length > 0 ? (
                  customerBreakdown.breakdown.map((cat, idx) => (
                    <View key={idx} style={styles.catBreakdownItem}>
                      <View
                        style={[
                          styles.catRankBadge,
                          {
                            backgroundColor:
                              idx === 0
                                ? theme.primaryMuted
                                : theme.surfaceSecondary,
                          },
                        ]}
                      >
                        <Text
                          style={[
                            styles.catRankText,
                            {
                              color:
                                idx === 0
                                  ? (isDark ? theme.primary : '#B45309')
                                  : theme.textSecondary,
                            },
                          ]}
                        >
                          #{idx + 1}
                        </Text>
                      </View>
                      <View style={styles.catDetailsWrapper}>
                        <View style={styles.catNameRow}>
                          <Text
                            style={[styles.catName, { color: theme.textPrimary }]}
                          >
                            {cat.name}
                          </Text>
                          <Text
                            style={[styles.catAmount, { color: theme.textPrimary }]}
                          >
                            {formatCurrency(cat.total)}
                          </Text>
                        </View>
                        <View
                          style={[
                            styles.progressContainer,
                            { backgroundColor: theme.surfaceSecondary },
                          ]}
                        >
                          <View
                            style={[
                              styles.catProgressBar,
                              {
                                width: `${cat.percentage}%`,
                                backgroundColor:
                                  theme.categories[cat.name] || theme.primary,
                              },
                            ]}
                          />
                        </View>
                        <Text
                          style={[styles.catPercentSub, { color: theme.textMuted }]}
                        >
                          {cat.percentage}% of expenses • {cat.count} records
                        </Text>
                      </View>
                    </View>
                  ))
                ) : (
                  <Text style={[styles.emptyText, { color: theme.textMuted }]}>
                    No expense data recorded yet.
                  </Text>
                )}
              </View>
            </View>

            {/* Recent Logged Activity */}
            <View
              style={[
                styles.sectionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
            >
              <View style={styles.sectionHeaderRow}>
                <Ionicons name="time-outline" size={17} color={theme.primary} />
                <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
                  Recent Activity
                </Text>
              </View>
              <View style={{ marginTop: 10 }}>
                {transactions.slice(0, 4).map((tx) => (
                  <TransactionItem
                    key={tx.id}
                    transaction={tx}
                    onPress={() =>
                      navigation.navigate('EditTransaction', { transactionId: tx.id })
                    }
                  />
                ))}
              </View>
            </View>
          </View>
        )}
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
    paddingTop: 8,
  },
  viewWrapper: {
    width: '100%',
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    gap: 8,
    marginBottom: 12,
  },
  gridCard: {
    width: '48%',
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    flexShrink: 1,
  },
  gridIconCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  gridLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  gridValue: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.extraBold,
    marginTop: 2,
    marginBottom: 2,
  },
  gridSub: {
    fontSize: 9,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.2,
    width: '100%',
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  sectionTitle: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  sectionDesc: {
    fontSize: 11,
    marginTop: 2,
    marginBottom: 12,
  },
  visualComparison: {
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    width: '100%',
  },
  compareValuesRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  compareSub: {
    fontSize: 10,
  },
  compareValue: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    marginTop: 1,
  },
  comparePercent: {
    fontSize: 10,
    fontWeight: typography.weights.semiBold,
    marginTop: 1,
  },
  proportionBar: {
    height: 8,
    borderRadius: 4,
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  propIncome: {
    height: '100%',
  },
  propExpense: {
    height: '100%',
  },
  chartArea: {
    paddingVertical: 6,
    width: '100%',
  },
  barsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 100,
    width: '100%',
    paddingHorizontal: 4,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
  },
  barAmountText: {
    fontSize: 8,
    marginBottom: 4,
  },
  barVerticalTrack: {
    width: 14,
    height: 60,
    borderRadius: 7,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barVerticalFill: {
    width: '100%',
    borderRadius: 7,
  },
  barLabelText: {
    fontSize: 9,
    marginTop: 4,
  },
  breakdownList: {
    gap: 10,
    width: '100%',
  },
  catBreakdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  catRankBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  catRankText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  catDetailsWrapper: {
    flex: 1,
  },
  catNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  catName: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.semiBold,
  },
  catAmount: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  progressContainer: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
    width: '100%',
  },
  catProgressBar: {
    height: '100%',
    borderRadius: 2.5,
  },
  catPercentSub: {
    fontSize: 9,
    marginTop: 2,
  },
  distributionList: {
    gap: 10,
    width: '100%',
  },
  distRow: {
    marginBottom: 6,
    width: '100%',
  },
  distMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 3,
  },
  distName: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.medium,
  },
  distAmount: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
  barTrack: {
    height: 5,
    borderRadius: 2.5,
    overflow: 'hidden',
    width: '100%',
  },
  barProgress: {
    height: '100%',
    borderRadius: 2.5,
  },
  emptyText: {
    fontSize: typography.sizes.xs,
    textAlign: 'center',
    paddingVertical: 10,
  },
});

export default AnalysisScreen;
