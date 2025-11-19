'use client';

import { TaskData, ItemData } from '@/lib/types';
import { useAppFlow } from '@/hooks/useAppFlow';
import { TaskSelectionScreen } from './TaskSelectionScreen';
import { RelatedTaskSelectionScreen } from './RelatedTaskSelectionScreen';
import { NameChecklistScreen } from './NameChecklistScreen';
import { ChecklistScreen } from './ChecklistScreen';
import { getConsolidatedItems } from '@/lib/taskUtils';
import { AnimatePresence } from 'framer-motion';

interface Props {
  allTasks: TaskData;
  allItems: ItemData;
}

export function AppOrchestrator({ allTasks, allItems }: Props) {
  const {
    screen,
    selectedTasks,
    potentialRelatedTasks,
    checkedItems,
    checklistName,
    isInitialized,
    handleTaskSelection,
    handleRelatedSelection,
    handleNameSubmit,
    toggleItemCheck,
    reset
  } = useAppFlow(allTasks);

  if (!isInitialized) return null;

  return (
    <div className="max-w-md mx-auto p-4 min-h-screen">
      <AnimatePresence mode="wait">
        {screen === 'TASKS' && (
          <TaskSelectionScreen 
            key="tasks"
            allTasks={allTasks} 
            onNext={handleTaskSelection} 
          />
        )}
        {screen === 'RELATED' && (
          <RelatedTaskSelectionScreen 
            key="related"
            relatedTaskIds={potentialRelatedTasks} 
            onConfirm={handleRelatedSelection} 
          />
        )}
        {screen === 'NAME' && (
          <NameChecklistScreen 
            key="name"
            onSubmit={handleNameSubmit} 
          />
        )}
        {screen === 'CHECKLIST' && (
          <ChecklistScreen 
            key="checklist"
            items={getConsolidatedItems(selectedTasks, allTasks, allItems)}
            checkedItems={checkedItems}
            checklistName={checklistName}
            onToggle={toggleItemCheck}
            onReset={reset}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
