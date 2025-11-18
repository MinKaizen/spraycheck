import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

/**
 * Loads and parses a YAML file
 * @param filePath - Path to the YAML file (absolute or relative to project root)
 * @returns Parsed YAML content as a JavaScript object
 * @throws Error if file doesn't exist or YAML is invalid
 */
export function loadYaml<T = any>(filePath: string): T {
  try {
    // Resolve the file path
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(process.cwd(), filePath);
    
    // Read the file
    const fileContents = fs.readFileSync(absolutePath, 'utf8');
    
    // Parse and return the YAML
    const data = yaml.load(fileContents);
    
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load YAML file at ${filePath}: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Loads and parses a YAML file asynchronously
 * @param filePath - Path to the YAML file (absolute or relative to project root)
 * @returns Promise that resolves to parsed YAML content as a JavaScript object
 * @throws Error if file doesn't exist or YAML is invalid
 */
export async function loadYamlAsync<T = any>(filePath: string): Promise<T> {
  try {
    // Resolve the file path
    const absolutePath = path.isAbsolute(filePath) 
      ? filePath 
      : path.resolve(process.cwd(), filePath);
    
    // Read the file asynchronously
    const fileContents = await fs.promises.readFile(absolutePath, 'utf8');
    
    // Parse and return the YAML
    const data = yaml.load(fileContents);
    
    return data as T;
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to load YAML file at ${filePath}: ${error.message}`);
    }
    throw error;
  }
}
