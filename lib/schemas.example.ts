/**
 * Example usage of the schemas
 * This file demonstrates how to use the Zod schemas and TypeScript types
 */

import { shopSchema, taskSchema, itemSchema, type Shop, type Task, type Item } from "./schemas";

// Validating a shop
function validateShop(data: unknown): Shop {
  return shopSchema.parse(data);
}

// Safe shop validation
function safeValidateShop(data: unknown): Shop | null {
  const result = shopSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    console.error("Shop validation failed:", result.error);
    return null;
  }
}

// Validating a task
function validateTask(data: unknown): Task {
  // This will throw an error if validation fails
  return taskSchema.parse(data);
}

// Safe parsing with error handling
function safeValidateTask(data: unknown): Task | null {
  const result = taskSchema.safeParse(data);
  if (result.success) {
    return result.data;
  } else {
    console.error("Validation failed:", result.error);
    return null;
  }
}

// Validating an item
function validateItem(data: unknown): Item {
  return itemSchema.parse(data);
}

// Using TypeScript types
const myShop: Shop = "bunnings";
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

// Partial validation (useful for updates)
function updateItem(partial: unknown) {
  const partialItemSchema = itemSchema.partial();
  return partialItemSchema.parse(partial);
}

// Array validation
function validateItems(data: unknown) {
  const itemsArraySchema = itemSchema.array();
  return itemsArraySchema.parse(data);
}

// Validating an array of shops
function validateShops(data: unknown) {
  const shopsArraySchema = shopSchema.array();
  return shopsArraySchema.parse(data);
}

// Example 10: Getting validation errors
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
  validateShop,
  safeValidateShop,
  validateTask,
  safeValidateTask,
  validateItem,
  updateItem,
  validateItems,
  validateShops,
  myShop,
  myTask,
  myItem,
};
