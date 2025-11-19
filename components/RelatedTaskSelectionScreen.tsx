import { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface Props {
  relatedTaskIds: string[];
  onConfirm: (selected: string[]) => void;
}

export function RelatedTaskSelectionScreen({ relatedTaskIds, onConfirm }: Props) {
  const [selected, setSelected] = useState<string[]>([]);

  const toggle = (id: string) => {
    setSelected(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Add related tasks?</h1>
      <p className="text-center text-gray-500">These tasks are often done together with your selection.</p>
      <div className="grid gap-3">
        {relatedTaskIds.map(taskId => (
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
      <div className="flex gap-3">
        <button
          onClick={() => onConfirm(selected)}
          className="flex-1 py-3 bg-black text-white rounded-lg font-medium dark:bg-white dark:text-black"
        >
          {selected.length > 0 ? `Add ${selected.length} Tasks` : 'Skip'}
        </button>
      </div>
    </motion.div>
  );
}
