/**
 * Safe localStorage utilities with error handling
 * All functions handle cases where localStorage is unavailable or quota exceeded
 */

/**
 * Safely get an item from localStorage with JSON parsing
 * Returns defaultValue if key doesn't exist or parsing fails
 */
export function safeLocalStorageGet<T>(key: string, defaultValue: T): T {
  if (typeof window === 'undefined') {
    return defaultValue;
  }
  
  try {
    const item = window.localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error reading from localStorage (key: ${key}):`, error);
    return defaultValue;
  }
}

/**
 * Safely set an item in localStorage with JSON stringification
 * Returns true if successful, false otherwise
 */
export function safeLocalStorageSet<T>(key: string, value: T): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch (error) {
    console.error(`Error writing to localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Safely remove an item from localStorage
 * Returns true if successful, false otherwise
 */
export function safeLocalStorageRemove(key: string): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing from localStorage (key: ${key}):`, error);
    return false;
  }
}

/**
 * Safely clear all items from localStorage
 * Returns true if successful, false otherwise
 */
export function safeLocalStorageClear(): boolean {
  if (typeof window === 'undefined') {
    return false;
  }
  
  try {
    window.localStorage.clear();
    return true;
  } catch (error) {
    console.error('Error clearing localStorage:', error);
    return false;
  }
}
