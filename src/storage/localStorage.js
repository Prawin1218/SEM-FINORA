// Local storage service using AsyncStorage with robust in-memory fallback
import AsyncStorage from '@react-native-async-storage/async-storage';

const memoryStore = new Map();

export const StorageKeys = {
  CURRENT_USER: '@finora_current_user',
  USERS: '@finora_users',
  TRANSACTIONS: '@finora_transactions',
  SESSION: '@finora_session',
  THEME_MODE: '@finora_theme_mode',
};

export const localStorage = {
  /**
   * Save item as JSON
   */
  async setItem(key, value) {
    try {
      const stringified = JSON.stringify(value);
      memoryStore.set(key, stringified);
      await AsyncStorage.setItem(key, stringified);
      return true;
    } catch (error) {
      console.warn(`[FINORA Storage] Fallback to memory for setItem: ${key}`, error);
      return true;
    }
  },

  /**
   * Get item parsed from JSON
   */
  async getItem(key) {
    try {
      const data = await AsyncStorage.getItem(key);
      if (data !== null) {
        return JSON.parse(data);
      }
      if (memoryStore.has(key)) {
        return JSON.parse(memoryStore.get(key));
      }
      return null;
    } catch (error) {
      console.warn(`[FINORA Storage] Fallback to memory for getItem: ${key}`, error);
      if (memoryStore.has(key)) {
        return JSON.parse(memoryStore.get(key));
      }
      return null;
    }
  },

  /**
   * Remove item
   */
  async removeItem(key) {
    try {
      memoryStore.delete(key);
      await AsyncStorage.removeItem(key);
      return true;
    } catch (error) {
      console.warn(`[FINORA Storage] Fallback for removeItem: ${key}`, error);
      return true;
    }
  },

  /**
   * Clear storage
   */
  async clear() {
    try {
      memoryStore.clear();
      await AsyncStorage.clear();
      return true;
    } catch (error) {
      console.warn('[FINORA Storage] Clear error', error);
      return true;
    }
  },
};

export default localStorage;
