import { useState } from 'react';
import { motion } from 'framer-motion';

interface Props {
  onSubmit: (name: string) => void;
}

export function NameChecklistScreen({ onSubmit }: Props) {
  const [name, setName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit(name.trim());
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-6"
    >
      <h1 className="text-2xl font-bold text-center">Name this job</h1>
      <p className="text-center text-gray-500">Use a short descriptive name</p>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="e.g. Wakely Kevins House"
          className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 focus:border-blue-500 dark:focus:border-blue-500 outline-none transition-colors"
          autoFocus
        />
        <button
          type="submit"
          disabled={!name.trim()}
          className="w-full py-3 bg-black text-white rounded-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed dark:bg-white dark:text-black"
        >
          Create Checklist
        </button>
      </form>
    </motion.div>
  );
}
