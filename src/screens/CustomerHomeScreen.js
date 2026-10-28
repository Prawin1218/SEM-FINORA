// Customer Home Dashboard for FINORA - Yellow + Black Theme
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import BalanceCard from '../components/BalanceCard';
import ReportCard from '../components/ReportCard';
import TransactionItem from '../components/TransactionItem';
import EmptyState from '../components/EmptyState';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { getFormattedCurrentDate, getGreeting } from '../utils/dateUtils';
import { formatCurrency, formatPercent } from '../utils/formatters';
import { calculateSpendingTrend } from '../utils/reportUtils';

export const CustomerHomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const { user } = useAuth();
  const { transactions, totals, categorySummary } = useTransactions();

  const firstName = user?.name ? user.name.split(' ')[0] : 'Member';
  const greeting = getGreeting();
  const currentDateFormatted = getFormattedCurrentDate();

  // Up to 5 most recent transactions
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 5);
  }, [transactions]);

  // Spending trend for 7-day mini visual bar chart
  const spendingTrend = useMemo(() => {
    return calculateSpendingTrend(transactions);
  }, [transactions]);

  // Income vs Expense comparison ratio
  const comparison = useMemo(() => {
    const totalVolume = totals.totalIncome + totals.totalExpense;
    const incomeRatio = totalVolume > 0 ? (totals.totalIncome / totalVolume) * 100 : 50;
    const expenseRatio = totalVolume > 0 ? (totals.totalExpense / totalVolume) * 100 : 50;
    return { incomeRatio, expenseRatio };
  }, [totals]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      {/* Top Header Row with Profile, Greeting, and Theme Switcher */}
      <View
        style={[
          styles.headerBar,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View style={styles.headerLeft}>
          <TouchableOpacity
            style={[
              styles.drawerBurgerBtn,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.openDrawer()}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="menu-outline" size={22} color={theme.textPrimary} />
          </TouchableOpacity>

          <View style={styles.greetingWrapper}>
            <Text
              style={[styles.greetingText, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {greeting}, {firstName} 👋
            </Text>
            <Text
              style={[styles.dateText, { color: theme.textSecondary }]}
              numberOfLines={1}
            >
              {currentDateFormatted}
            </Text>
          </View>
        </View>

        <View style={styles.headerRightActions}>
          {/* Theme Quick Toggle (Sun / Moon) */}
          <TouchableOpacity
            style={[
              styles.themeToggleBtn,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
            onPress={toggleTheme}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons
              name={isDark ? 'sunny-outline' : 'moon-outline'}
              size={18}
              color={theme.primary}
            />
          </TouchableOpacity>

          {/* Profile Avatar */}
          <TouchableOpacity
            style={[
              styles.avatarButton,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.primary,
              },
            ]}
            onPress={() => navigation.navigate('Profile')}
            activeOpacity={0.8}
          >
            <Text style={styles.avatarEmoji}>{user?.avatar || '👤'}</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 }, // Keep content above bottom tab bar!
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Subtitle Banner */}
        <Text style={[styles.overviewSubtitle, { color: theme.textSecondary }]}>
          Here is your financial overview.
        </Text>

        {/* HERO BALANCE CARD */}
        <BalanceCard
          balance={totals.balance}
          totalIncome={totals.totalIncome}
          totalExpense={totals.totalExpense}
          savingsRate={totals.savingsRate}
        />

        {/* QUICK ACTIONS ROW */}
        <View style={styles.quickActionsSection}>
          <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>
            Quick Actions
          </Text>
          <View style={styles.actionsGrid}>
            {/* Add Income */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() =>
                navigation.navigate('AddTransaction', { initialType: 'income' })
              }
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconBox,
                  { backgroundColor: theme.incomeBg },
                ]}
              >
                <Ionicons
                  name="arrow-up-circle-outline"
                  size={20}
                  color={theme.income}
                />
              </View>
              <Text
                style={[styles.actionLabel, { color: theme.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                Add Income
              </Text>
            </TouchableOpacity>

            {/* Add Expense */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() =>
                navigation.navigate('AddTransaction', { initialType: 'expense' })
              }
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconBox,
                  { backgroundColor: theme.expenseBg },
                ]}
              >
                <Ionicons
                  name="arrow-down-circle-outline"
                  size={20}
                  color={theme.expense}
                />
              </View>
              <Text
                style={[styles.actionLabel, { color: theme.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                Add Expense
              </Text>
            </TouchableOpacity>

            {/* View Transactions */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => navigation.navigate('Transactions')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconBox,
                  { backgroundColor: theme.primaryMuted },
                ]}
              >
                <Ionicons
                  name="receipt-outline"
                  size={20}
                  color={theme.primary}
                />
              </View>
              <Text
                style={[styles.actionLabel, { color: theme.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                Transactions
              </Text>
            </TouchableOpacity>

            {/* View Analysis */}
            <TouchableOpacity
              style={[
                styles.actionCard,
                {
                  backgroundColor: theme.surface,
                  borderColor: theme.border,
                },
              ]}
              onPress={() => navigation.navigate('Analysis')}
              activeOpacity={0.7}
            >
              <View
                style={[
                  styles.actionIconBox,
                  { backgroundColor: theme.warningBg },
                ]}
              >
                <Ionicons
                  name="pie-chart-outline"
                  size={20}
                  color={theme.warning}
                />
              </View>
              <Text
                style={[styles.actionLabel, { color: theme.textPrimary }]}
                numberOfLines={1}
                adjustsFontSizeToFit
                minimumFontScale={0.75}
              >
                Analysis
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* DAILY, WEEKLY, AND MONTHLY REPORTS (Mandatory Examination Requirement) */}
        <ReportCard transactions={transactions} />

        {/* SPENDING INSIGHTS & ANALYTICS */}
        <View
          style={[
            styles.insightsCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
              shadowColor: theme.cardShadow,
            },
          ]}
        >
          <View style={styles.insightsHeader}>
            <View style={styles.iconHeadingRow}>
              <Ionicons name="bulb-outline" size={17} color={theme.primary} />
              <Text style={[styles.insightsTitle, { color: theme.textPrimary }]}>
                Financial Insights
              </Text>
            </View>
            <TouchableOpacity onPress={() => navigation.navigate('Analysis')}>
              <Text
                style={[
                  styles.viewMoreText,
                  { color: isDark ? theme.primary : '#B45309' },
                ]}
              >
                Full Analytics
              </Text>
            </TouchableOpacity>
          </View>

          {/* Income vs Expense Ratio Bar */}
          <View style={styles.ratioSection}>
            <View style={styles.ratioLabelRow}>
              <Text style={[styles.ratioSubLabel, { color: theme.income }]}>
                Inflow: {formatPercent(comparison.incomeRatio, 0)}
              </Text>
              <Text style={[styles.ratioSubLabel, { color: theme.expense }]}>
                Outflow: {formatPercent(comparison.expenseRatio, 0)}
              </Text>
            </View>
            <View
              style={[
                styles.ratioTrack,
                { backgroundColor: theme.surfaceSecondary },
              ]}
            >
              <View
                style={[
                  styles.ratioFillIncome,
                  {
                    width: `${comparison.incomeRatio}%`,
                    backgroundColor: theme.income,
                  },
                ]}
              />
              <View
                style={[
                  styles.ratioFillExpense,
                  {
                    width: `${comparison.expenseRatio}%`,
                    backgroundColor: theme.expense,
                  },
                ]}
              />
            </View>
          </View>

          {/* Highest Category & Savings Highlight */}
          <View style={styles.insightPillsRow}>
            <View
              style={[
                styles.insightPill,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.pillMuted, { color: theme.textMuted }]}>
                Top Expense Category
              </Text>
              <Text
                style={[styles.pillPrimary, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {categorySummary.highestCategory
                  ? `${categorySummary.highestCategory.name} (${formatCurrency(
                      categorySummary.highestCategory.total
                    )})`
                  : 'None logged'}
              </Text>
            </View>

            <View
              style={[
                styles.insightPill,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.pillMuted, { color: theme.textMuted }]}>
                Savings Health
              </Text>
              <Text
                style={[
                  styles.pillPrimary,
                  {
                    color:
                      totals.savingsRate >= 30 ? theme.income : theme.warning,
                  },
                ]}
                numberOfLines={1}
              >
                {totals.savingsRate >= 30 ? 'Strong (Healthy)' : 'Moderate'}
              </Text>
            </View>
          </View>

          {/* 7-Day Mini Spending Trend Visual Chart */}
          <View
            style={[
              styles.trendContainer,
              { borderTopColor: theme.borderLight },
            ]}
          >
            <Text style={[styles.trendTitle, { color: theme.textSecondary }]}>
              7-Day Daily Outflow Trend
            </Text>
            <View style={styles.chartBarsRow}>
              {spendingTrend.map((day, idx) => (
                <View key={idx} style={styles.chartBarCol}>
                  <View
                    style={[
                      styles.barTrack,
                      { backgroundColor: theme.surfaceSecondary },
                    ]}
                  >
                    <View
                      style={[
                        styles.barFill,
                        {
                          height: `${Math.max(10, Math.round(day.ratio * 100))}%`,
                          backgroundColor:
                            day.amount > 0 ? theme.expense : theme.border,
                        },
                      ]}
                    />
                  </View>
                  <Text style={[styles.barDayText, { color: theme.textMuted }]}>
                    {day.dayLabel}
                  </Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* RECENT TRANSACTIONS SECTION */}
        <View style={styles.recentSection}>
          <View style={styles.recentHeaderRow}>
            <Text style={[styles.sectionHeader, { color: theme.textPrimary }]}>
              Recent Transactions
            </Text>
            {transactions.length > 0 && (
              <TouchableOpacity
                onPress={() => navigation.navigate('Transactions')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.viewAllText,
                    { color: isDark ? theme.primary : '#B45309' },
                  ]}
                >
                  View All
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {recentTransactions.length > 0 ? (
            recentTransactions.map((tx) => (
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
              icon="receipt-outline"
              title="No Transactions Found"
              description="Start tracking your budget by logging your first income or expense transaction."
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: layout.screenPadding,
    paddingTop: 10,
    paddingBottom: 10,
    borderBottomWidth: 1,
    width: '100%',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: 8,
  },
  drawerBurgerBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1,
  },
  greetingWrapper: {
    flex: 1,
  },
  greetingText: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  dateText: {
    fontSize: 10,
    marginTop: 1,
  },
  headerRightActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  avatarButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
  },
  overviewSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
    marginBottom: 6,
  },
  sectionHeader: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  quickActionsSection: {
    marginVertical: 8,
    width: '100%',
  },
  actionsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 8,
    gap: 8,
    width: '100%',
  },
  actionCard: {
    flex: 1,
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    flexShrink: 1,
  },
  actionIconBox: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  actionLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  insightsCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    marginVertical: 10,
    borderWidth: 1.2,
    width: '100%',
  },
  insightsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  iconHeadingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  insightsTitle: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  viewMoreText: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  ratioSection: {
    marginBottom: 12,
  },
  ratioLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  ratioSubLabel: {
    fontSize: 10,
    fontWeight: typography.weights.semiBold,
  },
  ratioTrack: {
    height: 7,
    borderRadius: 3.5,
    flexDirection: 'row',
    overflow: 'hidden',
    width: '100%',
  },
  ratioFillIncome: {
    height: '100%',
  },
  ratioFillExpense: {
    height: '100%',
  },
  insightPillsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
    width: '100%',
  },
  insightPill: {
    flex: 1,
    padding: 8,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
    flexShrink: 1,
  },
  pillMuted: {
    fontSize: 9,
    marginBottom: 3,
  },
  pillPrimary: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  trendContainer: {
    borderTopWidth: 1,
    paddingTop: 10,
  },
  trendTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
    marginBottom: 8,
  },
  chartBarsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: 60,
    width: '100%',
  },
  chartBarCol: {
    alignItems: 'center',
    flex: 1,
  },
  barTrack: {
    width: 12,
    height: 42,
    borderRadius: 6,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: 6,
  },
  barDayText: {
    fontSize: 9,
    marginTop: 4,
  },
  recentSection: {
    marginTop: 8,
    width: '100%',
  },
  recentHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  viewAllText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
});

export default CustomerHomeScreen;
