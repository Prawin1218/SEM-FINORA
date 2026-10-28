// FINORA – Smart Finance & Budget Tracker
// MCA Semester III Mobile App Development Project Entry Point
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, useTheme } from './src/theme/ThemeContext';
import { AuthProvider } from './src/context/AuthContext';
import { TransactionProvider, useTransactions } from './src/context/TransactionContext';
import AppNavigator from './src/navigation/AppNavigator';
import PersonalizedAlert from './src/components/PersonalizedAlert';

// Internal wrapper to display in-app personalized notifications
const MainContent = () => {
  const { activeAlert, clearAlert } = useTransactions();
  const { theme, isDark } = useTheme();

  return (
    <View style={[styles.container, { backgroundColor: theme.background }]}>
      <StatusBar
        style={isDark ? 'light' : 'dark'}
        backgroundColor={theme.background}
      />
      <AppNavigator />
      <PersonalizedAlert alert={activeAlert} onDismiss={clearAlert} />
    </View>
  );
};

const NavigationWrapper = () => {
  const { navTheme } = useTheme();

  return (
    <NavigationContainer theme={navTheme}>
      <MainContent />
    </NavigationContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <TransactionProvider>
            <NavigationWrapper />
          </TransactionProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
