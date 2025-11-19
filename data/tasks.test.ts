import { loadYaml } from '../lib/loadYaml';
import { taskSchema, type Task, type Item } from '../lib/schemas';

describe('tasks.yaml', () => {
  const tasks = loadYaml<Record<string, Task>>('data/tasks.yaml');
  const items = loadYaml<Record<string, Item>>('data/items.yaml');

  it('should be an object', () => {
    expect(typeof tasks).toBe('object');
    expect(tasks).not.toBeNull();
    expect(Array.isArray(tasks)).toBe(false);
  });

  it('should not contain duplicate task keys', () => {
    const keys = Object.keys(tasks);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should contain only valid task objects', () => {
    Object.values(tasks).forEach((task) => {
      expect(() => taskSchema.parse(task)).not.toThrow();
    });
  });

  it('should not have duplicates in required array within each task', () => {
    Object.entries(tasks).forEach(([_taskName, task]) => {
      const uniqueRequired = new Set(task.required);
      expect(uniqueRequired.size).toBe(task.required.length);
    });
  });

  it('should not have duplicates in optional array within each task', () => {
    Object.entries(tasks).forEach(([_taskName, task]) => {
      if (task.optional) {
        const uniqueOptional = new Set(task.optional);
        expect(uniqueOptional.size).toBe(task.optional.length);
      }
    });
  });

  it('should not have duplicates in relatedTasks array within each task', () => {
    Object.entries(tasks).forEach(([_taskName, task]) => {
      if (task.relatedTasks) {
        const uniqueRelatedTasks = new Set(task.relatedTasks);
        expect(uniqueRelatedTasks.size).toBe(task.relatedTasks.length);
      }
    });
  });

  it('should have all required items exist in items.yaml', () => {
    const itemKeys = new Set(Object.keys(items));
    
    Object.entries(tasks).forEach(([_taskName, task]) => {
      task.required.forEach((itemSlug) => {
        expect(itemKeys.has(itemSlug)).toBe(true);
      });
    });
  });

  it('should have all optional items exist in items.yaml', () => {
    const itemKeys = new Set(Object.keys(items));
    
    Object.entries(tasks).forEach(([_taskName, task]) => {
      if (task.optional) {
        task.optional.forEach((itemSlug) => {
          expect(itemKeys.has(itemSlug)).toBe(true);
        });
      }
    });
  });

  it('should have all relatedTasks exist as task keys', () => {
    const taskKeys = new Set(Object.keys(tasks));
    
    Object.entries(tasks).forEach(([_taskName, task]) => {
      if (task.relatedTasks) {
        task.relatedTasks.forEach((relatedTask) => {
          expect(taskKeys.has(relatedTask)).toBe(true);
        });
      }
    });
  });

  it('should allow same item to appear in different tasks', () => {
    // This test verifies that items like "bags" can appear in multiple tasks
    const itemCounts = new Map<string, number>();
    
    Object.values(tasks).forEach((task) => {
      [...task.required, ...(task.optional || [])].forEach((item) => {
        itemCounts.set(item, (itemCounts.get(item) || 0) + 1);
      });
    });

    // Check that at least one item appears in multiple tasks
    const itemsInMultipleTasks = Array.from(itemCounts.values()).filter(count => count > 1);
    expect(itemsInMultipleTasks.length).toBeGreaterThan(0);
  });
});
