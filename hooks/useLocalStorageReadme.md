# useLocalStorage Hook

A reusable React hook for managing data in browser's localStorage with automatic synchronization.

## Features

- TypeScript support with full type inference
- SSR-safe (works with Next.js)
- Automatic JSON serialization/deserialization
- Synchronization across tabs/windows
- Function updater support (like useState)
- Error handling with console warnings
- Comprehensive test coverage

## Usage

```tsx
import { useLocalStorage } from './hooks/useLocalStorage'

function MyComponent() {
  // Simple value
  const [name, setName] = useLocalStorage('username', 'Guest')

  // Complex object
  const [user, setUser] = useLocalStorage('user', {
    name: 'John',
    age: 30,
    preferences: { theme: 'dark' }
  })

  // Array
  const [items, setItems] = useLocalStorage('cart', [])

  return (
    <div>
      <h1>Hello, {name}!</h1>
      
      {/* Update value directly */}
      <button onClick={() => setName('Jane')}>
        Change Name
      </button>

      {/* Update using function (like useState) */}
      <button onClick={() => setUser(prev => ({ ...prev, age: prev.age + 1 }))}>
        Increment Age
      </button>

      {/* Add to array */}
      <button onClick={() => setItems(prev => [...prev, { id: Date.now() }])}>
        Add Item
      </button>
    </div>
  )
}
```

## API

```typescript
function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, Dispatch<SetStateAction<T>>]
```

### Parameters

- `key`: The localStorage key to store the value under
- `initialValue`: The initial value to use if no value exists in localStorage

### Returns

A tuple containing:
1. The current value (type `T`)
2. A setter function that accepts either a new value or an updater function

## Testing

Run the test suite:

```bash
pnpm test
```

Watch mode:

```bash
pnpm test:watch
```

All 15 tests pass, covering:
- Initial value handling
- Reading from localStorage
- Updating values
- Function updaters
- Complex objects and arrays
- Null and boolean values
- Error handling
- Cross-tab synchronization
- Data persistence
- Multiple data types
