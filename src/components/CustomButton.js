// Custom Button Component for FINORA - Yellow + Black Theme
import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius } from '../theme/spacing';

export const CustomButton = ({
  title,
  onPress,
  variant = 'primary', // 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  size = 'md', // 'sm' | 'md' | 'lg'
  icon,
  iconPosition = 'left',
  loading = false,
  disabled = false,
  style,
  textStyle,
}) => {
  const { theme } = useTheme();

  const getContainerStyle = () => {
    const base = [styles.button, styles[`size_${size}`]];

    switch (variant) {
      case 'primary':
        base.push({
          backgroundColor: theme.primary,
          shadowColor: theme.primary,
          shadowOffset: { width: 0, height: 3 },
          shadowOpacity: 0.3,
          shadowRadius: 6,
          elevation: 3,
        });
        break;
      case 'secondary':
        base.push({
          backgroundColor: theme.surfaceSecondary,
          borderWidth: 1,
          borderColor: theme.border,
        });
        break;
      case 'outline':
        base.push({
          backgroundColor: 'transparent',
          borderWidth: 1.5,
          borderColor: theme.primary,
        });
        break;
      case 'ghost':
        base.push({
          backgroundColor: 'transparent',
        });
        break;
      case 'danger':
        base.push({
          backgroundColor: theme.expense,
        });
        break;
      default:
        base.push({
          backgroundColor: theme.primary,
        });
    }

    if (disabled || loading) {
      base.push(styles.disabled);
    }

    if (style) {
      base.push(style);
    }

    return base;
  };

  const getTextColor = () => {
    switch (variant) {
      case 'primary':
        return theme.primaryText; // Black on Yellow
      case 'secondary':
        return theme.textPrimary;
      case 'outline':
        return theme.textPrimary;
      case 'ghost':
        return theme.textPrimary;
      case 'danger':
        return '#FFFFFF';
      default:
        return theme.primaryText;
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={getContainerStyle()}
    >
      {loading ? (
        <ActivityIndicator
          size="small"
          color={getTextColor()}
        />
      ) : (
        <View style={styles.contentRow}>
          {icon && iconPosition === 'left' && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={styles.leftIcon}
            />
          )}
          <Text
            style={[
              styles.text,
              styles[`textSize_${size}`],
              { color: getTextColor() },
              textStyle,
            ]}
            numberOfLines={1}
          >
            {title}
          </Text>
          {icon && iconPosition === 'right' && (
            <Ionicons
              name={icon}
              size={size === 'sm' ? 16 : 20}
              color={getTextColor()}
              style={styles.rightIcon}
            />
          )}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 1,
  },
  // Touch-friendly responsive sizes
  size_sm: {
    minHeight: 38,
    paddingVertical: 8,
    paddingHorizontal: 14,
  },
  size_md: {
    minHeight: 48,
    paddingVertical: 12,
    paddingHorizontal: 18,
  },
  size_lg: {
    minHeight: 52,
    paddingVertical: 14,
    paddingHorizontal: 22,
  },
  textSize_sm: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.bold,
  },
  textSize_md: {
    fontSize: typography.sizes.md,
    fontWeight: typography.weights.bold,
  },
  textSize_lg: {
    fontSize: typography.sizes.lg,
    fontWeight: typography.weights.bold,
  },
  text: {
    letterSpacing: 0.3,
  },
  disabled: {
    opacity: 0.5,
  },
  leftIcon: {
    marginRight: 8,
  },
  rightIcon: {
    marginLeft: 8,
  },
});

export default CustomButton;
