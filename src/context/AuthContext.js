// Authentication context for FINORA
import React, { createContext, useContext, useState, useEffect } from 'react';
import localStorage, { StorageKeys } from '../storage/localStorage';
import { INITIAL_USERS } from '../data/mockData';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState(INITIAL_USERS);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  // Initialize stored session and user accounts on launch
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const storedUsers = await localStorage.getItem(StorageKeys.USERS);
        if (storedUsers && Array.isArray(storedUsers) && storedUsers.length > 0) {
          setUsers(storedUsers);
        } else {
          await localStorage.setItem(StorageKeys.USERS, INITIAL_USERS);
        }

        const storedUser = await localStorage.getItem(StorageKeys.CURRENT_USER);
        if (storedUser) {
          setUser(storedUser);
        }
      } catch (err) {
        console.warn('Failed to load auth session:', err);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  /**
   * Log in user with demo credentials
   */
  const login = async (email, password, selectedRole = null) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();
    const cleanPass = (password || '').trim();

    const foundUser = users.find(
      (u) =>
        u.email.toLowerCase() === cleanEmail &&
        u.password === cleanPass &&
        (!selectedRole || u.role === selectedRole)
    );

    if (foundUser) {
      setUser(foundUser);
      await localStorage.setItem(StorageKeys.CURRENT_USER, foundUser);
      return { success: true, user: foundUser };
    }

    const errorMsg = 'Invalid email or password. Please verify your demo credentials.';
    setAuthError(errorMsg);
    return { success: false, error: errorMsg };
  };

  /**
   * Register a new customer
   */
  const register = async ({ name, email, password }) => {
    setAuthError(null);
    const cleanEmail = (email || '').trim().toLowerCase();

    // Check existing email
    const exists = users.some((u) => u.email.toLowerCase() === cleanEmail);
    if (exists) {
      const errorMsg = 'An account with this email already exists.';
      setAuthError(errorMsg);
      return { success: false, error: errorMsg };
    }

    const newUser = {
      id: `user_${Date.now()}`,
      name: name.trim(),
      email: cleanEmail,
      password: password.trim(),
      role: 'customer',
      avatar: '👤',
      phone: '+91 98000 00000',
      joinedDate: new Date().toISOString().split('T')[0],
      status: 'Active',
      totalTransactions: 0,
      accountType: 'Standard Member',
    };

    const updatedUsers = [...users, newUser];
    setUsers(updatedUsers);
    setUser(newUser);

    await localStorage.setItem(StorageKeys.USERS, updatedUsers);
    await localStorage.setItem(StorageKeys.CURRENT_USER, newUser);

    return { success: true, user: newUser };
  };

  /**
   * Update current profile details
   */
  const updateProfile = async (updatedFields) => {
    if (!user) return { success: false, error: 'No active session' };

    const updatedUser = {
      ...user,
      ...updatedFields,
    };

    const updatedUsers = users.map((u) => (u.id === user.id ? updatedUser : u));

    setUser(updatedUser);
    setUsers(updatedUsers);

    await localStorage.setItem(StorageKeys.USERS, updatedUsers);
    await localStorage.setItem(StorageKeys.CURRENT_USER, updatedUser);

    return { success: true, user: updatedUser };
  };

  /**
   * Log out active user
   */
  const logout = async () => {
    setUser(null);
    setAuthError(null);
    await localStorage.removeItem(StorageKeys.CURRENT_USER);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        users,
        isLoading,
        authError,
        setAuthError,
        login,
        register,
        updateProfile,
        logout,
        isAdmin: user?.role === 'admin',
        isCustomer: user?.role === 'customer',
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
