// Interactive Daily, Weekly, and Monthly Report Card for FINORA - Yellow + Black Theme
import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { formatCurrency } from '../utils/formatters';
import { calculatePeriodReport } from '../utils/reportUtils';

export const ReportCard = ({ transactions = [], style }) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState('monthly'); // 'daily' | 'weekly' | 'monthly'

  const report = useMemo(() => {
    return calculatePeriodReport(transactions, selectedPeriod);
  }, [transactions, selectedPeriod]);

  const getPeriodSubtitle = () => {
    switch (selectedPeriod) {
      case 'daily':
        return "Today's financial activity";
      case 'weekly':
        return 'Last 7 days rolling summary';
      case 'monthly':
      default:
        return 'Current month progress';
    }
  };

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
        },
        style,
      ]}
    >
      {/* Header */}
      <View style={styles.headerRow}>
        <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
          Periodic Reports
        </Text>
        <Text style={[styles.sectionSubtitle, { color: theme.textSecondary }]}>
          {getPeriodSubtitle()}
        </Text>
      </View>

      {/* Segmented Button Filter with Yellow Active Highlight */}
      <View
        style={[
          styles.segmentedContainer,
          {
            backgroundColor: theme.surfaceSecondary,
            borderColor: theme.border,
          },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedPeriod === 'daily' && {
              backgroundColor: theme.primary, // Yellow Highlight
            },
          ]}
          onPress={() => setSelectedPeriod('daily')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color:
                  selectedPeriod === 'daily'
                    ? theme.primaryText // Black on Yellow
                    : theme.textSecondary,
                fontWeight:
                  selectedPeriod === 'daily'
                    ? typography.weights.bold
                    : typography.weights.medium,
              },
            ]}
          >
            Daily
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedPeriod === 'weekly' && {
              backgroundColor: theme.primary, // Yellow Highlight
            },
          ]}
          onPress={() => setSelectedPeriod('weekly')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color:
                  selectedPeriod === 'weekly'
                    ? theme.primaryText
                    : theme.textSecondary,
                fontWeight:
                  selectedPeriod === 'weekly'
                    ? typography.weights.bold
                    : typography.weights.medium,
              },
            ]}
          >
            Weekly
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.segmentButton,
            selectedPeriod === 'monthly' && {
              backgroundColor: theme.primary, // Yellow Highlight
            },
          ]}
          onPress={() => setSelectedPeriod('monthly')}
          activeOpacity={0.8}
        >
          <Text
            style={[
              styles.segmentText,
              {
                color:
                  selectedPeriod === 'monthly'
                    ? theme.primaryText
                    : theme.textSecondary,
                fontWeight:
                  selectedPeriod === 'monthly'
                    ? typography.weights.bold
                    : typography.weights.medium,
              },
            ]}
          >
            Monthly
          </Text>
        </TouchableOpacity>
      </View>

      {/* 4-Stat Grid for Selected Period */}
      <View style={styles.gridContainer}>
        {/* Income */}
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.statIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.incomeBg }]}>
              <Ionicons name="arrow-up" size={12} color={theme.income} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Income
            </Text>
          </View>
          <Text
            style={[styles.incomeValue, { color: theme.income }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            +{formatCurrency(report.income)}
          </Text>
        </View>

        {/* Expenses */}
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.statIconRow}>
            <View style={[styles.iconCircle, { backgroundColor: theme.expenseBg }]}>
              <Ionicons name="arrow-down" size={12} color={theme.expense} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Expenses
            </Text>
          </View>
          <Text
            style={[styles.expenseValue, { color: theme.expense }]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            -{formatCurrency(report.expense)}
          </Text>
        </View>

        {/* Net Balance */}
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.statIconRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: 'rgba(255, 214, 0, 0.18)' },
              ]}
            >
              <Ionicons name="wallet-outline" size={12} color={theme.primary} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Net Balance
            </Text>
          </View>
          <Text
            style={[
              styles.balanceValue,
              {
                color:
                  report.balance >= 0 ? theme.income : theme.expense,
              },
            ]}
            numberOfLines={1}
            adjustsFontSizeToFit
          >
            {formatCurrency(report.balance)}
          </Text>
        </View>

        {/* Total Transactions Count */}
        <View
          style={[
            styles.statBox,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.statIconRow}>
            <View
              style={[
                styles.iconCircle,
                { backgroundColor: theme.warningBg },
              ]}
            >
              <Ionicons name="receipt-outline" size={12} color={theme.warning} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
              Transactions
            </Text>
          </View>
          <Text
            style={[styles.countValue, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {report.count} {report.count === 1 ? 'record' : 'records'}
          </Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    borderRadius: borderRadius.lg,
    padding: 16,
    marginVertical: 10,
    borderWidth: 1.2,
    width: '100%',
  },
  headerRow: {
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  sectionSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  segmentedContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 12,
    borderWidth: 1,
    width: '100%',
  },
  segmentButton: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: borderRadius.sm,
  },
  segmentText: {
    fontSize: typography.sizes.xs,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    width: '100%',
    rowGap: 8,
  },
  statBox: {
    width: '48.5%',
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  statIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  iconCircle: {
    width: 20,
    height: 20,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 5,
  },
  statLabel: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  incomeValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  expenseValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  balanceValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  countValue: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});

export default ReportCard;
