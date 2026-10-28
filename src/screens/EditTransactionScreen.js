// Edit Transaction Screen for FINORA
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/ThemeContext';
import { typography } from '../theme/typography';
import { borderRadius, layout } from '../theme/spacing';
import ScreenHeader from '../components/ScreenHeader';
import CustomInput from '../components/CustomInput';
import CustomButton from '../components/CustomButton';
import { useTransactions } from '../context/TransactionContext';
import { validateTransaction } from '../utils/validation';
import { CATEGORIES, INCOME_CATEGORIES } from '../data/mockData';

export const EditTransactionScreen = ({ navigation, route }) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();
  const transactionId = route?.params?.transactionId;
  const { getTransactionById, editTransaction, deleteTransaction } = useTransactions();

  const [tx, setTx] = useState(null);
  const [type, setType] = useState('expense');
  const [title, setTitle] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (transactionId) {
      const found = getTransactionById(transactionId);
      if (found) {
        setTx(found);
        setType(found.type || 'expense');
        setTitle(found.title || '');
        setAmount(String(found.amount || ''));
        setCategory(found.category || '');
        setDate(found.date || '');
        setDescription(found.description || '');
      }
    }
  }, [transactionId]);

  const activeCategories = type === 'income' ? INCOME_CATEGORIES : CATEGORIES;

  const handleUpdate = async () => {
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

    const result = await editTransaction(transactionId, {
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

  const handleDelete = () => {
    Alert.alert(
      'Delete Transaction',
      `Are you sure you want to delete "${title}"? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            await deleteTransaction(transactionId);
            navigation.goBack();
          },
        },
      ]
    );
  };

  if (!tx) {
    return (
      <SafeAreaView
        style={[styles.safeArea, { backgroundColor: theme.background }]}
        edges={['top', 'bottom', 'left', 'right']}
      >
        <ScreenHeader title="Edit Transaction" onBack={() => navigation.goBack()} />
        <View style={styles.notFoundContainer}>
          <Text style={[styles.notFoundText, { color: theme.textSecondary }]}>
            Transaction record not found.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView
      style={[styles.safeArea, { backgroundColor: theme.background }]}
      edges={['top', 'bottom', 'left', 'right']}
    >
      <ScreenHeader
        title="Edit Transaction"
        subtitle="Update transaction details"
        onBack={() => navigation.goBack()}
        rightAction={
          <TouchableOpacity
            style={[styles.trashBtn, { backgroundColor: isDark ? 'rgba(239, 68, 68, 0.15)' : '#FEE2E2' }]}
            onPress={handleDelete}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Ionicons name="trash-outline" size={19} color={theme.expense} />
          </TouchableOpacity>
        }
      />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView
          contentContainerStyle={[
            styles.scrollContent,
            { paddingBottom: Math.max(insets.bottom, 24) + 30 },
          ]}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Type Toggle */}
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
                type === 'expense' && { backgroundColor: theme.expense },
              ]}
              onPress={() => setType('expense')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.typeTabText,
                  { color: type === 'expense' ? '#FFFFFF' : theme.textSecondary },
                  type === 'expense' && styles.typeTabTextActive,
                ]}
              >
                Expense
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.typeTab,
                type === 'income' && { backgroundColor: theme.income },
              ]}
              onPress={() => setType('income')}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.typeTabText,
                  { color: type === 'income' ? '#FFFFFF' : theme.textSecondary },
                  type === 'income' && styles.typeTabTextActive,
                ]}
              >
                Income
              </Text>
            </TouchableOpacity>
          </View>

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

            <CustomInput
              label="Transaction Title"
              required
              placeholder="e.g. Electric bill, Grocery"
              value={title}
              onChangeText={(text) => {
                setTitle(text);
                if (errors.title) setErrors({ ...errors, title: null });
              }}
              icon="create-outline"
              error={errors.title}
            />

            {/* Category Chips */}
            <View style={styles.categoryPickerSection}>
              <View style={styles.labelRow}>
                <Text style={[styles.fieldLabel, { color: theme.textSecondary }]}>Category</Text>
                <Text style={[styles.requiredAsterisk, { color: theme.expense }]}> *</Text>
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
                          backgroundColor: isSelected
                            ? (isDark ? 'rgba(255, 214, 0, 0.15)' : '#FFF9D6')
                            : theme.surfaceSecondary,
                          borderColor: isSelected ? theme.primary : theme.border,
                        },
                      ]}
                      onPress={() => {
                        setCategory(cat.name);
                        if (errors.category)
                          setErrors({ ...errors, category: null });
                      }}
                    >
                      <Ionicons
                        name={cat.icon}
                        size={16}
                        color={isSelected ? theme.primary : theme.textSecondary}
                      />
                      <Text
                        style={[
                          styles.categoryChipText,
                          {
                            color: isSelected ? (isDark ? theme.primary : '#854D0E') : theme.textSecondary,
                            fontWeight: isSelected ? typography.weights.bold : typography.weights.medium,
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
                <Text style={[styles.fieldError, { color: theme.expense }]}>{errors.category}</Text>
              )}
            </View>

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

            <CustomInput
              label="Notes / Description (Optional)"
              placeholder="Notes regarding this entry..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={3}
              icon="document-text-outline"
            />

            <View style={styles.actionButtonsRow}>
              <CustomButton
                title="Delete"
                variant="danger"
                size="md"
                onPress={handleDelete}
                style={styles.deleteBtn}
              />

              <CustomButton
                title="Save Changes"
                variant="primary"
                size="md"
                loading={loading}
                onPress={handleUpdate}
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
  scrollContent: {
    paddingHorizontal: layout.screenPadding,
    paddingTop: 12,
  },
  trashBtn: {
    width: 36,
    height: 36,
    borderRadius: borderRadius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notFoundContainer: {
    padding: 30,
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: typography.sizes.md,
  },
  typeSelector: {
    flexDirection: 'row',
    borderRadius: borderRadius.md,
    padding: 4,
    marginBottom: 16,
    borderWidth: 1,
    gap: 8,
  },
  typeTab: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: borderRadius.sm,
  },
  typeTabText: {
    fontSize: typography.sizes.sm,
    fontWeight: typography.weights.medium,
  },
  typeTabTextActive: {
    fontWeight: typography.weights.bold,
  },
  formCard: {
    borderRadius: borderRadius.lg,
    padding: 16,
    borderWidth: 1,
  },
  categoryPickerSection: {
    marginBottom: 16,
  },
  labelRow: {
    flexDirection: 'row',
    marginBottom: 8,
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
    gap: 8,
  },
  categoryChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: borderRadius.full,
    borderWidth: 1,
    gap: 6,
  },
  categoryChipText: {
    fontSize: 11,
  },
  fieldError: {
    fontSize: typography.sizes.xs,
    marginTop: 4,
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 10,
  },
  deleteBtn: {
    flex: 1,
  },
  saveBtn: {
    flex: 1.5,
  },
});

export default EditTransactionScreen;

