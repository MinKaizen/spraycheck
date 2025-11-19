import { loadYaml } from '../lib/loadYaml';
import { shopSchema } from '../lib/schemas';

describe('shops.yaml', () => {
  const shops = loadYaml<string[]>('data/shops.yaml');

  it('should be an array', () => {
    expect(Array.isArray(shops)).toBe(true);
  });

  it('should contain only valid shop strings', () => {
    shops.forEach((shop) => {
      expect(() => shopSchema.parse(shop)).not.toThrow();
    });
  });

  it('should not contain duplicate shops', () => {
    const uniqueShops = new Set(shops);
    expect(uniqueShops.size).toBe(shops.length);
  });

  it('should have all shops in kebab-case format', () => {
    const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;
    shops.forEach((shop) => {
      expect(shop).toMatch(kebabCaseRegex);
    });
  });
});
