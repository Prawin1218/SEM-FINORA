// Transaction Item row component for FINORA - Yellow + Black Theme
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { formatDisplayDate } from '../utils/dateUtils';
import { formatSignedCurrency } from '../utils/formatters';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

export const TransactionItem = ({
  transaction,
  onPress,
  onDelete,
  style,
}) => {
  const { theme } = useTheme();

  if (!transaction) return null;

  const isIncome = transaction.type === 'income';

  // Find matching category metadata for icon & color
  const allCats = [...CATEGORIES, ...INCOME_CATEGORIES];
  const catMeta = allCats.find(
    (c) => c.name.toLowerCase() === (transaction.category || '').toLowerCase()
  ) || {
    icon: isIncome ? 'cash-outline' : 'pricetag-outline',
    color: isIncome ? theme.income : theme.expense,
    bgColor: isIncome ? theme.incomeBg : theme.expenseBg,
  };

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      {/* Category Icon Container */}
      <View
        style={[
          styles.iconContainer,
          {
            backgroundColor: catMeta.bgColor || theme.surfaceSecondary,
          },
        ]}
      >
        <Ionicons
          name={catMeta.icon || 'card-outline'}
          size={18}
          color={catMeta.color || theme.primary}
        />
      </View>

      {/* Title & Metadata */}
      <View style={styles.detailsContainer}>
        <Text
          style={[styles.title, { color: theme.textPrimary }]}
          numberOfLines={1}
        >
          {transaction.title}
        </Text>
        <View style={styles.metaRow}>
          <Text
            style={[styles.categoryBadge, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {transaction.category || 'General'}
          </Text>
          <Text style={[styles.dotSeparator, { color: theme.textMuted }]}>•</Text>
          <Text style={[styles.dateText, { color: theme.textMuted }]}>
            {formatDisplayDate(transaction.date)}
          </Text>
        </View>
      </View>

      {/* Amount & Type Tag */}
      <View style={styles.amountContainer}>
        <Text
          style={[
            styles.amountText,
            { color: isIncome ? theme.income : theme.expense },
          ]}
          numberOfLines={1}
        >
          {formatSignedCurrency(transaction.amount, transaction.type)}
        </Text>
        <View
          style={[
            styles.typePill,
            {
              backgroundColor: isIncome ? theme.incomeBg : theme.expenseBg,
            },
          ]}
        >
          <Text
            style={[
              styles.typeText,
              { color: isIncome ? theme.income : theme.expense },
            ]}
          >
            {isIncome ? 'INCOME' : 'EXPENSE'}
          </Text>
        </View>
      </View>

      {/* Delete action button if provided */}
      {onDelete && (
        <TouchableOpacity
          onPress={onDelete}
          style={styles.deleteButton}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons name="trash-outline" size={17} color={theme.textMuted} />
        </TouchableOpacity>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    marginBottom: 8,
    borderWidth: 1,
    width: '100%',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  detailsContainer: {
    flex: 1,
    justifyContent: 'center',
    marginRight: 8,
  },
  title: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.semiBold,
    marginBottom: 3,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  dotSeparator: {
    marginHorizontal: 4,
    fontSize: typography.sizes.xs,
  },
  dateText: {
    fontSize: 10,
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  amountText: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
  },
  typePill: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: borderRadius.xs,
    marginTop: 2,
  },
  typeText: {
    fontSize: 8,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  deleteButton: {
    marginLeft: 8,
    padding: 4,
  },
});

export default TransactionItem;
