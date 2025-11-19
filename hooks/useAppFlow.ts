import { useState, useEffect } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TaskData, AppScreen } from '@/lib/types';
import { getRelatedTasks } from '@/lib/taskUtils';

export function useAppFlow(allTasks: TaskData) {
  const [savedState, setSavedState] = useLocalStorage<{ selectedTasks: string[], checkedItems: string[] } | null>('spraycheck-state', null);
  
  const [screen, setScreen] = useState<AppScreen>('TASKS');
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [potentialRelatedTasks, setPotentialRelatedTasks] = useState<string[]>([]);
  const [checkedItems, setCheckedItems] = useState<string[]>([]);
  const [isInitialized, setIsInitialized] = useState(false);

  // Initialize from local storage
  useEffect(() => {
    if (savedState) {
      setSelectedTasks(savedState.selectedTasks);
      setCheckedItems(savedState.checkedItems);
      setScreen('CHECKLIST');
    }
    setIsInitialized(true);
  }, [savedState]);

  const handleTaskSelection = (tasks: string[]) => {
    const related = getRelatedTasks(tasks, allTasks);
    if (related.length > 0) {
      setSelectedTasks(tasks);
      setPotentialRelatedTasks(related);
      setScreen('RELATED');
    } else {
      finalizeSelection(tasks);
    }
  };

  const handleRelatedSelection = (additionalTasks: string[]) => {
    const finalTasks = [...selectedTasks, ...additionalTasks];
    finalizeSelection(finalTasks);
  };

  const finalizeSelection = (tasks: string[]) => {
    setSelectedTasks(tasks);
    setSavedState({ selectedTasks: tasks, checkedItems: [] });
    setScreen('CHECKLIST');
  };

  const toggleItemCheck = (slug: string) => {
    const newChecked = checkedItems.includes(slug)
      ? checkedItems.filter(i => i !== slug)
      : [...checkedItems, slug];
    
    setCheckedItems(newChecked);
    if (savedState) {
      setSavedState({ ...savedState, checkedItems: newChecked });
    }
  };

  const reset = () => {
    setSavedState(null);
    setSelectedTasks([]);
    setCheckedItems([]);
    setScreen('TASKS');
  };

  return {
    screen,
    selectedTasks,
    potentialRelatedTasks,
    checkedItems,
    isInitialized,
    handleTaskSelection,
    handleRelatedSelection,
    toggleItemCheck,
    reset
  };
}
