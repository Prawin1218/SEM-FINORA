// Hero Balance Card for FINORA - Yellow + Black Fintech Theme
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { formatCurrency } from '../utils/formatters';

export const BalanceCard = ({
  balance = 0,
  totalIncome = 0,
  totalExpense = 0,
  savingsRate = 0,
  style,
}) => {
  const { theme, isDark } = useTheme();

  return (
    <View
      style={[
        styles.cardContainer,
        {
          backgroundColor: isDark ? theme.surface : '#141414', // Sleek dark card in both themes for maximum contrast & premium fintech feel
          borderColor: isDark ? theme.border : '#222222',
          shadowColor: theme.cardShadow,
        },
        style,
      ]}
    >
      {/* Decorative yellow corner accent */}
      <View
        style={[
          styles.glowCornerTopRight,
          { backgroundColor: 'rgba(255, 214, 0, 0.12)' },
        ]}
      />
      <View style={styles.yellowStripeAccent} />

      {/* Header Row */}
      <View style={styles.topRow}>
        <View style={styles.labelContainer}>
          <View style={[styles.indicatorDot, { backgroundColor: theme.primary }]} />
          <Text style={[styles.cardSubLabel, { color: '#B3B3B3' }]}>
            TOTAL BALANCE
          </Text>
        </View>

        <View
          style={[
            styles.savingsChip,
            {
              backgroundColor: 'rgba(255, 214, 0, 0.15)',
              borderColor: 'rgba(255, 214, 0, 0.4)',
            },
          ]}
        >
          <Ionicons name="sparkles" size={11} color={theme.primary} />
          <Text style={[styles.savingsRateText, { color: theme.primary }]}>
            {savingsRate}% saved
          </Text>
        </View>
      </View>

      {/* Main Balance Display */}
      <View style={styles.balanceRow}>
        <Text
          style={styles.balanceAmount}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          {formatCurrency(balance)}
        </Text>
      </View>

      {/* Divider */}
      <View
        style={[
          styles.divider,
          { backgroundColor: 'rgba(255, 255, 255, 0.1)' },
        ]}
      />

      {/* Income & Expense Split Badges */}
      <View style={styles.metricsRow}>
        {/* Income Card */}
        <View style={styles.metricItem}>
          <View style={[styles.incomeIconBox, { backgroundColor: 'rgba(22, 163, 74, 0.2)' }]}>
            <Ionicons name="arrow-up" size={13} color={theme.income} />
          </View>
          <View style={styles.metricTextContainer}>
            <Text style={[styles.metricLabel, { color: '#A3A3A3' }]}>
              Income
            </Text>
            <Text
              style={[styles.incomeValue, { color: theme.income }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              +{formatCurrency(totalIncome)}
            </Text>
          </View>
        </View>

        {/* Vertical Separator */}
        <View
          style={[
            styles.metricSeparator,
            { backgroundColor: 'rgba(255, 255, 255, 0.12)' },
          ]}
        />

        {/* Expense Card */}
        <View style={styles.metricItem}>
          <View style={[styles.expenseIconBox, { backgroundColor: 'rgba(239, 68, 68, 0.2)' }]}>
            <Ionicons name="arrow-down" size={13} color={theme.expense} />
          </View>
          <View style={styles.metricTextContainer}>
            <Text style={[styles.metricLabel, { color: '#A3A3A3' }]}>
              Expense
            </Text>
            <Text
              style={[styles.expenseValue, { color: theme.expense }]}
              numberOfLines={1}
              adjustsFontSizeToFit
              minimumFontScale={0.75}
            >
              -{formatCurrency(totalExpense)}
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: borderRadius.lg,
    padding: 18,
    marginVertical: 10,
    borderWidth: 1.2,
    position: 'relative',
    overflow: 'hidden',
    width: '100%',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 5,
  },
  glowCornerTopRight: {
    position: 'absolute',
    top: -30,
    right: -30,
    width: 110,
    height: 110,
    borderRadius: 55,
  },
  yellowStripeAccent: {
    position: 'absolute',
    top: 0,
    left: 20,
    width: 40,
    height: 3,
    backgroundColor: '#FFD600',
    borderRadius: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
    width: '100%',
  },
  labelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  indicatorDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  cardSubLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    letterSpacing: 1,
  },
  savingsChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    gap: 4,
    borderWidth: 1,
  },
  savingsRateText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  balanceRow: {
    marginVertical: 6,
    width: '100%',
  },
  balanceAmount: {
    fontSize: 30,
    fontWeight: typography.weights.extraBold,
    color: '#FFFFFF',
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    marginVertical: 12,
    width: '100%',
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
  },
  metricItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  metricSeparator: {
    width: 1,
    height: 28,
    marginHorizontal: 8,
  },
  incomeIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  expenseIconBox: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  metricTextContainer: {
    flex: 1,
    flexShrink: 1,
  },
  metricLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  incomeValue: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  expenseValue: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
});

export default BalanceCard;
