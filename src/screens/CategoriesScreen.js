// Overall Categories Screen for FINORA
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import CategoryCard from '../components/CategoryCard';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';
import { CATEGORIES } from '../data/mockData';

export const CategoriesScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { transactions } = useTransactions();

  // Calculate expense calculations for each of the 9 required categories
  const categoriesData = useMemo(() => {
    const expenseTxs = transactions.filter((tx) => tx.type === 'expense');
    const totalExpenses = expenseTxs.reduce(
      (sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0),
      0
    );

    return CATEGORIES.map((cat) => {
      const catTransactions = expenseTxs.filter(
        (tx) => tx.category?.toLowerCase() === cat.name.toLowerCase()
      );
      const totalSpending = catTransactions.reduce(
        (sum, tx) => sum + (Math.abs(Number(tx.amount)) || 0),
        0
      );
      const percentage =
        totalExpenses > 0 ? Math.round((totalSpending / totalExpenses) * 100) : 0;

      return {
        ...cat,
        totalSpending,
        percentage,
        transactionCount: catTransactions.length,
      };
    });
  }, [transactions]);

  const totalExpenseSpending = useMemo(() => {
    return categoriesData.reduce((acc, c) => acc + c.totalSpending, 0);
  }, [categoriesData]);

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'left', 'right']}
    >
      <ScreenHeader
        title="Expense Categories"
        subtitle="Spending distribution across core budget segments"
        onOpenDrawer={() => navigation.openDrawer()}
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 95 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Overall Category Expense Card */}
        <View
          style={[
            styles.summaryBanner,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={{ flex: 1, marginRight: 12 }}>
            <Text style={[styles.bannerLabel, { color: theme.textSecondary }]}>
              Total Expenses Tracked
            </Text>
            <Text
              style={[
                styles.bannerAmount,
                { color: theme.textPrimary },
              ]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCurrency(totalExpenseSpending)}
            </Text>
          </View>
          <View
            style={[
              styles.categoryCountBadge,
              {
                backgroundColor: isDark ? 'rgba(255, 214, 0, 0.12)' : '#FFF9D6',
                borderColor: isDark ? 'rgba(255, 214, 0, 0.3)' : '#FDE047',
              },
            ]}
          >
            <Text style={[styles.countNumber, { color: theme.primary }]}>
              {CATEGORIES.length}
            </Text>
            <Text style={[styles.countText, { color: theme.textSecondary }]}>Segments</Text>
          </View>
        </View>

        {/* 2-Column Grid of 9 Categories */}
        <View style={styles.gridContainer}>
          {categoriesData.map((category) => (
            <View key={category.id} style={styles.gridCol}>
              <CategoryCard
                category={category}
                totalSpending={category.totalSpending}
                percentage={category.percentage}
                transactionCount={category.transactionCount}
                onPress={() =>
                  navigation.navigate('CategoryDetails', {
                    categoryId: category.id,
                    categoryName: category.name,
                  })
                }
              />
            </View>
          ))}
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
  summaryBanner: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderRadius: borderRadius.lg,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  bannerAmount: {
    fontSize: 24,
    fontWeight: typography.weights.extraBold,
    marginTop: 4,
  },
  categoryCountBadge: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    borderWidth: 1,
  },
  countNumber: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  countText: {
    fontSize: 10,
    marginTop: 2,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridCol: {
    width: '48.5%',
    marginBottom: 12,
  },
});

export default CategoriesScreen;

