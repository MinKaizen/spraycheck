export interface Task {
  required: string[];
  optional: string[];
  relatedTasks?: string[];
}

export interface Item {
  slug: string;
  title: string;
  type: 'equipment' | 'product';
  notes: string;
  shops: string[];
}

export type TaskData = Record<string, Task>;
export type ItemData = Record<string, Item>;

export interface ConsolidatedItem extends Item {
  isRequired: boolean;
  isOptional: boolean;
  requiredByTasks: string[];
  optionalForTasks: string[];
}

export type AppScreen = 'TASKS' | 'RELATED' | 'NAME' | 'CHECKLIST';

export interface AppState {
  screen: AppScreen;
  selectedTasks: string[];
  checkedItems: string[];
  checklistName: string;
}
