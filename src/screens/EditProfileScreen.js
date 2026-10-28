// Edit Profile Screen for FINORA - Yellow + Black Theme
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
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useAuth } from '../context/AuthContext';
import { useTransactions } from '../context/TransactionContext';
import { validateProfile } from '../utils/validation';

const AVATAR_OPTIONS = ['👨‍💻', '👩‍💼', '👨‍🎨', '👩‍🔬', '👨‍💼', '👩‍🎓', '🚀', '⭐'];

export const EditProfileScreen = ({ navigation }) => {
  const { theme } = useTheme();
  const { user, updateProfile } = useAuth();
  const { triggerPersonalizedAlert } = useTransactions();

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [avatar, setAvatar] = useState(user?.avatar || '👤');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    const validation = validateProfile({ name, email });
    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await updateProfile({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      avatar,
    });

    setLoading(false);

    if (result.success) {
      const firstName = name.trim().split(' ')[0];
      // Display personalized alert
      triggerPersonalizedAlert(
        'Profile Updated',
        `Hi ${firstName}, your profile has been updated successfully.`,
        'success'
      );
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Edit Profile"
        subtitle="Modify your name, email and avatar"
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
          {/* Avatar Selector Section */}
          <View
            style={[
              styles.sectionCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <Text style={[styles.sectionLabel, { color: theme.textPrimary }]}>
              Choose Avatar
            </Text>
            <View style={styles.avatarGrid}>
              {AVATAR_OPTIONS.map((item, idx) => {
                const isSelected = avatar === item;
                return (
                  <TouchableOpacity
                    key={idx}
                    style={[
                      styles.avatarChoice,
                      {
                        backgroundColor: theme.surfaceSecondary,
                        borderColor: isSelected ? theme.primary : theme.border,
                      },
                      isSelected && {
                        backgroundColor: theme.primaryMuted,
                        borderWidth: 2,
                      },
                    ]}
                    onPress={() => setAvatar(item)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.avatarEmoji}>{item}</Text>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Input Form */}
          <View
            style={[
              styles.formCard,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <CustomInput
              label="Full Name"
              required
              placeholder="Enter your full name"
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
              placeholder="Enter your email"
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

            <View style={styles.buttonRow}>
              <CustomButton
                title="Cancel"
                variant="secondary"
                size="md"
                onPress={() => navigation.goBack()}
                style={styles.cancelBtn}
              />

              <CustomButton
                title="Save Changes"
                variant="primary"
                size="md"
                loading={loading}
                onPress={handleSave}
                style={styles.saveBtn}
              />
            </View>
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
  sectionCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1.2,
    width: '100%',
  },
  sectionLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
    marginBottom: 10,
  },
  avatarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
    justifyContent: 'space-between',
  },
  avatarChoice: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.2,
  },
  avatarEmoji: {
    fontSize: 20,
  },
  formCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1.2,
    width: '100%',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
    width: '100%',
  },
  cancelBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.5,
  },
});

export default EditProfileScreen;
