// In-App Personalized Alert Banner for FINORA - Yellow + Black Theme
import React, { useEffect, useRef } from 'react';
import {
  Animated,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export const PersonalizedAlert = ({ alert, onDismiss }) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  const slideAnim = useRef(new Animated.Value(-120)).current;
  const opacityAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (alert) {
      Animated.parallel([
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();

      // Auto dismiss after 4 seconds
      const timer = setTimeout(() => {
        handleDismiss();
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [alert]);

  const handleDismiss = () => {
    Animated.parallel([
      Animated.timing(slideAnim, {
        toValue: -120,
        duration: 250,
        useNativeDriver: true,
      }),
      Animated.timing(opacityAnim, {
        toValue: 0,
        duration: 250,
        useNativeDriver: true,
      }),
    ]).start(() => {
      if (onDismiss) onDismiss();
    });
  };

  if (!alert) return null;

  const isSuccess = alert.type === 'success';
  const isDanger = alert.type === 'danger' || alert.type === 'error';
  const accentColor = isSuccess
    ? theme.income
    : isDanger
    ? theme.expense
    : theme.primary;

  const topOffset = Math.max(insets.top + 8, Platform.OS === 'ios' ? 44 : 24);

  return (
    <Animated.View
      style={[
        styles.bannerContainer,
        {
          top: topOffset,
          backgroundColor: theme.surface,
          borderColor: accentColor,
          shadowColor: theme.cardShadow,
          transform: [{ translateY: slideAnim }],
          opacity: opacityAnim,
        },
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: isSuccess
              ? theme.incomeBg
              : isDanger
              ? theme.expenseBg
              : theme.primaryMuted,
          },
        ]}
      >
        <Ionicons
          name={
            isSuccess
              ? 'checkmark-circle-outline'
              : isDanger
              ? 'alert-circle-outline'
              : 'information-circle-outline'
          }
          size={22}
          color={accentColor}
        />
      </View>

      <View style={styles.textContainer}>
        <Text style={[styles.title, { color: accentColor }]}>
          {alert.title || 'Notification'}
        </Text>
        <Text style={[styles.message, { color: theme.textPrimary }]}>
          {alert.message}
        </Text>
      </View>

      <TouchableOpacity
        onPress={handleDismiss}
        style={styles.closeButton}
        hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
      >
        <Ionicons name="close" size={18} color={theme.textSecondary} />
      </TouchableOpacity>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  bannerContainer: {
    position: 'absolute',
    left: 14,
    right: 14,
    zIndex: 9999,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: borderRadius.md,
    borderWidth: 1.5,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
    elevation: 8,
  },
  iconCircle: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
    marginRight: 6,
  },
  title: {
    fontSize: typography.sizes.xs + 1,
    fontWeight: typography.weights.bold,
    marginBottom: 2,
  },
  message: {
    fontSize: typography.sizes.xs,
    lineHeight: 16,
  },
  closeButton: {
    padding: 4,
  },
});

export default PersonalizedAlert;
