// Transaction context for FINORA
import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Alert } from 'react-native';
import localStorage, { StorageKeys } from '../storage/localStorage';
import { getInitialTransactions } from '../data/mockData';
import { useAuth } from './AuthContext';
import { calculateTotals, calculatePeriodReport, calculateCategoryBreakdown } from '../utils/reportUtils';

const TransactionContext = createContext();

export const TransactionProvider = ({ children }) => {
  const { user } = useAuth();
  const [allTransactions, setAllTransactions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeAlert, setActiveAlert] = useState(null);

  // Load transactions on start
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        const stored = await localStorage.getItem(StorageKeys.TRANSACTIONS);
        if (stored && Array.isArray(stored) && stored.length > 0) {
          setAllTransactions(stored);
        } else {
          const initial = getInitialTransactions();
          setAllTransactions(initial);
          await localStorage.setItem(StorageKeys.TRANSACTIONS, initial);
        }
      } catch (err) {
        console.warn('Failed to load transactions:', err);
      } finally {
        setIsLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Filter transactions for current customer (or all for admin)
  const transactions = useMemo(() => {
    if (!user) return [];
    if (user.role === 'admin') {
      return allTransactions;
    }
    // Return transactions associated with user or default sample
    return allTransactions.filter(
      (tx) => tx.userId === user.id || tx.userId === 'user_alex'
    );
  }, [allTransactions, user]);

  // Recalculate summary totals whenever transactions change
  const totals = useMemo(() => {
    return calculateTotals(transactions);
  }, [transactions]);

  // Recalculate category breakdown
  const categorySummary = useMemo(() => {
    return calculateCategoryBreakdown(transactions);
  }, [transactions]);

  /**
   * Helper to trigger personalized alert via in-app banner and Native Alert
   */
  const triggerPersonalizedAlert = (title, message, type = 'success') => {
    const alertData = {
      id: Date.now().toString(),
      title,
      message,
      type,
    };
    setActiveAlert(alertData);

    // Also trigger native Alert dialog
    Alert.alert(title, message, [{ text: 'OK', onPress: () => setActiveAlert(null) }]);
  };

  const clearAlert = () => {
    setActiveAlert(null);
  };

  /**
   * Add a new transaction
   */
  const addTransaction = async (data) => {
    const userName = user?.name ? user.name.split(' ')[0] : 'there';
    const txType = data.type || 'expense';

    const newTx = {
      id: `tx_${Date.now()}`,
      userId: user?.id || 'user_alex',
      title: data.title.trim(),
      amount: Math.abs(Number(data.amount)),
      type: txType,
      category: data.category,
      date: data.date,
      description: data.description ? data.description.trim() : '',
      createdAt: new Date().toISOString(),
    };

    const updated = [newTx, ...allTransactions];
    setAllTransactions(updated);
    await localStorage.setItem(StorageKeys.TRANSACTIONS, updated);

    // Trigger Personalized Alert
    const message = `Hi ${userName}, your ${txType} transaction has been added successfully.`;
    triggerPersonalizedAlert('Transaction Added', message, 'success');

    return { success: true, transaction: newTx };
  };

  /**
   * Edit an existing transaction
   */
  const editTransaction = async (id, updatedData) => {
    const userName = user?.name ? user.name.split(' ')[0] : 'there';

    const updated = allTransactions.map((tx) => {
      if (tx.id === id) {
        return {
          ...tx,
          title: updatedData.title.trim(),
          amount: Math.abs(Number(updatedData.amount)),
          type: updatedData.type,
          category: updatedData.category,
          date: updatedData.date,
          description: updatedData.description ? updatedData.description.trim() : '',
          updatedAt: new Date().toISOString(),
        };
      }
      return tx;
    });

    setAllTransactions(updated);
    await localStorage.setItem(StorageKeys.TRANSACTIONS, updated);

    const message = `Hi ${userName}, your transaction has been updated successfully.`;
    triggerPersonalizedAlert('Transaction Updated', message, 'success');

    return { success: true };
  };

  /**
   * Delete a transaction
   */
  const deleteTransaction = async (id) => {
    const userName = user?.name ? user.name.split(' ')[0] : 'there';

    const updated = allTransactions.filter((tx) => tx.id !== id);
    setAllTransactions(updated);
    await localStorage.setItem(StorageKeys.TRANSACTIONS, updated);

    const message = `Hi ${userName}, your transaction has been deleted successfully.`;
    triggerPersonalizedAlert('Transaction Deleted', message, 'info');

    return { success: true };
  };

  /**
   * Get single transaction by ID
   */
  const getTransactionById = (id) => {
    return allTransactions.find((tx) => tx.id === id) || null;
  };

  /**
   * Get transactions for a specific category
   */
  const getTransactionsByCategory = (categoryName) => {
    return transactions.filter(
      (tx) => tx.category && tx.category.toLowerCase() === categoryName.toLowerCase()
    );
  };

  return (
    <TransactionContext.Provider
      value={{
        transactions,
        allTransactions,
        totals,
        categorySummary,
        isLoading,
        activeAlert,
        addTransaction,
        editTransaction,
        deleteTransaction,
        getTransactionById,
        getTransactionsByCategory,
        triggerPersonalizedAlert,
        clearAlert,
      }}
    >
      {children}
    </TransactionContext.Provider>
  );
};

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (!context) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export default TransactionContext;
