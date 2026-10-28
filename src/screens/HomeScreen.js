// FINORA Welcome / Entry Screen - Yellow + Black Theme
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import CustomButton from '../components/CustomButton';

export const HomeScreen = ({ navigation }) => {
  const { theme, isDark, toggleTheme } = useTheme();

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Branding Row with Theme Toggle */}
        <View style={styles.brandRow}>
          <View style={styles.brandLeft}>
            <View
              style={[
                styles.logoBadge,
                {
                  backgroundColor: theme.primary,
                  borderColor: theme.primaryBright,
                },
              ]}
            >
              <Ionicons name="wallet" size={22} color={theme.primaryText} />
            </View>
            <View style={styles.brandTextCol}>
              <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
                FINORA
              </Text>
              <Text style={[styles.brandSubtitle, { color: theme.textSecondary }]}>
                Smart Finance & Budget Tracker
              </Text>
            </View>
          </View>

          {/* Sun / Moon Toggle */}
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
        </View>

        {/* Abstract Geometric Graphic (Yellow + Black Native Components) */}
        <View style={styles.graphicContainer}>
          <View
            style={[
              styles.outerGlowCircle,
              {
                borderColor: isDark ? 'rgba(255, 214, 0, 0.18)' : 'rgba(255, 214, 0, 0.35)',
                backgroundColor: isDark ? 'rgba(28, 28, 28, 0.6)' : 'rgba(255, 255, 255, 0.8)',
              },
            ]}
          />
          <View
            style={[
              styles.middleCircle,
              {
                borderColor: isDark ? 'rgba(255, 214, 0, 0.3)' : 'rgba(255, 214, 0, 0.5)',
              },
            ]}
          />

          {/* Floating Mock Finora Balance Card Graphic */}
          <View
            style={[
              styles.graphicCard,
              {
                backgroundColor: isDark ? '#181818' : '#FFFFFF',
                borderColor: theme.primary,
                shadowColor: isDark ? '#000000' : 'rgba(0,0,0,0.15)',
              },
            ]}
          >
            <View style={styles.graphicCardHeader}>
              <View style={[styles.chipGraphic, { backgroundColor: theme.primary }]} />
              <Ionicons name="sparkles" size={15} color={theme.primary} />
            </View>
            <Text
              style={[
                styles.graphicCardBalance,
                { color: isDark ? '#FFFFFF' : '#171717' },
              ]}
            >
              ₹1,25,850
            </Text>
            <View style={styles.graphicCardFooter}>
              <View style={[styles.miniTag, { backgroundColor: theme.incomeBg }]}>
                <Ionicons name="arrow-up" size={10} color={theme.income} />
                <Text style={[styles.miniTagText, { color: theme.income }]}>
                  +85,000
                </Text>
              </View>
              <View style={[styles.miniTag, { backgroundColor: theme.expenseBg }]}>
                <Ionicons name="arrow-down" size={10} color={theme.expense} />
                <Text style={[styles.miniTagText, { color: theme.expense }]}>
                  -25,870
                </Text>
              </View>
            </View>
          </View>

          {/* Floating Pill Badges */}
          <View
            style={[
              styles.floatingBadgeLeft,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="shield-checkmark" size={13} color={theme.primary} />
            <Text style={[styles.floatingBadgeText, { color: theme.textPrimary }]}>
              Secure Vault
            </Text>
          </View>

          <View
            style={[
              styles.floatingBadgeRight,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Ionicons name="pie-chart" size={13} color={theme.warning} />
            <Text style={[styles.floatingBadgeText, { color: theme.textPrimary }]}>
              Budget Insights
            </Text>
          </View>
        </View>

        {/* Tagline & Pitch */}
        <View style={styles.pitchContainer}>
          <Text
            style={[
              styles.tagline,
              { color: isDark ? theme.primary : '#B45309' },
            ]}
          >
            "YOUR MONEY. YOUR FUTURE."
          </Text>
          <Text style={[styles.welcomeTitle, { color: theme.textPrimary }]}>
            Master Your Budget With Complete Precision
          </Text>
          <Text style={[styles.description, { color: theme.textSecondary }]}>
            Track personal cashflow, generate periodic reports, analyze spending
            habits, and achieve financial clarity effortlessly.
          </Text>
        </View>

        {/* 3 Value Pillars */}
        <View
          style={[
            styles.featuresRow,
            {
              backgroundColor: theme.surface,
              borderColor: theme.border,
            },
          ]}
        >
          <View style={styles.featurePillar}>
            <Ionicons name="flash-outline" size={18} color={theme.primary} />
            <Text style={[styles.featureTitle, { color: theme.textSecondary }]}>
              Live Alerts
            </Text>
          </View>
          <View style={styles.featurePillar}>
            <Ionicons name="calendar-outline" size={18} color={theme.primary} />
            <Text style={[styles.featureTitle, { color: theme.textSecondary }]}>
              3-Way Reports
            </Text>
          </View>
          <View style={styles.featurePillar}>
            <Ionicons name="lock-closed-outline" size={18} color={theme.primary} />
            <Text style={[styles.featureTitle, { color: theme.textSecondary }]}>
              Role Guard
            </Text>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionSection}>
          <CustomButton
            title="Customer Sign In"
            icon="log-in-outline"
            onPress={() => navigation.navigate('SignIn', { role: 'customer' })}
            variant="primary"
            size="lg"
            style={styles.mainBtn}
          />

          <CustomButton
            title="Create Customer Account"
            icon="person-add-outline"
            onPress={() => navigation.navigate('SignUp')}
            variant="secondary"
            size="lg"
            style={styles.secondaryBtn}
          />

          {/* Admin Sign In Entry */}
          <TouchableOpacity
            style={styles.adminEntryRow}
            onPress={() => navigation.navigate('SignIn', { role: 'admin' })}
            activeOpacity={0.7}
          >
            <View
              style={[
                styles.adminIconCircle,
                { backgroundColor: theme.primaryMuted },
              ]}
            >
              <Ionicons name="shield-half-outline" size={14} color={theme.primary} />
            </View>
            <Text
              style={[
                styles.adminText,
                { color: isDark ? theme.primary : '#B45309' },
              ]}
            >
              System Administrator Portal
            </Text>
            <Ionicons
              name="chevron-forward"
              size={14}
              color={isDark ? theme.primary : '#B45309'}
            />
          </TouchableOpacity>
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
    paddingBottom: 32,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    width: '100%',
  },
  brandLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  logoBadge: {
    width: 42,
    height: 42,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTextCol: {
    flex: 1,
  },
  brandTitle: {
    fontSize: typography.sizes.xl,
    fontWeight: typography.weights.extraBold,
    letterSpacing: 1,
  },
  brandSubtitle: {
    fontSize: typography.sizes.xs,
    marginTop: 1,
  },
  themeToggleBtn: {
    width: 38,
    height: 38,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  graphicContainer: {
    height: 190,
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    marginVertical: 10,
    width: '100%',
  },
  outerGlowCircle: {
    position: 'absolute',
    width: 190,
    height: 190,
    borderRadius: 95,
    borderWidth: 1.2,
  },
  middleCircle: {
    position: 'absolute',
    width: 145,
    height: 145,
    borderRadius: 72.5,
    borderWidth: 1.2,
    borderStyle: 'dashed',
  },
  graphicCard: {
    width: 185,
    borderRadius: borderRadius.md,
    padding: 14,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.25,
    shadowRadius: 10,
    elevation: 6,
  },
  graphicCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  chipGraphic: {
    width: 24,
    height: 16,
    borderRadius: 3,
  },
  graphicCardBalance: {
    fontSize: 20,
    fontWeight: typography.weights.extraBold,
    letterSpacing: -0.5,
    marginBottom: 8,
  },
  graphicCardFooter: {
    flexDirection: 'row',
    gap: 6,
  },
  miniTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: borderRadius.xs,
    gap: 3,
  },
  miniTagText: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  floatingBadgeLeft: {
    position: 'absolute',
    left: 4,
    top: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  floatingBadgeRight: {
    position: 'absolute',
    right: 4,
    bottom: 18,
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
    paddingHorizontal: 8,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  floatingBadgeText: {
    fontSize: 10,
    fontWeight: typography.weights.semiBold,
  },
  pitchContainer: {
    alignItems: 'center',
    marginVertical: 10,
  },
  tagline: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    letterSpacing: 1.5,
    marginBottom: 6,
  },
  welcomeTitle: {
    fontSize: typography.sizes.lg + 1,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 8,
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 19,
    paddingHorizontal: 8,
  },
  featuresRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderRadius: borderRadius.md,
    paddingVertical: 10,
    paddingHorizontal: 8,
    marginVertical: 14,
    borderWidth: 1,
    width: '100%',
  },
  featurePillar: {
    alignItems: 'center',
    gap: 3,
  },
  featureTitle: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  actionSection: {
    marginTop: 4,
    gap: 10,
    width: '100%',
  },
  mainBtn: {
    width: '100%',
  },
  secondaryBtn: {
    width: '100%',
  },
  adminEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  adminIconCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adminText: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
  },
});

export default HomeScreen;
