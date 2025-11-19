import { loadYaml } from '../lib/loadYaml';
import { itemSchema, type Item } from '../lib/schemas';

describe('items.yaml', () => {
  const items = loadYaml<Record<string, Item>>('data/items.yaml');
  const shops = loadYaml<string[]>('data/shops.yaml');

  it('should be an object', () => {
    expect(typeof items).toBe('object');
    expect(items).not.toBeNull();
    expect(Array.isArray(items)).toBe(false);
  });

  it('should have keys that match their item slugs', () => {
    Object.entries(items).forEach(([key, item]) => {
      if (key !== item.slug) {
        throw new Error(`Item key "${key}" does not match its slug "${item.slug}"`);
      }
    });
  });

  it('should not contain duplicate item keys', () => {
    const keys = Object.keys(items);
    const uniqueKeys = new Set(keys);
    const duplicates = keys.filter((key, index) => keys.indexOf(key) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate item keys found: ${[...new Set(duplicates)].join(', ')}`);
    }
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should contain only valid item objects', () => {
    Object.entries(items).forEach(([key, item]) => {
      try {
        itemSchema.parse(item);
      } catch (error) {
        throw new Error(`Item "${key}" is invalid: ${error instanceof Error ? error.message : 'validation failed'}`);
      }
    });
  });

  it('should have all item shops exist in shops.yaml', () => {
    const shopSet = new Set(shops);
    
    Object.entries(items).forEach(([key, item]) => {
      item.shops.forEach((shop) => {
        if (!shopSet.has(shop)) {
          throw new Error(`Item "${key}" references shop "${shop}" that doesn't exist in shops.yaml`);
        }
      });
    });
  });

  it('should have all slugs in kebab-case format', () => {
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    Object.values(items).forEach((item) => {
      if (!kebabCaseRegex.test(item.slug)) {
        throw new Error(`Item slug "${item.slug}" is not in kebab-case format`);
      }
    });
  });

  it('should have valid type values', () => {
    Object.values(items).forEach((item) => {
      if (!['product', 'equipment'].includes(item.type)) {
        throw new Error(`Item "${item.slug}" has invalid type "${item.type}": must be "product" or "equipment"`);
      }
    });
  });
});
