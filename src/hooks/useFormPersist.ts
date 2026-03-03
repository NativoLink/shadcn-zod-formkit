'use client';

import { useEffect, useCallback } from "react";
import { UseFormReturn } from "react-hook-form";

interface UseFormPersistOptions {
  form: UseFormReturn<any>;
  storageKey: string;
  storage?: Storage;
  debounceMs?: number;
  exclude?: string[];
  onRestore?: (data: any) => void;
}

/**
 * Hook to persist form data to localStorage/sessionStorage
 * 
 * @example
 * ```tsx
 * const form = useForm();
 * 
 * useFormPersist({
 *   form,
 *   storageKey: 'my-form-data',
 *   debounceMs: 500,
 *   exclude: ['password'], // Don't persist sensitive fields
 * });
 * ```
 */
export function useFormPersist({
  form,
  storageKey,
  storage = typeof window !== 'undefined' ? window.localStorage : undefined,
  debounceMs = 300,
  exclude = [],
  onRestore,
}: UseFormPersistOptions) {
  // Restore data on mount
  useEffect(() => {
    if (!storage) return;

    try {
      const savedData = storage.getItem(storageKey);
      if (savedData) {
        const parsed = JSON.parse(savedData);
        
        // Filter out excluded fields
        const filteredData = Object.keys(parsed).reduce((acc, key) => {
          if (!exclude.includes(key)) {
            acc[key] = parsed[key];
          }
          return acc;
        }, {} as any);

        form.reset(filteredData);
        onRestore?.(filteredData);
      }
    } catch (error) {
      console.error('Error restoring form data:', error);
    }
  }, [storageKey, storage, form, exclude, onRestore]);

  // Save data on change
  const saveData = useCallback(() => {
    if (!storage) return;

    try {
      const values = form.getValues();
      
      // Filter out excluded fields
      const filteredValues = Object.keys(values).reduce((acc, key) => {
        if (!exclude.includes(key)) {
          acc[key] = values[key];
        }
        return acc;
      }, {} as any);

      storage.setItem(storageKey, JSON.stringify(filteredValues));
    } catch (error) {
      console.error('Error saving form data:', error);
    }
  }, [form, storageKey, storage, exclude]);

  // Watch for changes and save with debounce
  useEffect(() => {
    const subscription = form.watch(() => {
      const timeoutId = setTimeout(saveData, debounceMs);
      return () => clearTimeout(timeoutId);
    });

    return () => subscription.unsubscribe();
  }, [form, saveData, debounceMs]);

  // Clear saved data
  const clearSavedData = useCallback(() => {
    if (!storage) return;
    storage.removeItem(storageKey);
  }, [storage, storageKey]);

  return {
    clearSavedData,
  };
}
