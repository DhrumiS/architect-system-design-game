import { useState, useEffect } from 'react';
import { safeLocalStorageGet, safeLocalStorageSet } from '@/lib/storage';

/**
 * Hook to sync state with localStorage
 * Similar to useState but persists to localStorage
 */
export function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // State to store our value
  const [storedValue, setStoredValue] = useState<T>(() => {
    // Only access localStorage on client side
    if (typeof window === 'undefined') {
      return initialValue;
    }
    return safeLocalStorageGet(key, initialValue);
  });

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage
  const setValue = (value: T) => {
    try {
      // Allow value to be a function so we have same API as useState
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      
      // Save state
      setStoredValue(valueToStore);
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        safeLocalStorageSet(key, valueToStore);
      }
    } catch (error) {
      console.error(`Error setting localStorage key "${key}":`, error);
    }
  };

  return [storedValue, setValue];
}

/**
 * Hook to listen for localStorage changes from other tabs/windows
 */
export function useLocalStorageListener(key: string, callback: (newValue: string | null) => void) {
  useEffect(() => {
    if (typeof window === 'undefined') {
      return;
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key) {
        callback(e.newValue);
      }
    };

    window.addEventListener('storage', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [key, callback]);
}
