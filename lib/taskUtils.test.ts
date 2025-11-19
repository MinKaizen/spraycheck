import { getRelatedTasks, getConsolidatedItems } from './taskUtils';
import { TaskData, ItemData } from './types';

const mockTasks: TaskData = {
  task1: {
    required: ['item1'],
    optional: ['item2'],
    relatedTasks: ['task2']
  },
  task2: {
    required: ['item2'],
    optional: [],
    relatedTasks: ['task3']
  },
  task3: {
    required: ['item3'],
    optional: []
  }
};

const mockItems: ItemData = {
  item1: { slug: 'item1', title: 'Item 1', type: 'equipment', notes: '', shops: [] },
  item2: { slug: 'item2', title: 'Item 2', type: 'product', notes: '', shops: [] },
  item3: { slug: 'item3', title: 'Item 3', type: 'equipment', notes: '', shops: [] }
};

describe('getRelatedTasks', () => {
  it('should return related tasks that are not already selected', () => {
    const result = getRelatedTasks(['task1'], mockTasks);
    expect(result).toEqual(['task2']);
  });

  it('should not return related tasks that are already selected', () => {
    const result = getRelatedTasks(['task1', 'task2'], mockTasks);
    expect(result).toEqual(['task3']); // task2 relates to task3
  });

  it('should return empty array if no related tasks', () => {
    const result = getRelatedTasks(['task3'], mockTasks);
    expect(result).toEqual([]);
  });
});

describe('getConsolidatedItems', () => {
  it('should consolidate items correctly', () => {
    const result = getConsolidatedItems(['task1'], mockTasks, mockItems);
    expect(result).toHaveLength(2);
    
    const item1 = result.find(i => i.slug === 'item1');
    expect(item1?.isRequired).toBe(true);
    
    const item2 = result.find(i => i.slug === 'item2');
    expect(item2?.isRequired).toBe(false);
    expect(item2?.isOptional).toBe(true);
  });

  it('should mark item as required if it is required in one task but optional in another', () => {
    // task1 has item2 as optional, task2 has item2 as required
    const result = getConsolidatedItems(['task1', 'task2'], mockTasks, mockItems);
    
    const item2 = result.find(i => i.slug === 'item2');
    expect(item2?.isRequired).toBe(true);
    expect(item2?.isOptional).toBe(false);
  });

  it('should handle missing items gracefully', () => {
    const tasksWithMissingItem: TaskData = {
      t1: { required: ['missing-item'], optional: [] }
    };
    const result = getConsolidatedItems(['t1'], tasksWithMissingItem, mockItems);
    expect(result).toEqual([]);
  });

  it('should handle tasks with undefined optional array', () => {
    const tasksWithUndefinedOptional: TaskData = {
      taskWithoutOptional: {
        required: ['item1', 'item2'],
        optional: undefined as any
      }
    };
    const result = getConsolidatedItems(['taskWithoutOptional'], tasksWithUndefinedOptional, mockItems);
    
    expect(result).toHaveLength(2);
    expect(result.every(item => item.isRequired)).toBe(true);
    expect(result.every(item => !item.isOptional)).toBe(true);
  });
});
