// Add Transaction Screen for FINORA - Yellow + Black Theme
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
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTransactions } from '../context/TransactionContext';
import { validateTransaction } from '../utils/validation';
import { getTodayString } from '../utils/dateUtils';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

export const AddTransactionScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const initialType = route?.params?.initialType || 'expense';
  const initialCategory = route?.params?.initialCategory || '';

  const [type, setType] = useState(initialType);
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(
    initialCategory || (initialType === 'income' ? 'Salary' : 'Food')
  );
  const [date, setDate] = useState(getTodayString());
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const { addTransaction } = useTransactions();

  const activeCategories = type === 'income' ? INCOME_CATEGORIES : CATEGORIES;

  const handleTypeChange = (newType) => {
    setType(newType);
    if (newType === 'income') {
      setCategory('Salary');
    } else {
      setCategory('Food');
    }
  };

  const setDatePreset = (daysAgo) => {
    const d = new Date();
    d.setDate(d.getDate() - daysAgo);
    const yyyy = d.getFullYear();
    const mm = String(d.getMonth() + 1).padStart(2, '0');
    const dd = String(d.getDate()).padStart(2, '0');
    setDate(`${yyyy}-${mm}-${dd}`);
  };

  const handleSubmit = async () => {
    const validation = validateTransaction({
      title,
      amount,
      type,
      category,
      date,
    });

    if (!validation.isValid) {
      setErrors(validation.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    const result = await addTransaction({
      title,
      amount,
      type,
      category,
      date,
      description,
    });

    setLoading(false);

    if (result.success) {
      navigation.goBack();
    }
  };

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Add Transaction"
        subtitle="Log a new financial transaction"
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
          {/* Type Toggle: Expense vs Income */}
          <View
            style={[
              styles.typeSelector,
              {
                backgroundColor: theme.surface,
                borderColor: theme.border,
              },
            ]}
          >
            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'expense' && {
                  backgroundColor: theme.expense,
                },
              ]}
              onPress={() => handleTypeChange('expense')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-down-circle-outline"
                size={17}
                color={type === 'expense' ? '#FFFFFF' : theme.expense}
              />
              <Text
                style={[
                  styles.typeTabText,
                  {
                    color: type === 'expense' ? '#FFFFFF' : theme.textSecondary,
                    fontWeight:
                      type === 'expense'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'income' && {
                  backgroundColor: theme.income,
                },
              ]}
              onPress={() => handleTypeChange('income')}
              activeOpacity={0.8}
            >
              <Ionicons
                name="arrow-up-circle-outline"
                size={17}
                color={type === 'income' ? '#FFFFFF' : theme.income}
              />
              <Text
                style={[
                  styles.typeTabText,
                  {
                    color: type === 'income' ? '#FFFFFF' : theme.textSecondary,
                    fontWeight:
                      type === 'income'
                        ? typography.weights.bold
                        : typography.weights.medium,
                  },
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
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
            {/* Amount Input */}
            <CustomInput
              label="Amount (INR ₹)"
              required
              placeholder="0.00"
              value={amount}
              onChangeText={(text) => {
                setAmount(text);
                if (errors.amount) setErrors({ ...errors, amount: null });
              }}
              keyboardType="numeric"
              icon="cash-outline"
              error={errors.amount}
            />

            {/* Title Input */}
            <CustomInput
              label="Transaction Title"
              required
              placeholder="e.g. Grocery store, Consulting fee"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              icon="create-outline"
              error={errors.title}
            />

            {/* Category Picker Section */}
            <View style={styles.categoryPickerSection}>
              <View style={styles.labelRow}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>
                  Select Category
                </Text>
                <Text style={[styles.requiredAsterisk, { color: theme.expense }]}>
                  {' '}*
                </Text>
              </View>

              <View style={styles.categoryChipsGrid}>
                {activeCategories.map((cat) => {
                  const isSelected =
                    category.toLowerCase() === cat.name.toLowerCase();
                  return (
                    <TouchableOpacity
                      key={cat.id}
                      style={[
                        styles.categoryChip,
                        {
                          backgroundColor: theme.surfaceSecondary,
                          borderColor: isSelected
                            ? (isDark ? theme.primary : '#B45309')
                            : theme.border,
                        },
                        isSelected && {
                          backgroundColor: isDark
                            ? 'rgba(255, 214, 0, 0.16)'
                            : 'rgba(255, 214, 0, 0.28)',
                          borderWidth: 1.5,
                        },
                      ]}
                      onPress={() => {
                        setCategory(cat.name);
                        if (errors.category)
                          setErrors({ ...errors, category: null });
                      }}
                      activeOpacity={0.7}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={15}
                        color={
                          isSelected
                            ? (isDark ? theme.primary : '#B45309')
                            : theme.textSecondary
                        }
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected
                              ? theme.textPrimary
                              : theme.textSecondary,
                            fontWeight: isSelected
                              ? typography.weights.bold
                              : typography.weights.medium,
                          },
                        ]}
                      >
                        {cat.name}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
              {errors.category && (
                <Text style={[styles.fieldError, { color: theme.expense }]}>
                  {errors.category}
                </Text>
              )}
            </View>

            {/* Date Input with Presets */}
            <View style={styles.dateSection}>
              <CustomInput
                label="Transaction Date (YYYY-MM-DD)"
                required
                placeholder="YYYY-MM-DD"
                value={date}
                onChangeText={(text) => {
                  setDate(text);
                  if (errors.date) setErrors({ ...errors, date: null });
                }}
                icon="calendar-outline"
                error={errors.date}
              />

              <View style={styles.datePresetsRow}>
                <TouchableOpacity
                  style={[
                    styles.datePresetChip,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setDatePreset(0)}
                >
                  <Text style={[styles.presetText, { color: theme.textSecondary }]}>
                    Today
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.datePresetChip,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setDatePreset(1)}
                >
                  <Text style={[styles.presetText, { color: theme.textSecondary }]}>
                    Yesterday
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.datePresetChip,
                    {
                      backgroundColor: theme.surfaceSecondary,
                      borderColor: theme.border,
                    },
                  ]}
                  onPress={() => setDatePreset(2)}
                >
                  <Text style={[styles.presetText, { color: theme.textSecondary }]}>
                    2 Days Ago
                  </Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Notes / Description */}
            <CustomInput
              label="Notes / Description (Optional)"
              placeholder="Add relevant notes about this transaction..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              icon="document-text-outline"
            />

            {/* Submit Action */}
            <CustomButton
              title={`Save ${type === 'income' ? 'Income' : 'Expense'}`}
              onPress={handleSubmit}
              variant="primary"
              size="lg"
              loading={loading}
              style={styles.saveBtn}
            />
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
  typeSelector: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 3,
    marginBottom: 14,
    borderWidth: 1,
    gap: 6,
    width: '100%',
  },
  typeTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
    gap: 6,
  },
  typeTabText: {
    fontSize: typography.sizes.sm,
  },
  formCard: {
    borderRadius: borderRadius.lg,
    padding: 14,
    borderWidth: 1.2,
    width: '100%',
  },
  categoryPickerSection: {
    marginBottom: 14,
    width: '100%',
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 6,
  },
  fieldLabel: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  requiredAsterisk: {
    fontSize: typography.sizes.sm,
  },
  categoryChipsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    width: '100%',
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 5,
  },
  categoryChipText: {
    fontSize: 10,
  },
  fieldError: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  dateSection: {
    marginBottom: 4,
    width: '100%',
  },
  datePresetsRow: {
    flexDirection: 'row',
    gap: 6,
    marginTop: -8,
    marginBottom: 14,
  },
  datePresetChip: {
    paddingVertical: 4,
    paddingHorizontal: 9,
    borderRadius: borderRadius.sm,
    borderWidth: 1,
  },
  presetText: {
    fontSize: 10,
    fontWeight: typography.weights.medium,
  },
  saveBtn: {
    marginTop: 8,
    width: '100%',
  },
});

export default AddTransactionScreen;
