// Sign Up Screen for FINORA - Yellow + Black Theme
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
import { validateSignUp } from '../utils/validation';

export const SignUpScreen = ({ navigation }) => {
  const { theme, isDark } = useTheme();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { register, authError, setAuthError } = useAuth();

  const handleSignUp = async () => {
    setAuthError(null);
    const validation = validateSignUp({
      name,
      email,
      password,
      confirmPassword,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await register({
      name,
      email,
      password,
    });

    setLoading(false);

    if (!result.success) {
      // Handled via authError
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Create Account"
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
          <View style={styles.headerBlock}>
            <Text style={[styles.title, { color: theme.textPrimary }]}>
              Join FINORA
            </Text>
            <Text style={[styles.subtitle, { color: theme.textSecondary }]}>
              Create your personal account and track budgets effortlessly
            </Text>
          </View>

          {/* Auth Error Banner */}
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

          <View style={styles.formContainer}>
            <CustomInput
              label="Full Name"
              required
              placeholder="e.g. Alex Rivera"
              value={name}
              onChangeText={(text) => {
                setName(text);
                if (errors.name) setErrors({ ...errors, name: null });
              }}
              icon="person-outline"
              error={errors.name}
            />

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
              placeholder="Minimum 6 characters"
              value={password}
              onChangeText={(text) => {
                setPassword(text);
                if (errors.password) setErrors({ ...errors, password: null });
              }}
              secureTextEntry
              icon="lock-closed-outline"
              error={errors.password}
            />

            <CustomInput
              label="Confirm Password"
              required
              placeholder="Re-enter password"
              value={confirmPassword}
              onChangeText={(text) => {
                setConfirmPassword(text);
                if (errors.confirmPassword)
                  setErrors({ ...errors, confirmPassword: null });
              }}
              secureTextEntry
              icon="shield-checkmark-outline"
              error={errors.confirmPassword}
            />

            <CustomButton
              title="Create Customer Account"
              onPress={handleSignUp}
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.submitBtn}
            />
          </View>

          <View style={styles.footerRow}>
            <Text style={[styles.footerText, { color: theme.textSecondary }]}>
              Already registered?{' '}
            </Text>
            <TouchableOpacity
              onPress={() => navigation.navigate('SignIn')}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.linkText,
                  { color: isDark ? theme.primary : '#B45309' },
                ]}
              >
                Sign In
              </Text>
            </TouchableOpacity>
          </View>
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
  submitBtn: {
    marginTop: 8,
    width: '100%',
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

export default SignUpScreen;
