import { loadYaml } from '../lib/loadYaml';
import { shopSchema } from '../lib/schemas';

describe('shops.yaml', () => {
  const shops = loadYaml<string[]>('data/shops.yaml');

  it('should be an array', () => {
    expect(Array.isArray(shops)).toBe(true);
  });

  it('should contain only valid shop strings', () => {
    shops.forEach((shop, index) => {
      try {
        shopSchema.parse(shop);
      } catch (error) {
        throw new Error(`Shop at index ${index} ("${shop}") is invalid: must be kebab-case`);
      }
    });
  });

  it('should not contain duplicate shops', () => {
    const uniqueShops = new Set(shops);
    const duplicates = shops.filter((shop, index) => shops.indexOf(shop) !== index);
    if (duplicates.length > 0) {
      throw new Error(`Duplicate shops found: ${[...new Set(duplicates)].join(', ')}`);
    }
    expect(uniqueShops.size).toBe(shops.length);
  });

  it('should have all shops in kebab-case format', () => {
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    shops.forEach((shop, index) => {
      if (!kebabCaseRegex.test(shop)) {
        throw new Error(`Shop at index ${index} ("${shop}") is not in kebab-case format`);
      }
    });
  });
});
