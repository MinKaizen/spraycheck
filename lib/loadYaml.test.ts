import fs from 'fs';
import path from 'path';
import { loadYaml, loadYamlAsync } from './loadYaml';

// Mock fs module
jest.mock('fs', () => ({
  readFileSync: jest.fn(),
  promises: {
    readFile: jest.fn(),
  },
}));

describe('loadYaml', () => {
  const mockFilePath = '/test/config.yaml';
  const relativeFilePath = 'config.yaml';

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('loadYaml (synchronous)', () => {
    it('should load and parse a valid YAML file', () => {
      const yamlContent = `
name: Test App
version: 1.0.0
features:
  - auth
  - api
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        name: 'Test App',
        version: '1.0.0',
        features: ['auth', 'api'],
      });
      expect(fs.readFileSync).toHaveBeenCalledWith(mockFilePath, 'utf8');
    });

    it('should handle absolute file paths', () => {
      const yamlContent = 'key: value';
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      loadYaml('/absolute/path/file.yaml');

      expect(fs.readFileSync).toHaveBeenCalledWith('/absolute/path/file.yaml', 'utf8');
    });

    it('should handle relative file paths', () => {
      const yamlContent = 'key: value';
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      loadYaml(relativeFilePath);

      const expectedPath = path.resolve(process.cwd(), relativeFilePath);
      expect(fs.readFileSync).toHaveBeenCalledWith(expectedPath, 'utf8');
    });

    it('should parse YAML with nested objects', () => {
      const yamlContent = `
database:
  host: localhost
  port: 5432
  credentials:
    username: admin
    password: secret
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        database: {
          host: 'localhost',
          port: 5432,
          credentials: {
            username: 'admin',
            password: 'secret',
          },
        },
      });
    });

    it('should parse YAML with arrays', () => {
      const yamlContent = `
items:
  - id: 1
    name: Item 1
  - id: 2
    name: Item 2
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        items: [
          { id: 1, name: 'Item 1' },
          { id: 2, name: 'Item 2' },
        ],
      });
    });

    it('should support TypeScript generics for type safety', () => {
      interface Config {
        port: number;
        host: string;
      }

      const yamlContent = `
port: 3000
host: localhost
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml<Config>(mockFilePath);

      expect(result.port).toBe(3000);
      expect(result.host).toBe('localhost');
    });

    it('should throw error when file does not exist', () => {
      (fs.readFileSync as jest.Mock).mockImplementation(() => {
        throw new Error('ENOENT: no such file or directory');
      });

      expect(() => loadYaml(mockFilePath)).toThrow(
        'Failed to load YAML file at /test/config.yaml'
      );
    });

    it('should throw error when YAML is invalid', () => {
      const invalidYaml = `
invalid: yaml: content:
  - broken
    indentation
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(invalidYaml);

      expect(() => loadYaml(mockFilePath)).toThrow(
        'Failed to load YAML file at /test/config.yaml'
      );
    });

    it('should handle empty YAML files', () => {
      (fs.readFileSync as jest.Mock).mockReturnValue('');

      const result = loadYaml(mockFilePath);

      expect(result).toBeUndefined();
    });

    it('should handle YAML with comments', () => {
      const yamlContent = `
# This is a comment
name: Test App
# Another comment
version: 1.0.0
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        name: 'Test App',
        version: '1.0.0',
      });
    });

    it('should handle YAML with boolean values', () => {
      const yamlContent = `
enabled: true
disabled: false
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        enabled: true,
        disabled: false,
      });
    });

    it('should handle YAML with null values', () => {
      const yamlContent = `
value: null
anotherValue: ~
`;
      (fs.readFileSync as jest.Mock).mockReturnValue(yamlContent);

      const result = loadYaml(mockFilePath);

      expect(result).toEqual({
        value: null,
        anotherValue: null,
      });
    });
  });

  describe('loadYamlAsync (asynchronous)', () => {
    it('should load and parse a valid YAML file asynchronously', async () => {
      const yamlContent = `
name: Async Test
version: 2.0.0
`;
      (fs.promises.readFile as jest.Mock).mockResolvedValue(yamlContent);

      const result = await loadYamlAsync(mockFilePath);

      expect(result).toEqual({
        name: 'Async Test',
        version: '2.0.0',
      });
      expect(fs.promises.readFile).toHaveBeenCalledWith(mockFilePath, 'utf8');
    });

    it('should handle absolute file paths', async () => {
      const yamlContent = 'key: value';
      (fs.promises.readFile as jest.Mock).mockResolvedValue(yamlContent);

      await loadYamlAsync('/absolute/path/file.yaml');

      expect(fs.promises.readFile).toHaveBeenCalledWith('/absolute/path/file.yaml', 'utf8');
    });

    it('should handle relative file paths', async () => {
      const yamlContent = 'key: value';
      (fs.promises.readFile as jest.Mock).mockResolvedValue(yamlContent);

      await loadYamlAsync(relativeFilePath);

      const expectedPath = path.resolve(process.cwd(), relativeFilePath);
      expect(fs.promises.readFile).toHaveBeenCalledWith(expectedPath, 'utf8');
    });

    it('should parse complex YAML structures', async () => {
      const yamlContent = `
users:
  - id: 1
    name: Alice
    roles:
      - admin
      - user
  - id: 2
    name: Bob
    roles:
      - user
`;
      (fs.promises.readFile as jest.Mock).mockResolvedValue(yamlContent);

      const result = await loadYamlAsync(mockFilePath);

      expect(result).toEqual({
        users: [
          { id: 1, name: 'Alice', roles: ['admin', 'user'] },
          { id: 2, name: 'Bob', roles: ['user'] },
        ],
      });
    });

    it('should throw error when file does not exist', async () => {
      (fs.promises.readFile as jest.Mock).mockRejectedValue(
        new Error('ENOENT: no such file or directory')
      );

      await expect(loadYamlAsync(mockFilePath)).rejects.toThrow(
        'Failed to load YAML file at /test/config.yaml'
      );
    });

    it('should throw error when YAML is invalid', async () => {
      const invalidYaml = 'invalid: [yaml structure';
      (fs.promises.readFile as jest.Mock).mockResolvedValue(invalidYaml);

      await expect(loadYamlAsync(mockFilePath)).rejects.toThrow(
        'Failed to load YAML file at /test/config.yaml'
      );
    });

    it('should support TypeScript generics for type safety', async () => {
      interface User {
        id: number;
        email: string;
      }

      const yamlContent = `
id: 123
email: user@example.com
`;
      (fs.promises.readFile as jest.Mock).mockResolvedValue(yamlContent);

      const result = await loadYamlAsync<User>(mockFilePath);

      expect(result.id).toBe(123);
      expect(result.email).toBe('user@example.com');
    });

    it('should handle empty YAML files', async () => {
      (fs.promises.readFile as jest.Mock).mockResolvedValue('');

      const result = await loadYamlAsync(mockFilePath);

      expect(result).toBeUndefined();
    });
  });
});
