'use client'

import { useState, useEffect, useCallback, Dispatch, SetStateAction } from 'react'

type SetValue<T> = Dispatch<SetStateAction<T>>

/**
 * Custom hook to manage data in localStorage with automatic synchronization
 * 
 * @param key - The localStorage key
 * @param initialValue - The initial value if no value exists in localStorage
 * @returns A tuple containing the stored value and a function to update it
 * 
 * @example
 * const [user, setUser] = useLocalStorage('user', { name: 'Guest' })
 * 
 * // Update the value
 * setUser({ name: 'John' })
 * 
 * // Or use a function updater
 * setUser(prev => ({ ...prev, age: 30 }))
 */
export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, SetValue<T>] {
  // State to store our value
  // Pass initial state function to useState so logic is only executed once
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') {
      return initialValue
    }

    try {
      const item = window.localStorage.getItem(key)
      return item ? JSON.parse(item) : initialValue
    } catch (error) {
      console.warn(`Error reading localStorage key "${key}":`, error)
      return initialValue
    }
  })

  // Return a wrapped version of useState's setter function that
  // persists the new value to localStorage.
  const setValue: SetValue<T> = useCallback(
    (value) => {
      try {
        // Allow value to be a function so we have same API as useState
        const valueToStore =
          value instanceof Function ? value(storedValue) : value

        // Save state
        setStoredValue(valueToStore)

        // Save to local storage
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(valueToStore))
        }
      } catch (error) {
        console.warn(`Error setting localStorage key "${key}":`, error)
      }
    },
    [key, storedValue]
  )

  // Listen for changes to localStorage from other tabs/windows
  useEffect(() => {
    if (typeof window === 'undefined') {
      return
    }

    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === key && e.newValue !== null) {
        try {
          setStoredValue(JSON.parse(e.newValue))
        } catch (error) {
          console.warn(`Error parsing storage event for key "${key}":`, error)
        }
      }
    }

    window.addEventListener('storage', handleStorageChange)
    return () => window.removeEventListener('storage', handleStorageChange)
  }, [key])

  return [storedValue, setValue]
}
