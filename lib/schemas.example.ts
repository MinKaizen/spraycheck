/**
 * Example usage of the schemas
 * This file demonstrates how to use the Zod schemas and TypeScript types
 */

import { taskSchema, itemSchema, type Task, type Item } from "./schemas";

// Example 1: Validating a task
function validateTask(data: unknown): Task {
  // This will throw an error if validation fails
  return taskSchema.parse(data);
}

// Example 2: Safe parsing with error handling
function safeValidateTask(data: unknown): Task | null {
  const result = taskSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    console.error("Validation failed:", result.error);
    return null;
  }
}

// Example 3: Validating an item
function validateItem(data: unknown): Item {
  return itemSchema.parse(data);
}

// Example 4: Using TypeScript types
const myTask: Task = {
  required: ["spray-bottle", "protective-gloves"],
  optional: ["multi-tool"],
  relatedTasks: ["equipment-check"],
};

const myItem: Item = {
  slug: "multi-tool",
  title: "Multi Tool",
  type: "equipment",
  notes: "Essential for field work",
  shops: ["bunnings", "sydney-tools"],
};

// Example 5: Partial validation (useful for updates)
function updateItem(partial: unknown) {
  const partialItemSchema = itemSchema.partial();
  return partialItemSchema.parse(partial);
}

// Example 6: Array validation
function validateItems(data: unknown) {
  const itemsArraySchema = itemSchema.array();
  return itemsArraySchema.parse(data);
}

// Example 7: Getting validation errors
try {
  itemSchema.parse({
    slug: "Invalid Slug", // This will fail
    title: "Test",
    type: "equipment",
    shops: [],
  });
} catch (error) {
  console.error("Validation error:", error);
}

export {
  validateTask,
  safeValidateTask,
  validateItem,
  updateItem,
  validateItems,
  myTask,
  myItem,
};
