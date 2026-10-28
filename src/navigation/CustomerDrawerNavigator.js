// Customer Drawer Navigator for FINORA - Yellow + Black Theme
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
  useWindowDimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  createDrawerNavigator,
} from '@react-navigation/drawer';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import CustomerTabNavigator from './CustomerTabNavigator';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import { useAuth } from '../context/AuthContext';

const Drawer = createDrawerNavigator();

const CustomCustomerDrawerContent = (props) => {
  const { navigation, state } = props;
  const { user, logout } = useAuth();
  const { theme, isDark, toggleTheme } = useTheme();

  const activeRoute = state?.routeNames[state.index];

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

  const navItems = [
    { name: 'CustomerTabs', label: 'Dashboard Home', icon: 'home-outline' },
    { name: 'DrawerAnalysis', label: 'Financial Analysis', icon: 'analytics-outline' },
    { name: 'DrawerTransactions', label: 'Transactions Ledger', icon: 'receipt-outline' },
    { name: 'DrawerCategories', label: 'Expense Categories', icon: 'grid-outline' },
    { name: 'DrawerProfile', label: 'Customer Profile', icon: 'person-outline' },
  ];

  return (
    <SafeAreaView
      style={[styles.drawerSafe, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      {/* Brand Header */}
      <View
        style={[
          styles.drawerHeader,
          {
            backgroundColor: theme.background,
            borderBottomColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.brandBadge,
            {
              backgroundColor: theme.primary,
            },
          ]}
        >
          <Ionicons name="wallet" size={18} color={theme.primaryText} />
        </View>
        <View style={styles.brandTitleWrapper}>
          <Text style={[styles.brandTitle, { color: theme.textPrimary }]}>
            FINORA
          </Text>
          <Text style={[styles.brandTagline, { color: isDark ? theme.primary : '#B45309' }]}>
            Your Money. Your Future.
          </Text>
        </View>

        {/* Quick theme toggle in drawer header */}
        <TouchableOpacity
          onPress={toggleTheme}
          style={[
            styles.headerThemeBtn,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.border,
            },
          ]}
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
        >
          <Ionicons
            name={isDark ? 'sunny-outline' : 'moon-outline'}
            size={16}
            color={theme.primary}
          />
        </TouchableOpacity>
      </View>

      {/* Customer User Profile Card */}
      <View
        style={[
          styles.userCard,
          {
            backgroundColor: theme.surface,
            borderColor: theme.border,
          },
        ]}
      >
        <View
          style={[
            styles.userAvatar,
            {
              backgroundColor: theme.surfaceSecondary,
              borderColor: theme.primary,
            },
          ]}
        >
          <Text style={styles.avatarEmoji}>{user?.avatar || '👤'}</Text>
        </View>
        <View style={styles.userInfo}>
          <Text
            style={[styles.userName, { color: theme.textPrimary }]}
            numberOfLines={1}
          >
            {user?.name || 'Customer'}
          </Text>
          <Text
            style={[styles.userEmail, { color: theme.textSecondary }]}
            numberOfLines={1}
          >
            {user?.email}
          </Text>
          <View
            style={[
              styles.roleChip,
              { backgroundColor: theme.primaryMuted },
            ]}
          >
            <Text
              style={[
                styles.roleChipText,
                { color: isDark ? theme.primary : '#B45309' },
              ]}
            >
              CUSTOMER ACCOUNT
            </Text>
          </View>
        </View>
      </View>

      {/* Drawer Menu Items */}
      <ScrollView
        contentContainerStyle={styles.menuContainer}
        showsVerticalScrollIndicator={false}
      >
        {navItems.map((item) => {
          const isActive = activeRoute === item.name;
          return (
            <TouchableOpacity
              key={item.name}
              style={[
                styles.menuItem,
                isActive && {
                  backgroundColor: isDark
                    ? 'rgba(255, 214, 0, 0.12)'
                    : 'rgba(255, 214, 0, 0.25)',
                  borderColor: theme.primary,
                  borderWidth: 1,
                },
              ]}
              onPress={() => navigation.navigate(item.name)}
              activeOpacity={0.7}
            >
              <Ionicons
                name={item.icon}
                size={19}
                color={
                  isActive
                    ? (isDark ? theme.primary : '#B45309')
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.menuItemText,
                  {
                    color: isActive
                      ? theme.textPrimary
                      : theme.textSecondary,
                    fontWeight: isActive
                      ? typography.weights.bold
                      : typography.weights.medium,
                  },
                ]}
              >
                {item.label}
              </Text>
              {isActive && (
                <View
                  style={[
                    styles.activeDot,
                    { backgroundColor: theme.primary },
                  ]}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Logout Action at Bottom */}
      <View
        style={[
          styles.bottomSection,
          { borderTopColor: theme.border },
        ]}
      >
        <TouchableOpacity
          style={[
            styles.logoutButton,
            {
              backgroundColor: theme.expenseBg,
              borderColor: theme.expense,
            },
          ]}
          onPress={handleLogout}
          activeOpacity={0.7}
        >
          <Ionicons name="log-out-outline" size={19} color={theme.expense} />
          <Text style={[styles.logoutText, { color: theme.expense }]}>
            Sign Out
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

export const CustomerDrawerNavigator = () => {
  const { theme } = useTheme();
  const { width } = useWindowDimensions();

  const drawerWidth = Math.min(290, width * 0.82);

  return (
    <Drawer.Navigator
      drawerContent={(props) => <CustomCustomerDrawerContent {...props} />}
      screenOptions={{
        headerShown: false,
        drawerStyle: {
          width: drawerWidth,
          backgroundColor: theme.background,
          borderRightWidth: 1,
          borderRightColor: theme.border,
        },
        drawerType: 'front',
        overlayColor: 'rgba(0, 0, 0, 0.7)',
      }}
    >
      <Drawer.Screen name="CustomerTabs" component={CustomerTabNavigator} />
      <Drawer.Screen name="DrawerAnalysis" component={AnalysisScreen} />
      <Drawer.Screen name="DrawerTransactions" component={TransactionsScreen} />
      <Drawer.Screen name="DrawerCategories" component={CategoriesScreen} />
      <Drawer.Screen name="DrawerProfile" component={ProfileScreen} />
    </Drawer.Navigator>
  );
};

const styles = StyleSheet.create({
  drawerSafe: {
    flex: 1,
  },
  drawerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
  },
  brandBadge: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  brandTitleWrapper: {
    flex: 1,
  },
  brandTitle: {
    fontSize: typography.sizes.md + 1,
    fontWeight: typography.weights.extraBold,
    letterSpacing: 1,
  },
  brandTagline: {
    fontSize: 9,
    fontWeight: typography.weights.bold,
  },
  headerThemeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  userCard: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 14,
    marginVertical: 12,
    padding: 10,
    borderRadius: borderRadius.md,
    borderWidth: 1,
  },
  userAvatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
    borderWidth: 1.5,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  userEmail: {
    fontSize: typography.sizes.xs - 1,
    marginTop: 1,
  },
  roleChip: {
    paddingVertical: 2,
    paddingHorizontal: 5,
    borderRadius: borderRadius.xs,
    alignSelf: 'flex-start',
    marginTop: 3,
  },
  roleChipText: {
    fontSize: 8,
    fontWeight: typography.weights.bold,
    letterSpacing: 0.5,
  },
  menuContainer: {
    paddingHorizontal: 12,
    paddingTop: 6,
    gap: 4,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: borderRadius.md,
    gap: 10,
  },
  menuItemText: {
    flex: 1,
    fontSize: typography.sizes.sm,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
  },
  bottomSection: {
    padding: 14,
    borderTopWidth: 1,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: borderRadius.md,
    gap: 8,
    borderWidth: 1,
  },
  logoutText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});

export default CustomerDrawerNavigator;
