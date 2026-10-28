// Category Card Component for Two-Column Grid in FINORA - Yellow + Black Theme
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import { formatCurrency, formatPercent } from '../utils/formatters';

export const CategoryCard = ({
  category,
  totalSpending = 0,
  percentage = 0,
  transactionCount = 0,
  onPress,
  style,
}) => {
  const { theme } = useTheme();

  const catColor = category.color || theme.primary;
  const catBgColor = category.bgColor || 'rgba(255, 214, 0, 0.15)';
  const clampedProgress = Math.min(100, Math.max(0, percentage));

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          shadowColor: theme.cardShadow,
        },
        style,
      ]}
    >
      {/* Top Row: Icon + Percentage Tag */}
      <View style={styles.topRow}>
        <View style={[styles.iconContainer, { backgroundColor: catBgColor }]}>
          <Ionicons
            name={category.icon || 'folder-outline'}
            size={20}
            color={catColor}
          />
        </View>

        <View
          style={[
            styles.percentBadge,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: catColor,
            },
          ]}
        >
          <Text style={[styles.percentText, { color: catColor }]}>
            {formatPercent(percentage, 0)}
          </Text>
        </View>
      </View>

      {/* Category Name & Count */}
      <Text
        style={[styles.categoryName, { color: theme.textPrimary }]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
      <Text style={[styles.countText, { color: theme.textMuted }]}>
        {transactionCount} {transactionCount === 1 ? 'expense' : 'expenses'}
      </Text>

      {/* Total Spending */}
      <Text
        style={[styles.spendingAmount, { color: theme.textPrimary }]}
        numberOfLines={1}
        adjustsFontSizeToFit
      >
        {formatCurrency(totalSpending)}
      </Text>

      {/* Visual Progress Bar */}
      <View
        style={[
          styles.progressBarTrack,
          { backgroundColor: theme.surfaceSecondary },
        ]}
      >
        <View
          style={[
            styles.progressBarFill,
            {
              width: `${clampedProgress}%`,
              backgroundColor: catColor,
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1.2,
    width: '100%',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 2,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    width: '100%',
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  percentBadge: {
    paddingVertical: 2,
    paddingHorizontal: 6,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  percentText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
  },
  categoryName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  countText: {
    fontSize: 10,
    marginBottom: 6,
  },
  spendingAmount: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extraBold,
    marginBottom: 8,
  },
  progressBarTrack: {
    height: 4,
    borderRadius: 2,
    overflow: 'hidden',
    width: '100%',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 2,
  },
});

export default CategoryCard;
