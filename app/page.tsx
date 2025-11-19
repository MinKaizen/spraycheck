import { loadYaml } from '@/lib/loadYaml';
import { TaskData, ItemData } from '@/lib/types';
import { AppOrchestrator } from '@/components/AppOrchestrator';

export default function Home() {
  const tasks = loadYaml<TaskData>('data/tasks.yaml');
  const items = loadYaml<ItemData>('data/items.yaml');

  return (
    <main className="min-h-screen bg-white dark:bg-black text-black dark:text-white">
      <AppOrchestrator allTasks={tasks} allItems={items} />
    </main>
  );
}
