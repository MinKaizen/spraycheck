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
      expect(key).toBe(item.slug);
    });
  });

  it('should not contain duplicate item keys', () => {
    const keys = Object.keys(items);
    const uniqueKeys = new Set(keys);
    expect(uniqueKeys.size).toBe(keys.length);
  });

  it('should contain only valid item objects', () => {
    Object.values(items).forEach((item) => {
      expect(() => itemSchema.parse(item)).not.toThrow();
    });
  });

  it('should have all item shops exist in shops.yaml', () => {
    const shopSet = new Set(shops);
    
    Object.entries(items).forEach(([_key, item]) => {
      item.shops.forEach((shop) => {
        expect(shopSet.has(shop)).toBe(true);
      });
    });
  });

  it('should have all slugs in kebab-case format', () => {
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    Object.values(items).forEach((item) => {
      expect(item.slug).toMatch(kebabCaseRegex);
    });
  });

  it('should have valid type values', () => {
    Object.values(items).forEach((item) => {
      expect(['product', 'equipment']).toContain(item.type);
    });
  });
});
