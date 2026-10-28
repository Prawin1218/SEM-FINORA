// Main Application Root Navigator for FINORA
import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../theme/ThemeContext';
import LoadingIndicator from '../components/LoadingIndicator';

// Auth Stack Screens
import HomeScreen from '../screens/HomeScreen';
import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';

// Navigators for Roles
import CustomerDrawerNavigator from './CustomerDrawerNavigator';
import AdminDrawerNavigator from './AdminDrawerNavigator';

// Modal / Detail Stack Screens
import AddTransactionScreen from '../screens/AddTransactionScreen';
import EditTransactionScreen from '../screens/EditTransactionScreen';
import EditProfileScreen from '../screens/EditProfileScreen';
import CategoryDetailsScreen from '../screens/CategoryDetailsScreen';
import TransactionsScreen from '../screens/TransactionsScreen';
import AnalysisScreen from '../screens/AnalysisScreen';
import ProfileScreen from '../screens/ProfileScreen';
import UserOverviewScreen from '../screens/UserOverviewScreen';

const Stack = createNativeStackNavigator();

export const AppNavigator = () => {
  const { user, isLoading } = useAuth();
  const { theme } = useTheme();

  if (isLoading) {
    return <LoadingIndicator message="Initializing FINORA Secure Environment..." />;
  }

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: theme.background },
        animation: 'slide_from_right',
      }}
    >
      {!user ? (
        // Unauthenticated Stack
        <Stack.Group>
          <Stack.Screen name="Home" component={HomeScreen} />
          <Stack.Screen name="SignIn" component={SignInScreen} />
          <Stack.Screen name="SignUp" component={SignUpScreen} />
        </Stack.Group>
      ) : user.role === 'admin' ? (
        // Admin Stack
        <Stack.Group>
          <Stack.Screen name="AdminRoot" component={AdminDrawerNavigator} />
          <Stack.Screen name="UserOverview" component={UserOverviewScreen} />
          <Stack.Screen name="Analysis" component={AnalysisScreen} />
        </Stack.Group>
      ) : (
        // Customer Stack
        <Stack.Group>
          <Stack.Screen name="CustomerRoot" component={CustomerDrawerNavigator} />
          <Stack.Screen
            name="AddTransaction"
            component={AddTransactionScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="EditTransaction"
            component={EditTransactionScreen}
            options={{ animation: 'slide_from_bottom' }}
          />
          <Stack.Screen
            name="EditProfile"
            component={EditProfileScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="CategoryDetails"
            component={CategoryDetailsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Transactions"
            component={TransactionsScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Analysis"
            component={AnalysisScreen}
            options={{ animation: 'slide_from_right' }}
          />
          <Stack.Screen
            name="Profile"
            component={ProfileScreen}
            options={{ animation: 'slide_from_right' }}
          />
        </Stack.Group>
      )}
    </Stack.Navigator>
  );
};

export default AppNavigator;
