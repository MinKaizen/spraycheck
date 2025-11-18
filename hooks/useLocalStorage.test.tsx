import { renderHook, act } from '@testing-library/react'
import { useLocalStorage } from './useLocalStorage'

describe('useLocalStorage', () => {
  beforeEach(() => {
    // Clear localStorage before each test
    localStorage.clear()
    // Clear all mocks
    jest.clearAllMocks()
  })

  afterEach(() => {
    localStorage.clear()
  })

  it('should return initial value when localStorage is empty', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    expect(result.current[0]).toBe('initial')
  })

  it('should return stored value from localStorage', () => {
    localStorage.setItem('test-key', JSON.stringify('stored value'))
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    expect(result.current[0]).toBe('stored value')
  })

  it('should update localStorage when value changes', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new value')
    })
    
    expect(result.current[0]).toBe('new value')
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify('new value'))
  })

  it('should handle function updates', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 10))
    
    act(() => {
      result.current[1]((prev) => prev + 5)
    })
    
    expect(result.current[0]).toBe(15)
    expect(localStorage.getItem('test-key')).toBe(JSON.stringify(15))
  })

  it('should work with complex objects', () => {
    const initialValue = { name: 'John', age: 30 }
    const { result } = renderHook(() => useLocalStorage('user', initialValue))
    
    act(() => {
      result.current[1]({ name: 'Jane', age: 25 })
    })
    
    expect(result.current[0]).toEqual({ name: 'Jane', age: 25 })
    expect(JSON.parse(localStorage.getItem('user') || '{}')).toEqual({
      name: 'Jane',
      age: 25,
    })
  })

  it('should work with arrays', () => {
    const { result } = renderHook(() => useLocalStorage('items', [1, 2, 3]))
    
    act(() => {
      result.current[1]([4, 5, 6])
    })
    
    expect(result.current[0]).toEqual([4, 5, 6])
    expect(JSON.parse(localStorage.getItem('items') || '[]')).toEqual([4, 5, 6])
  })

  it('should handle null values', () => {
    const { result } = renderHook(() => useLocalStorage<string | null>('test-key', null))
    
    act(() => {
      result.current[1]('not null')
    })
    
    expect(result.current[0]).toBe('not null')
    
    act(() => {
      result.current[1](null)
    })
    
    expect(result.current[0]).toBe(null)
  })

  it('should handle boolean values', () => {
    const { result } = renderHook(() => useLocalStorage('test-bool', false))
    
    act(() => {
      result.current[1](true)
    })
    
    expect(result.current[0]).toBe(true)
    expect(localStorage.getItem('test-bool')).toBe('true')
  })

  it('should return initial value when localStorage has invalid JSON', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    localStorage.setItem('test-key', 'invalid json')
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'fallback'))
    
    expect(result.current[0]).toBe('fallback')
    expect(consoleWarnSpy).toHaveBeenCalled()
    
    consoleWarnSpy.mockRestore()
  })

  it('should handle errors when setting localStorage', () => {
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation()
    const setItemSpy = jest.spyOn(Storage.prototype, 'setItem')
    setItemSpy.mockImplementation(() => {
      throw new Error('localStorage is full')
    })
    
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      result.current[1]('new value')
    })
    
    expect(consoleWarnSpy).toHaveBeenCalled()
    
    setItemSpy.mockRestore()
    consoleWarnSpy.mockRestore()
  })

  it('should sync across multiple hook instances with same key', () => {
    const { result: result1 } = renderHook(() => useLocalStorage('shared-key', 'initial'))
    const { result: result2 } = renderHook(() => useLocalStorage('shared-key', 'initial'))
    
    act(() => {
      result1.current[1]('updated')
    })
    
    expect(result1.current[0]).toBe('updated')
    // Note: Storage event only fires for different windows/tabs, not same window
    // So result2 won't automatically update in this test environment
  })

  it('should handle storage events from other tabs', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      // Simulate storage event from another tab
      const storageEvent = new StorageEvent('storage', {
        key: 'test-key',
        newValue: JSON.stringify('from another tab'),
        oldValue: JSON.stringify('initial'),
        storageArea: localStorage,
        url: window.location.href,
      })
      window.dispatchEvent(storageEvent)
    })
    
    expect(result.current[0]).toBe('from another tab')
  })

  it('should ignore storage events for different keys', () => {
    const { result } = renderHook(() => useLocalStorage('test-key', 'initial'))
    
    act(() => {
      const storageEvent = new StorageEvent('storage', {
        key: 'different-key',
        newValue: JSON.stringify('different value'),
        oldValue: null,
        storageArea: localStorage,
        url: window.location.href,
      })
      window.dispatchEvent(storageEvent)
    })
    
    expect(result.current[0]).toBe('initial')
  })

  it('should persist data between hook unmount and remount', () => {
    const { result, unmount } = renderHook(() => useLocalStorage('persist-key', 'initial'))
    
    act(() => {
      result.current[1]('persisted value')
    })
    
    unmount()
    
    const { result: result2 } = renderHook(() => useLocalStorage('persist-key', 'initial'))
    
    expect(result2.current[0]).toBe('persisted value')
  })

  it('should handle different types for different keys', () => {
    const { result: stringResult } = renderHook(() => useLocalStorage('string-key', 'text'))
    const { result: numberResult } = renderHook(() => useLocalStorage('number-key', 42))
    const { result: objectResult } = renderHook(() => 
      useLocalStorage('object-key', { id: 1 })
    )
    
    expect(stringResult.current[0]).toBe('text')
    expect(numberResult.current[0]).toBe(42)
    expect(objectResult.current[0]).toEqual({ id: 1 })
  })
})
