import { TaskData, ItemData, ConsolidatedItem } from './types';

export function getRelatedTasks(selectedTaskIds: string[], allTasks: TaskData): string[] {
  const related = new Set<string>();
  selectedTaskIds.forEach(taskId => {
    const task = allTasks[taskId];
    if (task?.relatedTasks) {
      task.relatedTasks.forEach(relatedId => {
        if (!selectedTaskIds.includes(relatedId)) {
          related.add(relatedId);
        }
      });
    }
  });
  return Array.from(related);
}

export function getConsolidatedItems(
  selectedTaskIds: string[],
  allTasks: TaskData,
  allItems: ItemData
): ConsolidatedItem[] {
  const itemMap = new Map<string, { required: boolean; optional: boolean }>();

  selectedTaskIds.forEach(taskId => {
    const task = allTasks[taskId];
    if (!task) return;

    task.required.forEach(slug => {
      const current = itemMap.get(slug) || { required: false, optional: false };
      itemMap.set(slug, { ...current, required: true });
    });

    const optional = task.optional || []

    optional.forEach(slug => {
      const current = itemMap.get(slug) || { required: false, optional: false };
      itemMap.set(slug, { ...current, optional: true });
    });
  });

  return Array.from(itemMap.entries()).map(([slug, status]) => {
    const itemDef = allItems[slug];
    if (!itemDef) return null;
    
    // If an item is required by ANY task, it is required overall.
    // It is only "optional" if it is NEVER required but appears in optional lists.
    const isRequired = status.required;
    
    return {
      ...itemDef,
      isRequired,
      isOptional: !isRequired && status.optional,
    };
  }).filter((item): item is ConsolidatedItem => item !== null);
}
