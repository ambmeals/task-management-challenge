'use client';

import { useState, useEffect } from 'react';
import { TaskCard } from './task-card';
import { Task } from '@/lib/db';

interface TaskListProps {
  initialTasks: Task[];
}

export function TaskList({ initialTasks }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  useEffect(() => {
    setTasks(initialTasks);
  }, [initialTasks]);

  const handleDelete = async (taskId: string) => {
    try {
      const response = await fetch(`https://localhost:7025/api/task/${taskId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        alert('Failed to delete the task.');
        return;
      }

      setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
      alert('An error occurred while deleting the task.');
    }
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {tasks.map((task) => (
        <TaskCard key={task.id} task={task} onDelete={handleDelete} />
      ))}
    </div>
  );
}