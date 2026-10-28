// Customer Profile Screen for FINORA - Yellow + Black Theme
import React from 'react';
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

export const ProfileScreen = ({ navigation }) => {
  const { theme, isDark, themeMode, setThemeMode } = useTheme();
  const insets = useSafeAreaInsets();
  const { user, logout } = useAuth();
  const { transactions, totals } = useTransactions();

  const handleLogout = () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out of FINORA?',
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
      edges={['top', 'left', 'right']}
    >
      <ScreenHeader
        title="My Profile"
        subtitle="Manage settings and account preferences"
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
        {/* Profile Card Header */}
        <View
          style={[
            styles.profileCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View
            style={[
              styles.avatarContainer,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.primary,
              },
            ]}
          >
            <Text style={styles.avatarEmoji}>{user?.avatar || '👤'}</Text>
          </View>
          <Text style={[styles.userName, { color: theme.textPrimary }]}>
            {user?.name || 'Customer'}
          </Text>
          <Text style={[styles.userEmail, { color: theme.textSecondary }]}>
            {user?.email}
          </Text>

          <View style={styles.badgeRow}>
            <View
              style={[
                styles.roleBadge,
                { backgroundColor: theme.primaryMuted },
              ]}
            >
              <Ionicons
                name="shield-checkmark"
                size={11}
                color={isDark ? theme.primary : '#B45309'}
              />
              <Text
                style={[
                  styles.roleBadgeText,
                  { color: isDark ? theme.primary : '#B45309' },
                ]}
              >
                {user?.role?.toUpperCase() || 'CUSTOMER'}
              </Text>
            </View>
            <View
              style={[
                styles.tierBadge,
                {
                  backgroundColor: theme.surfaceSecondary,
                  borderColor: theme.border,
                },
              ]}
            >
              <Text style={[styles.tierText, { color: theme.textSecondary }]}>
                {user?.accountType || 'Standard Member'}
              </Text>
            </View>
          </View>

          <CustomButton
            title="Edit Profile"
            icon="create-outline"
            onPress={() => navigation.navigate('EditProfile')}
            variant="outline"
            size="sm"
            style={styles.editBtn}
          />
        </View>

        {/* THEME & APPEARANCE SWITCHER (Mandatory Requirement) */}
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
            <Ionicons name="color-palette-outline" size={17} color={theme.primary} />
            <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
              Theme & Appearance
            </Text>
          </View>
          <Text style={[styles.sectionDesc, { color: theme.textSecondary }]}>
            Switch instantly between dark and light modes
          </Text>

          {/* Interactive Segmented Theme Switch */}
          <View
            style={[
              styles.themeSwitchContainer,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.themeOptionTab,
                themeMode === 'dark' && {
                  backgroundColor: theme.primary, // Yellow Active
                },
              ]}
              onPress={() => setThemeMode('dark')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="moon"
                size={15}
                color={
                  themeMode === 'dark'
                    ? theme.primaryText
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color:
                      themeMode === 'dark'
                        ? theme.primaryText
                        : theme.textSecondary,
                    fontWeight:
                      themeMode === 'dark'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Dark Mode
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.themeOptionTab,
                themeMode === 'light' && {
                  backgroundColor: theme.primary, // Yellow Active
                },
              ]}
              onPress={() => setThemeMode('light')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="sunny"
                size={15}
                color={
                  themeMode === 'light'
                    ? theme.primaryText
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.themeOptionText,
                  {
                    color:
                      themeMode === 'light'
                        ? theme.primaryText
                        : theme.textSecondary,
                    fontWeight:
                      themeMode === 'light'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Light Mode
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Financial Portfolio Summary */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Financial Snapshot
          </Text>
          <View style={styles.statsRow}>
            <View
              style={[
                styles.statBox,
                { backgroundColor: theme.surfaceSecondary },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Recorded Balance
              </Text>
              <Text
                style={[styles.statValue, { color: theme.textPrimary }]}
                numberOfLines={1}
              >
                {formatCurrency(totals.balance)}
              </Text>
            </View>
            <View
              style={[
                styles.statBox,
                { backgroundColor: theme.surfaceSecondary },
              ]}
            >
              <Text style={[styles.statLabel, { color: theme.textSecondary }]}>
                Transactions Logged
              </Text>
              <Text style={[styles.statValue, { color: theme.textPrimary }]}>
                {transactions.length}
              </Text>
            </View>
          </View>
        </View>

        {/* Account Details Information */}
        <View
          style={[
            styles.sectionCard,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.textPrimary }]}>
            Account Details
          </Text>

          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="person-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Full Name
              </Text>
            </View>
            <Text
              style={[styles.infoValue, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {user?.name}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="mail-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Email
              </Text>
            </View>
            <Text
              style={[styles.infoValue, { color: theme.textPrimary }]}
              numberOfLines={1}
            >
              {user?.email}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="calendar-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Member Since
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              {user?.joinedDate || '2026-08-15'}
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: theme.borderLight }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="cash-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Currency
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.textPrimary }]}>
              INR (₹)
            </Text>
          </View>

          <View style={[styles.infoRow, { borderBottomColor: 'transparent' }]}>
            <View style={styles.infoLeft}>
              <Ionicons name="cloud-done-outline" size={16} color={theme.textSecondary} />
              <Text style={[styles.infoLabel, { color: theme.textSecondary }]}>
                Local Cache
              </Text>
            </View>
            <Text style={[styles.infoValue, { color: theme.income }]}>
              Persistent Synced
            </Text>
          </View>
        </View>

        {/* Sign Out Button */}
        <CustomButton
          title="Sign Out of FINORA"
          icon="log-out-outline"
          onPress={handleLogout}
          variant="danger"
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
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
  },
  profileCard: {
    alignItems: 'center',
    borderRadius: borderRadius.lg,
    padding: 18,
    marginBottom: 12,
    borderWidth: 1.2,
    width: '100%',
  },
  avatarContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
    borderWidth: 2,
  },
  avatarEmoji: {
    fontSize: 34,
  },
  userName: {
    fontSize: typography.sizes.md + 2,
    fontWeight: typography.weights.bold,
  },
  userEmail: {
    fontSize: typography.sizes.xs,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    marginBottom: 12,
  },
  roleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    gap: 4,
  },
  roleBadgeText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  tierBadge: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
  },
  tierText: {
    fontSize: 9,
    fontWeight: typography.weights.medium,
  },
  editBtn: {
    marginTop: 4,
    paddingHorizontal: 20,
  },
  sectionCard: {
    borderRadius: borderRadius.md,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
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
    fontSize: 10,
    marginTop: 2,
    marginBottom: 10,
  },
  themeSwitchContainer: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    borderWidth: 1,
    width: '100%',
  },
  themeOptionTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  themeOptionText: {
    fontSize: typography.sizes.xs,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 10,
    width: '100%',
  },
  statBox: {
    flex: 1,
    padding: 10,
    borderRadius: borderRadius.sm,
    flexShrink: 1,
  },
  statLabel: {
    fontSize: 10,
  },
  statValue: {
    fontSize: typography.sizes.sm + 1,
    fontWeight: typography.weights.bold,
    marginTop: 3,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    width: '100%',
  },
  infoLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  infoLabel: {
    fontSize: typography.sizes.xs,
  },
  infoValue: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  logoutBtn: {
    marginTop: 4,
    width: '100%',
  },
});

export default ProfileScreen;
