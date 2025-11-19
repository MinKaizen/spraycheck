import { ConsolidatedItem } from '@/lib/types';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Eye, EyeOff, RotateCcw } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ConfirmModal } from './ConfirmModal';

interface Props {
  items: ConsolidatedItem[];
  checkedItems: string[];
  onToggle: (slug: string) => void;
  onReset: () => void;
}

export function ChecklistScreen({ items, checkedItems, onToggle, onReset }: Props) {
  const [showHidden, setShowHidden] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);

  const equipment = items.filter(i => i.type === 'equipment');
  const products = items.filter(i => i.type === 'product');

  const equipmentChecked = equipment.filter(i => checkedItems.includes(i.slug)).length;
  const productsChecked = products.filter(i => checkedItems.includes(i.slug)).length;
  const totalChecked = checkedItems.filter(slug => items.some(i => i.slug === slug)).length;

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-8 pb-20"
    >
      <div className="sticky top-0 bg-white dark:bg-black z-10 py-4 border-b border-gray-100 dark:border-gray-800 space-y-3">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold">Checklist</h1>
          <div className="flex gap-2">
            <button
              onClick={() => setShowHidden(!showHidden)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-sm"
              title={showHidden ? "Hide checked" : "Show checked"}
            >
              {showHidden ? <EyeOff size={16} /> : <Eye size={16} />}
              <span>Toggle Checked</span>
            </button>
            <button
              onClick={() => setShowResetModal(true)}
              className="flex items-center gap-1.5 px-3 py-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-red-500 text-sm"
              title="Reset"
            >
              <RotateCcw size={16} />
              <span>Reset</span>
            </button>
          </div>
        </div>
        <div className="flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>Equipment: <span className="font-semibold text-black dark:text-white">{equipmentChecked}/{equipment.length}</span></span>
          <span>Products: <span className="font-semibold text-black dark:text-white">{productsChecked}/{products.length}</span></span>
          <span>Total: <span className="font-semibold text-black dark:text-white">{totalChecked}/{items.length}</span></span>
        </div>
      </div>

      <ChecklistGroup 
        title="Equipment" 
        items={equipment} 
        checkedItems={checkedItems} 
        onToggle={onToggle} 
        showHidden={showHidden} 
      />
      
      <ChecklistGroup 
        title="Products" 
        items={products} 
        checkedItems={checkedItems} 
        onToggle={onToggle} 
        showHidden={showHidden} 
      />

      <ConfirmModal
        isOpen={showResetModal}
        title="Reset Checklist?"
        message="This will clear your task selection and all checked items. You'll need to select tasks again from the beginning."
        confirmText="Reset"
        cancelText="Cancel"
        onConfirm={() => {
          onReset();
          setShowResetModal(false);
        }}
        onCancel={() => setShowResetModal(false)}
      />
    </motion.div>
  );
}

function ChecklistGroup({ 
  title, 
  items, 
  checkedItems, 
  onToggle, 
  showHidden 
}: { 
  title: string; 
  items: ConsolidatedItem[]; 
  checkedItems: string[]; 
  onToggle: (slug: string) => void; 
  showHidden: boolean; 
}) {
  if (items.length === 0) return null;

  const visibleItems = items.filter(item => showHidden || !checkedItems.includes(item.slug));

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold text-gray-500 uppercase tracking-wider text-sm">{title}</h2>
      <div className="space-y-2">
        <AnimatePresence initial={false}>
          {visibleItems.map(item => {
            const isChecked = checkedItems.includes(item.slug);
            return (
              <motion.div
                key={item.slug}
                layout
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className={cn(
                  "flex items-start gap-3 p-4 rounded-xl border transition-colors cursor-pointer select-none",
                  isChecked 
                    ? "bg-gray-50 border-gray-100 dark:bg-gray-900/50 dark:border-gray-800" 
                    : "bg-white border-gray-200 dark:bg-gray-900 dark:border-gray-800 hover:border-gray-300"
                )}
                onClick={() => onToggle(item.slug)}
              >
                <div className={cn(
                  "mt-1 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-colors shrink-0",
                  isChecked 
                    ? "bg-green-500 border-green-500 text-white" 
                    : "border-gray-300 dark:border-gray-600"
                )}>
                  {isChecked && <Check size={12} strokeWidth={3} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={cn(
                      "font-medium block truncate",
                      isChecked && "text-gray-400 line-through"
                    )}>
                      {item.title}
                    </span>
                    {item.isOptional && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-blue-100 text-blue-700 rounded-full dark:bg-blue-900/30 dark:text-blue-300">
                        Optional
                      </span>
                    )}
                  </div>
                  {item.notes && (
                    <p className="text-sm text-gray-500 mt-1">{item.notes}</p>
                  )}
                  {item.shops.length > 0 && (
                    <p className="text-xs text-gray-400 mt-1">
                      Available at: {item.shops.map(s => s.replace(/-/g, ' ')).join(', ')}
                    </p>
                  )}
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        {visibleItems.length === 0 && !showHidden && items.length > 0 && (
          <p className="text-center text-gray-400 py-4 italic">All items checked</p>
        )}
      </div>
    </div>
  );
}
