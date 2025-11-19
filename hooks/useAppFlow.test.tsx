import { renderHook, act } from '@testing-library/react';
import { useAppFlow } from './useAppFlow';
import { TaskData } from '@/lib/types';

// Mock useLocalStorage
jest.mock('./useLocalStorage', () => ({
  useLocalStorage: jest.fn((key, initial) => {
    const [val, setVal] = require('react').useState(initial);
    return [val, setVal];
  }),
}));

const mockTasks: TaskData = {
  task1: {
    required: ['item1'],
    optional: [],
    relatedTasks: ['task2']
  },
  task2: {
    required: ['item2'],
    optional: []
  }
};

describe('useAppFlow', () => {
  it('should start at TASKS screen', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    expect(result.current.screen).toBe('TASKS');
  });

  it('should navigate to RELATED screen if related tasks exist', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.handleTaskSelection(['task1']);
    });

    expect(result.current.screen).toBe('RELATED');
    expect(result.current.potentialRelatedTasks).toEqual(['task2']);
  });

  it('should navigate to NAME screen if no related tasks', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.handleTaskSelection(['task2']);
    });

    expect(result.current.screen).toBe('NAME');
    expect(result.current.selectedTasks).toEqual(['task2']);
  });

  it('should handle related task selection', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.handleTaskSelection(['task1']);
    });
    
    act(() => {
      result.current.handleRelatedSelection(['task2']);
    });

    expect(result.current.screen).toBe('NAME');
    expect(result.current.selectedTasks).toEqual(['task1', 'task2']);
  });

  it('should toggle item check', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.toggleItemCheck('item1');
    });
    expect(result.current.checkedItems).toContain('item1');

    act(() => {
      result.current.toggleItemCheck('item1');
    });
    expect(result.current.checkedItems).not.toContain('item1');
  });

  it('should handle name submission and navigate to checklist', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.handleTaskSelection(['task2']);
    });
    expect(result.current.screen).toBe('NAME');

    act(() => {
      result.current.handleNameSubmit('My Checklist');
    });
    expect(result.current.screen).toBe('CHECKLIST');
    expect(result.current.checklistName).toBe('My Checklist');
  });

  it('should reset state including checklist name', () => {
    const { result } = renderHook(() => useAppFlow(mockTasks));
    
    act(() => {
      result.current.handleTaskSelection(['task2']);
    });
    act(() => {
      result.current.handleNameSubmit('My Checklist');
    });
    expect(result.current.screen).toBe('CHECKLIST');
    expect(result.current.checklistName).toBe('My Checklist');

    act(() => {
      result.current.reset();
    });
    expect(result.current.screen).toBe('TASKS');
    expect(result.current.selectedTasks).toEqual([]);
    expect(result.current.checklistName).toBe('');
  });
});
