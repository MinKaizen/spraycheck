import { TaskData } from '@/lib/types';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  allTasks: TaskData;
  onNext: (selected: string[]) => void;
}

export function TaskSelectionScreen({ allTasks, onNext }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">What are you working on today?</h1>
      <div className="grid gap-3">
        {Object.keys(allTasks).map(taskId => (
          <button
            key={taskId}
            onClick={() => toggle(taskId)}
            className={cn(
              "p-4 rounded-lg border-2 text-left transition-all",
              selected.includes(taskId) 
                ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" 
                : "border-gray-200 dark:border-gray-800 hover:border-gray-300"
            )}
          >
            <span className="font-medium capitalize">{taskId.replace(/-/g, ' ')}</span>
          </button>
        ))}
      </div>
      <button
        onClick={() => onNext(selected)}
        disabled={selected.length === 0}
        className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black"
      >
        Next
      </button>
    </motion.div>
  );
}
