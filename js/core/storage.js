import { CONFIG } from './config.js';

class StorageService {
  getItem(key) {
    try {
      const value = localStorage.getItem(CONFIG.STORAGE_PREFIX + key);
      if (value === null) return null;
      return JSON.parse(value);
    } catch (error) {
      console.error('Storage getItem error:', error);
      return null;
    }
  }

  setItem(key, value) {
    try {
      localStorage.setItem(CONFIG.STORAGE_PREFIX + key, JSON.stringify(value));
      return { success: true };
    } catch (error) {
      console.error('Storage setItem error:', error);
      return { success: false, error: error.message };
    }
  }

  removeItem(key) {
    try {
      localStorage.removeItem(CONFIG.STORAGE_PREFIX + key);
      return { success: true };
    } catch (error) {
      console.error('Storage removeItem error:', error);
      return { success: false, error: error.message };
    }
  }

  clear() {
    try {
      const keys = Object.keys(localStorage);
      keys.forEach(key => {
        if (key.startsWith(CONFIG.STORAGE_PREFIX)) {
          localStorage.removeItem(key);
        }
      });
      return { success: true };
    } catch (error) {
      console.error('Storage clear error:', error);
      return { success: false, error: error.message };
    }
  }
}

export const storage = new StorageService();