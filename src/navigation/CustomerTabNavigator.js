// Customer Bottom Tab Navigator for FINORA - Yellow + Black Theme
import React from 'react';
import { StyleSheet, View, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import CustomerHomeScreen from '../screens/CustomerHomeScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import CategoriesScreen from '../screens/CategoriesScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Tab = createBottomTabNavigator();

export const CustomerTabNavigator = () => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const tabHeight = Platform.OS === 'android'
    ? (insets.bottom > 0 ? 64 + insets.bottom : 64)
    : (58 + insets.bottom);

  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: theme.tabBackground,
          borderTopWidth: 1,
          borderTopColor: theme.border,
          height: tabHeight,
          paddingBottom: Platform.OS === 'android'
            ? (insets.bottom > 0 ? insets.bottom + 4 : 8)
            : Math.max(insets.bottom, 6),
          paddingTop: 6,
          elevation: 10,
          shadowColor: theme.cardShadow,
          shadowOffset: { width: 0, height: -3 },
          shadowOpacity: 0.15,
          shadowRadius: 6,
        },
        tabBarActiveTintColor: isDark ? theme.primary : '#121212',
        tabBarInactiveTintColor: theme.tabInactive,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tab.Screen
        name="HomeTab"
        component={CustomerHomeScreen}
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && (isDark ? styles.activeGlowDark : styles.activeGlowLight)}>
              <Ionicons
                name={focused ? 'home' : 'home-outline'}
                size={21}
                color={focused ? (isDark ? theme.primary : '#121212') : color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AnalysisTab"
        component={AnalysisScreen}
        options={{
          tabBarLabel: 'Analysis',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && (isDark ? styles.activeGlowDark : styles.activeGlowLight)}>
              <Ionicons
                name={focused ? 'analytics' : 'analytics-outline'}
                size={21}
                color={focused ? (isDark ? theme.primary : '#121212') : color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="TransactionsTab"
        component={TransactionsScreen}
        options={{
          tabBarLabel: 'Transactions',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && (isDark ? styles.activeGlowDark : styles.activeGlowLight)}>
              <Ionicons
                name={focused ? 'receipt' : 'receipt-outline'}
                size={21}
                color={focused ? (isDark ? theme.primary : '#121212') : color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="CategoriesTab"
        component={CategoriesScreen}
        options={{
          tabBarLabel: 'Categories',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && (isDark ? styles.activeGlowDark : styles.activeGlowLight)}>
              <Ionicons
                name={focused ? 'grid' : 'grid-outline'}
                size={21}
                color={focused ? (isDark ? theme.primary : '#121212') : color}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="ProfileTab"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, focused }) => (
            <View style={focused && (isDark ? styles.activeGlowDark : styles.activeGlowLight)}>
              <Ionicons
                name={focused ? 'person' : 'person-outline'}
                size={21}
                color={focused ? (isDark ? theme.primary : '#121212') : color}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabLabel: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    marginTop: 2,
  },
  activeGlowDark: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 214, 0, 0.15)',
  },
  activeGlowLight: {
    paddingHorizontal: 12,
    paddingVertical: 2,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 214, 0, 0.28)',
  },
});

export default CustomerTabNavigator;
