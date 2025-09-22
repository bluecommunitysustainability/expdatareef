import { useState, useEffect, Dispatch, SetStateAction } from 'react';

function getStorageValue<T,>(key: string, defaultValue: T): T {
  if (typeof window !== 'undefined') {
    const saved = localStorage.getItem(key);
    if (saved) {
      try {
        // Allow parsing an empty string which JSON.parse would otherwise throw on
        return saved === '""' ? '' as T : JSON.parse(saved) as T;
      } catch (error) {
        console.error("Error parsing JSON from localStorage for key:", key, error);
        return defaultValue;
      }
    }
  }
  return defaultValue;
}

export const useLocalStorage = <T,>(key: string, initialValue: T): [T, Dispatch<SetStateAction<T>>] => {
  const [value, setValue] = useState<T>(() => {
    return getStorageValue(key, initialValue);
  });

  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error("Error setting item to localStorage for key:", key, error);
    }
  }, [key, value]);

  return [value, setValue];
};