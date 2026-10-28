// Sign In Screen for FINORA - Yellow + Black Theme
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import ScreenHeader from '../components/ScreenHeader';
import { useAuth } from '../context/AuthContext';
import { validateSignIn } from '../utils/validation';

export const SignInScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const initialRole = route?.params?.role || 'customer';
  const [role, setRole] = useState(initialRole);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { login, authError, setAuthError } = useAuth();

  const handleSignIn = async () => {
    setAuthError(null);
    const validation = validateSignIn({ email, password });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }
    setErrors({});
    setLoading(true);

    const result = await login(email, password, role);
    setLoading(false);

    if (!result.success) {
      // Error is set in AuthContext and displayed
    }
  };

  const fillDemoAccount = (selectedRole) => {
    setRole(selectedRole);
    setErrors({});
    setAuthError(null);
    if (selectedRole === 'admin') {
      setEmail('admin@finora.com');
      setPassword('admin123');
    } else {
      setEmail('alex@finora.com');
      setPassword('alex123');
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Sign In"
        onBack={() => navigation.goBack()}
        showThemeToggle
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.keyboardContainer}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Welcome Text */}
          <View style={styles.headerBlock}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Welcome Back
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Sign in to access your portfolio and budget reports
            </Text>
          </View>

          {/* Role Toggle Selector with Yellow Active State */}
          <View
            style={[
              styles.roleSelector,
              {
                backgroundColor: theme.surfaceSecondary,
                borderColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.roleTab,
                role === 'customer' && {
                  backgroundColor: theme.primary, // Yellow
                },
              ]}
              onPress={() => {
                setRole('customer');
                setAuthError(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="person-outline"
                size={16}
                color={
                  role === 'customer'
                    ? theme.primaryText // Black on yellow
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.roleTabText,
                  {
                    color:
                      role === 'customer'
                        ? theme.primaryText
                        : theme.textSecondary,
                    fontWeight:
                      role === 'customer'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Customer
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.roleTab,
                role === 'admin' && {
                  backgroundColor: theme.primary, // Yellow
                },
              ]}
              onPress={() => {
                setRole('admin');
                setAuthError(null);
              }}
              activeOpacity={0.8}
            >
              <Ionicons
                name="shield-half-outline"
                size={16}
                color={
                  role === 'admin'
                    ? theme.primaryText
                    : theme.textSecondary
                }
              />
              <Text
                style={[
                  styles.roleTabText,
                  {
                    color:
                      role === 'admin'
                        ? theme.primaryText
                        : theme.textSecondary,
                    fontWeight:
                      role === 'admin'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Administrator
              </Text>
            </TouchableOpacity>
          </View>

          {/* Auth Error Banner if login fails */}
          {authError ? (
            <View
              style={[
                styles.errorBanner,
                {
                  backgroundColor: theme.expenseBg,
                  borderColor: theme.expense,
                },
              ]}
            >
              <Ionicons name="alert-circle" size={17} color={theme.expense} />
              <Text style={[styles.errorBannerText, { color: theme.expense }]}>
                {authError}
              </Text>
            </View>
          ) : null}

          {/* Form Fields */}
          <View style={styles.formContainer}>
            <CustomInput
              label="Email Address"
              required
              placeholder="e.g. alex@finora.com"
              value={email}
              onChangeText={(text) => {
                setEmail(text);
                if (errors.email) setErrors({ ...errors, email: null });
              }}
              keyboardType="email-address"
              autoCapitalize="none"
              icon="mail-outline"
              error={errors.email}
            />

            <CustomInput
              label="Password"
              required
              placeholder="Enter password"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <CustomButton
              title={`Sign In as ${role === 'admin' ? 'Admin' : 'Customer'}`}
              onPress={handleSignIn}
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.signInBtn}
            />
          </View>

          {/* Quick Demo Fill Helper Card */}
          <View
            style={[
              styles.demoCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <View style={styles.demoHeader}>
              <Ionicons name="bulb-outline" size={15} color={theme.primary} />
              <Text
                style={[
                  styles.demoTitle,
                  { color: isDark ? theme.primary : '#B45309' },
                ]}
              >
                Quick Demo Credentials
              </Text>
            </View>
            <Text style={[styles.demoSubtitle, { color: theme.textSecondary }]}>
              Tap below to auto-populate verified accounts:
            </Text>
            <View style={styles.demoButtonsRow}>
              <TouchableOpacity
                style={[
                  styles.demoChip,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.border,
                  },
                ]}
                onPress={() => fillDemoAccount('customer')}
                activeOpacity={0.7}
              >
                <Text style={[styles.demoChipText, { color: theme.textPrimary }]}>
                  Demo Customer (Alex)
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[
                  styles.demoChip,
                  {
                    backgroundColor: theme.surfaceSecondary,
                    borderColor: theme.primary,
                  },
                ]}
                onPress={() => fillDemoAccount('admin')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.demoChipText,
                    { color: isDark ? theme.primary : '#B45309' },
                  ]}
                >
                  Demo Admin (Sarah)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Link to Sign Up */}
          {role === 'customer' && (
            <View style={styles.footerRow}>
              <Text style={[styles.footerText, { color: theme.textSecondary }]}>
                Don't have an account yet?{' '}
              </Text>
              <TouchableOpacity
                onPress={() => navigation.navigate('SignUp')}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.linkText,
                    { color: isDark ? theme.primary : '#B45309' },
                  ]}
                >
                  Create Account
                </Text>
              </TouchableOpacity>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 8,
    paddingBottom: 36,
  },
  headerBlock: {
    marginVertical: 14,
  },
  title: {
    fontSize: typography.sizes.xl + 2,
    fontWeight: typography.weights.bold,
  },
  subtitle: {
    fontSize: typography.sizes.sm,
    marginTop: 4,
  },
  roleSelector: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 16,
    borderWidth: 1,
    width: '100%',
  },
  roleTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 9,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  roleTabText: {
    fontSize: typography.sizes.sm,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: borderRadius.md,
    padding: 10,
    marginBottom: 14,
    borderWidth: 1,
    gap: 6,
    width: '100%',
  },
  errorBannerText: {
    flex: 1,
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.medium,
  },
  formContainer: {
    marginBottom: 16,
    width: '100%',
  },
  signInBtn: {
    marginTop: 6,
    width: '100%',
  },
  demoCard: {
    borderRadius: borderRadius.md,
    padding: 12,
    borderWidth: 1,
    marginBottom: 20,
    width: '100%',
  },
  demoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginBottom: 3,
  },
  demoTitle: {
    fontSize: typography.sizes.xs,
    fontWeight: typography.weights.bold,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  demoSubtitle: {
    fontSize: 10,
    marginBottom: 10,
  },
  demoButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    width: '100%',
  },
  demoChip: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 6,
    borderRadius: borderRadius.sm,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
  demoChipText: {
    fontSize: 10,
    fontWeight: typography.weights.bold,
    textAlign: 'center',
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 4,
  },
  footerText: {
    fontSize: typography.sizes.sm,
  },
  linkText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
});

export default SignInScreen;
