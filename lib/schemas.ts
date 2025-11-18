import { z } from "zod";

// Custom validator for kebab-case strings
const kebabCaseRegex = /^[a-z0-9]+(-[a-z0-9]+)*$/;

// Shop schema
export const shopSchema = z.string().regex(kebabCaseRegex, {
  message: "Shop must be kebab-case (lowercase letters, numbers, and hyphens only)",
});

export type Shop = z.infer<typeof shopSchema>;

// Task schema
export const taskSchema = z.object({
  required: z.array(z.string()),
  optional: z.array(z.string()).optional(),
  relatedTasks: z.array(z.string()).optional(),
});

export type Task = z.infer<typeof taskSchema>;

// Item schema
export const itemSchema = z.object({
  slug: z.string().regex(kebabCaseRegex, {
    message: "Slug must be kebab-case (lowercase letters, numbers, and hyphens only)",
  }),
  title: z.string(),
  type: z.enum(["product", "equipment"]),
  notes: z.string().optional().default(""),
  shops: z.array(shopSchema),
});

export type Item = z.infer<typeof itemSchema>;
