import { shopSchema, taskSchema, itemSchema, type Shop, type Task, type Item } from "./schemas";

describe("shopSchema", () => {
  it("should validate kebab-case shop names", () => {
    const validShops = [
      "bunnings",
      "sydney-tools",
      "a",
      "123",
      "shop-1",
      "my-shop-2000",
      "abc-def-ghi-123",
    ];

    validShops.forEach((shop) => {
      expect(() => shopSchema.parse(shop)).not.toThrow();
    });
  });

  it("should fail with invalid shop names", () => {
    const invalidShops = [
      "Bunnings", // uppercase
      "Sydney-Tools", // mixed case
      "sydney_tools", // underscore
      "sydney tools", // space
      "sydney--tools", // double hyphen
      "-sydney-tools", // starts with hyphen
      "sydney-tools-", // ends with hyphen
      "sydney.tools", // dot
      "", // empty
      "BUNNINGS", // all uppercase
    ];

    invalidShops.forEach((shop) => {
      expect(() => shopSchema.parse(shop)).toThrow();
    });
  });

  it("should return the validated shop string", () => {
    const shop = "bunnings";
    const result = shopSchema.parse(shop);
    expect(result).toBe("bunnings");
  });
});

describe("taskSchema", () => {
  it("should validate a task with only required fields", () => {
    const validTask = {
      required: ["item1", "item2"],
    };

    const result = taskSchema.parse(validTask);
    expect(result).toEqual(validTask);
  });

  it("should validate a task with all fields", () => {
    const validTask = {
      required: ["item1", "item2"],
      optional: ["item3"],
      relatedTasks: ["task1", "task2"],
    };

    const result = taskSchema.parse(validTask);
    expect(result).toEqual(validTask);
  });

  it("should validate a task with empty arrays", () => {
    const validTask = {
      required: [],
      optional: [],
      relatedTasks: [],
    };

    const result = taskSchema.parse(validTask);
    expect(result).toEqual(validTask);
  });

  it("should fail when required field is missing", () => {
    const invalidTask = {
      optional: ["item3"],
    };

    expect(() => taskSchema.parse(invalidTask)).toThrow();
  });

  it("should fail when required is not an array", () => {
    const invalidTask = {
      required: "not-an-array",
    };

    expect(() => taskSchema.parse(invalidTask)).toThrow();
  });

  it("should fail when array contains non-string values", () => {
    const invalidTask = {
      required: ["item1", 123, "item2"],
    };

    expect(() => taskSchema.parse(invalidTask)).toThrow();
  });
});

describe("itemSchema", () => {
  it("should validate a complete item", () => {
    const validItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment" as const,
      notes: "Some notes",
      shops: ["bunnings", "sydney-tools"],
    };

    const result = itemSchema.parse(validItem);
    expect(result).toEqual(validItem);
  });

  it("should validate an item without notes", () => {
    const validItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment" as const,
      shops: ["bunnings", "sydney-tools"],
    };

    const result = itemSchema.parse(validItem);
    expect(result).toEqual({
      ...validItem,
      notes: "",
    });
  });

  it("should validate an item with empty notes", () => {
    const validItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "product" as const,
      notes: "",
      shops: ["bunnings"],
    };

    const result = itemSchema.parse(validItem);
    expect(result).toEqual(validItem);
  });

  it("should validate item with type 'product'", () => {
    const validItem = {
      slug: "spray-bottle",
      title: "Spray Bottle",
      type: "product" as const,
      shops: ["bunnings"],
    };

    const result = itemSchema.parse(validItem);
    expect(result.type).toBe("product");
  });

  it("should validate kebab-case slugs", () => {
    const validSlugs = [
      "multi-tool",
      "a",
      "123",
      "item-1",
      "multi-tool-2000",
      "abc-def-ghi-123",
    ];

    validSlugs.forEach((slug) => {
      const item = {
        slug,
        title: "Test",
        type: "product" as const,
        shops: ["shop"],
      };
      expect(() => itemSchema.parse(item)).not.toThrow();
    });
  });

  it("should fail with invalid kebab-case slugs", () => {
    const invalidSlugs = [
      "Multi-Tool", // uppercase
      "multi_tool", // underscore
      "multi tool", // space
      "multi--tool", // double hyphen
      "-multi-tool", // starts with hyphen
      "multi-tool-", // ends with hyphen
      "Multi", // uppercase
      "multi-Tool", // mixed case
      "multi.tool", // dot
      "",
    ];

    invalidSlugs.forEach((slug) => {
      const item = {
        slug,
        title: "Test",
        type: "product" as const,
        shops: ["shop"],
      };
      expect(() => itemSchema.parse(item)).toThrow();
    });
  });

  it("should fail when slug is missing", () => {
    const invalidItem = {
      title: "Multi Tool",
      type: "equipment",
      shops: ["bunnings"],
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should fail when title is missing", () => {
    const invalidItem = {
      slug: "multi-tool",
      type: "equipment",
      shops: ["bunnings"],
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should fail when type is invalid", () => {
    const invalidItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "invalid-type",
      shops: ["bunnings"],
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should fail when shops is missing", () => {
    const invalidItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment",
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should fail when shops is not an array", () => {
    const invalidItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment",
      shops: "bunnings",
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should validate empty shops array", () => {
    const validItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment" as const,
      shops: [],
    };

    const result = itemSchema.parse(validItem);
    expect(result.shops).toEqual([]);
  });

  it("should fail when shop names are not kebab-case", () => {
    const invalidItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment" as const,
      shops: ["Bunnings", "sydney-tools"], // First shop has uppercase
    };

    expect(() => itemSchema.parse(invalidItem)).toThrow();
  });

  it("should validate when all shop names are kebab-case", () => {
    const validItem = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment" as const,
      shops: ["bunnings", "sydney-tools", "mitre-10"],
    };

    const result = itemSchema.parse(validItem);
    expect(result.shops).toEqual(["bunnings", "sydney-tools", "mitre-10"]);
  });
});

describe("TypeScript types", () => {
  it("should infer correct Shop type", () => {
    const shop: Shop = "bunnings";
    expect(shop).toBe("bunnings");
  });

  it("should infer correct Task type", () => {
    const task: Task = {
      required: ["item1"],
      optional: ["item2"],
      relatedTasks: ["task1"],
    };

    expect(task.required).toBeDefined();
    expect(task.optional).toBeDefined();
    expect(task.relatedTasks).toBeDefined();
  });

  it("should infer correct Item type", () => {
    const item: Item = {
      slug: "multi-tool",
      title: "Multi Tool",
      type: "equipment",
      notes: "",
      shops: ["bunnings"],
    };

    expect(item.slug).toBe("multi-tool");
    expect(item.type).toBe("equipment");
  });
});
