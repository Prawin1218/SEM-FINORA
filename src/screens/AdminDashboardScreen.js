// Admin Dashboard Screen for FINORA
import React, { useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { formatCurrency } from '../utils/formatters';
import { calculateTotals, calculateCategoryBreakdown } from '../utils/reportUtils';
import { ADMIN_SYSTEM_ACTIVITIES } from '../data/mockData';

export const AdminDashboardScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, users, logout } = useAuth();
  const { allTransactions } = useTransactions();

  const adminTotals = useMemo(
    () => calculateTotals(allTransactions),
    [allTransactions]
  );

  const categoryBreakdown = useMemo(
    () => calculateCategoryBreakdown(allTransactions),
    [allTransactions]
  );

  const handleLogout = () => {
    Alert.alert(
      'Sign Out Admin',
      'Are you sure you want to end your administrator session?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await logout();
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Admin Control Center"
        subtitle="Application-wide management and demo telemetry"
        onOpenDrawer={() => navigation.openDrawer()}
        showThemeToggle={true}
        rightAction={
          <TouchableOpacity
            style={[
              styles.headerLogoutBtn,
              {
                backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2',
                borderColor: isDark ? 'rgba(239, 68, 68, 0.3)' : '#FCA5A5',
              },
            ]}
            onPress={handleLogout}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="log-out-outline" size={18} color={theme.expense} />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: Math.max(insets.bottom, 24) + 30 },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Admin Badge Banner */}
        <View
          style={[
            styles.bannerCard,
            {
              backgroundColor: theme.surface,
              borderColor: isDark ? 'rgba(255, 214, 0, 0.3)' : '#FDE047',
            },
          ]}
        >
          <View
            style={[
              styles.bannerIconBadge,
              {
                backgroundColor: isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6',
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={24} color={theme.primary} />
          </View>
          <View style={styles.bannerTextContainer}>
            <Text style={[styles.bannerTitle, { color: theme.textPrimary }]}>
              Administrator Console
            </Text>
            <Text style={[styles.bannerSubtitle, { color: theme.textSecondary }]}>
              Logged in as {user?.name} ({user?.email})
            </Text>
          </View>
        </View>

        {/* 4 Application-Wide Demo Statistics */}
        <View style={styles.statsGrid}>
          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={[styles.statIconCircle, { backgroundColor: isDark ? 'rgba(56, 189, 248, 0.15)' : '#E0F2FE' }]}>
              <Ionicons name="people-outline" size={18} color="#0284C7" />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Demo Users</Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{users.length}</Text>
            <Text style={[styles.statFooter, { color: theme.textSecondary }]}>Registered accounts</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6' },
              ]}
            >
              <Ionicons name="receipt-outline" size={18} color={theme.primary} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Total Transactions</Text>
            <Text style={[styles.statValue, { color: theme.textPrimary }]}>{allTransactions.length}</Text>
            <Text style={[styles.statFooter, { color: theme.textSecondary }]}>Aggregated in cache</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: isDark ? 'rgba(22, 163, 74, 0.15)' : '#DCFCE7' },
              ]}
            >
              <Ionicons name="arrow-up-circle-outline" size={18} color={theme.income} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recorded Income</Text>
            <Text
              style={[styles.statValue, { color: theme.income }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCurrency(adminTotals.totalIncome)}
            </Text>
            <Text style={[styles.statFooter, { color: theme.textSecondary }]}>Total inflows</Text>
          </View>

          <View
            style={[
              styles.statCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View
              style={[
                styles.statIconCircle,
                { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' },
              ]}
            >
              <Ionicons name="arrow-down-circle-outline" size={18} color={theme.expense} />
            </View>
            <Text style={[styles.statLabel, { color: theme.textSecondary }]}>Recorded Expenses</Text>
            <Text
              style={[styles.statValue, { color: theme.expense }]}
              numberOfLines={1}
              adjustsFontSizeToFit
            >
              {formatCurrency(adminTotals.totalExpense)}
            </Text>
            <Text style={[styles.statFooter, { color: theme.textSecondary }]}>Total outflows</Text>
          </View>
        </View>

        {/* Quick Navigation Shortcuts */}
        <View style={styles.shortcutsRow}>
          <TouchableOpacity
            style={[
              styles.shortcutBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate('UserOverview')}
            activeOpacity={0.7}
          >
            <Ionicons name="people" size={18} color={theme.primary} />
            <Text style={[styles.shortcutText, { color: theme.textPrimary }]}>Manage Users</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.shortcutBtn,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
            onPress={() => navigation.navigate('Analysis')}
            activeOpacity={0.7}
          >
            <Ionicons name="stats-chart" size={18} color={theme.primary} />
            <Text style={[styles.shortcutText, { color: theme.textPrimary }]}>Full Analytics</Text>
          </TouchableOpacity>
        </View>

        {/* Category Distribution across all transactions */}
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
            <Ionicons name="pie-chart-outline" size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Application Category Distribution
            </Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Aggregated expenditure across all demo transactions
          </Text>

          <View style={styles.categoryList}>
            {categoryBreakdown.breakdown.slice(0, 5).map((item, index) => (
              <View key={index} style={styles.catRow}>
                <View style={styles.catHeader}>
                  <Text style={[styles.catName, { color: theme.textPrimary }]}>{item.name}</Text>
                  <Text style={[styles.catAmount, { color: theme.textSecondary }]}>
                    {formatCurrency(item.total)} ({item.percentage}%)
                  </Text>
                </View>
                <View
                  style={[
                    styles.progressTrack,
                    { backgroundColor: theme.surfaceSecondary },
                  ]}
                >
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${item.percentage}%`,
                        backgroundColor: theme.primary,
                      },
                    ]}
                  />
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Recent Demo Activity Feed */}
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
            <Ionicons name="pulse-outline" size={18} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Recent Demo System Activity
            </Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Automated health signals and administrative logs
          </Text>

          <View style={styles.activitiesList}>
            {ADMIN_SYSTEM_ACTIVITIES.map((act) => (
              <View key={act.id} style={styles.activityItem}>
                <View
                  style={[
                    styles.activityIconCircle,
                    {
                      backgroundColor: isDark
                        ? 'rgba(255, 214, 0, 0.12)'
                        : '#FFF9D6',
                    },
                  ]}
                >
                  <Ionicons name={act.icon} size={16} color={theme.primary} />
                </View>
                <View style={styles.activityDetails}>
                  <Text style={[styles.activityAction, { color: theme.textPrimary }]}>
                    {act.action}
                  </Text>
                  <Text style={[styles.activityDesc, { color: theme.textSecondary }]}>
                    {act.detail}
                  </Text>
                </View>
                <Text style={[styles.activityTime, { color: theme.textSecondary }]}>
                  {act.time}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* Log Out Button */}
        <CustomButton
          title="Sign Out of Administrator Account"
          icon="log-out-outline"
          onPress={handleLogout}
          variant="secondary"
          size="md"
          style={styles.logoutBtn}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  headerLogoutBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
  },
  bannerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
    borderRadius: borderRadius.md,
    borderWidth: 1.2,
    marginBottom: 16,
    gap: 12,
  },
  bannerIconBadge: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  bannerSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  statCard: {
    width: '48.5%',
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1,
    marginBottom: 10,
  },
  statIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  statLabel: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  statValue: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.extraBold,
    marginTop: 2,
    marginBottom: 2,
  },
  statFooter: {
    fontSize: 10,
  },
  shortcutsRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
  shortcutBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    gap: 8,
  },
  shortcutText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.semiBold,
  },
  sectionCard: {
    borderRadius: borderRadius.lg,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sectionTitle: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  sectionDesc: {
    fontSize: typography.sizes.xs,
    marginTop: 3,
    marginBottom: 14,
  },
  categoryList: {
    gap: 10,
  },
  catRow: {
    marginBottom: 6,
  },
  catHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  catName: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  catAmount: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  progressTrack: {
    height: 6,
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: 3,
  },
  activitiesList: {
    gap: 12,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
  },
  activityIconCircle: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  activityDetails: {
    flex: 1,
  },
  activityAction: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
  },
  activityDesc: {
    fontSize: 10,
    marginTop: 1,
  },
  activityTime: {
    fontSize: 10,
  },
  logoutBtn: {
    marginTop: 6,
  },
});

export default AdminDashboardScreen;
