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
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate task keys found: ${[...new Set(duplicates)].join(', ')}`);
    }
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should contain only valid task objects', () => {
    Object.entries(tasks).forEach(([taskName, task]) => {
      try {
        taskSchema.parse(task);
      } catch (error) {
        throw new Error(`Task "${taskName}" is invalid: ${error instanceof Error ? error.message : 'validation failed'}`);
      }
    });
  });

  it('should not have duplicate items in required array', () => {
    Object.entries(tasks).forEach(([taskName, task]) => {
      const uniqueRequired = new Set(task.required);
      const duplicates = task.required.filter((item, index) => task.required.indexOf(item) !== index);
      if (duplicates.length > 0) {
        throw new Error(`Task "${taskName}" has duplicate items in required array: ${[...new Set(duplicates)].join(', ')}`);
      }
      expect(uniqueRequired.size).toBe(task.required.length);
    });
  });

  it('should not have duplicate items in optional array', () => {
    Object.entries(tasks).forEach(([taskName, task]) => {
      if (task.optional) {
        const uniqueOptional = new Set(task.optional);
        const duplicates = task.optional.filter((item, index) => task.optional!.indexOf(item) !== index);
        if (duplicates.length > 0) {
          throw new Error(`Task "${taskName}" has duplicate items in optional array: ${[...new Set(duplicates)].join(', ')}`);
        }
        expect(uniqueOptional.size).toBe(task.optional.length);
      }
    });
  });

  it('should not have duplicate tasks in relatedTasks array', () => {
    Object.entries(tasks).forEach(([taskName, task]) => {
      if (task.relatedTasks) {
        const uniqueRelatedTasks = new Set(task.relatedTasks);
        const duplicates = task.relatedTasks.filter((relatedTask, index) => task.relatedTasks!.indexOf(relatedTask) !== index);
        if (duplicates.length > 0) {
          throw new Error(`Task "${taskName}" has duplicate items in relatedTasks array: ${[...new Set(duplicates)].join(', ')}`);
        }
        expect(uniqueRelatedTasks.size).toBe(task.relatedTasks.length);
      }
    });
  });

  it('should only include items defined in items.yaml', () => {
    const itemKeys = new Set(Object.keys(items));
    
    Object.entries(tasks).forEach(([taskName, task]) => {
      task.required.forEach((itemSlug) => {
        if (!itemKeys.has(itemSlug)) {
          throw new Error(`Task "${taskName}" requires item "${itemSlug}" that doesn't exist in items.yaml`);
        }
      });
    });
  });

  it('should only include items defined in items.yaml', () => {
    const itemKeys = new Set(Object.keys(items));
    
    Object.entries(tasks).forEach(([taskName, task]) => {
      if (task.optional) {
        task.optional.forEach((itemSlug) => {
          if (!itemKeys.has(itemSlug)) {
            throw new Error(`Task "${taskName}" has optional item "${itemSlug}" that doesn't exist in items.yaml`);
          }
        });
      }
    });
  });

  it('should only include defined tasks in relatedTasks', () => {
    const taskKeys = new Set(Object.keys(tasks));
    
    Object.entries(tasks).forEach(([taskName, task]) => {
      if (task.relatedTasks) {
        task.relatedTasks.forEach((relatedTask) => {
          if (!taskKeys.has(relatedTask)) {
            throw new Error(`Task "${taskName}" references related task "${relatedTask}" that doesn't exist in tasks.yaml`);
          }
        });
      }
    });
  });
});
