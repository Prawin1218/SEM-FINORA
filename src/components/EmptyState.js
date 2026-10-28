// Empty State Component for FINORA - Yellow + Black Theme
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';
import CustomButton from './CustomButton';

export const EmptyState = ({
  icon = 'wallet-outline',
  title = 'No Records Found',
  description = 'There are no transactions recorded for this period yet.',
  actionLabel,
  onAction,
  style,
}) => {
  const { theme } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: theme.surface,
          borderColor: theme.border,
        },
        style,
      ]}
    >
      <View
        style={[
          styles.iconCircle,
          {
            backgroundColor: theme.primaryMuted,
            borderColor: theme.primaryBorder,
          },
        ]}
      >
        <Ionicons name={icon} size={32} color={theme.primary} />
      </View>

      <Text style={[styles.title, { color: theme.textPrimary }]}>{title}</Text>
      <Text style={[styles.description, { color: theme.textSecondary }]}>
        {description}
      </Text>

      {actionLabel && onAction ? (
        <CustomButton
          title={actionLabel}
          onPress={onAction}
          variant="primary"
          size="sm"
          style={styles.actionBtn}
        />
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    borderRadius: borderRadius.md,
    borderWidth: 1,
    marginVertical: 10,
    width: '100%',
  },
  iconCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1.2,
  },
  title: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
    marginBottom: 6,
    textAlign: 'center',
  },
  description: {
    fontSize: typography.sizes.sm,
    textAlign: 'center',
    lineHeight: 18,
    marginBottom: 12,
  },
  actionBtn: {
    marginTop: 4,
  },
});

export default EmptyState;
