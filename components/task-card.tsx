import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { EditTaskButton } from '@/components/update-task-button';
import { Task } from '@/lib/db';

const priorityColors = {
  LOW: 'bg-blue-100 text-blue-800',
  MEDIUM: 'bg-yellow-100 text-yellow-800',
  HIGH: 'bg-red-100 text-red-800',
} as const;

const statusColors = {
  TODO: 'bg-gray-100 text-gray-800',
  IN_PROGRESS: 'bg-purple-100 text-purple-800',
  DONE: 'bg-green-100 text-green-800',
} as const;

interface TaskCardProps {
  task: Task;
  onDelete: (id: string) => void;
}

function getColorClass<T extends object>(
  value: string | undefined,
  colorMap: T,
  defaultClass = 'bg-gray-200 text-gray-800'
) {
  return value && value in colorMap
    ? colorMap[value as keyof T]
    : defaultClass;
}

export function TaskCard({ task, onDelete }: TaskCardProps) {
  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-xl">{task.title}</CardTitle>
          <Badge
            variant="outline"
            className={getColorClass(task.priority, priorityColors)}>
            {task.priority}
          </Badge>
        </div>
        <CardDescription>
          {task.dueDate && (
            <span className="text-sm text-gray-500">
              Due: {format(new Date(task.dueDate), 'PPP')}
            </span>
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-gray-600 mb-4">{task.description || 'No description provided'}</p>
        <Badge className={getColorClass(task.status, statusColors)}>
          {task.status}
        </Badge>
        <div className="flex gap-2 mt-4">
                  <EditTaskButton
                      task={{
                          id: task.id,
                          title: task.title,
                          description: task.description || undefined,
                          priority: task.priority as 'LOW' | 'MEDIUM' | 'HIGH',
                          status: task.status as 'TODO' | 'IN_PROGRESS' | 'DONE',
                          dueDate: task.dueDate
                              ? task.dueDate.toISOString()
                              : undefined,
                      }}
                  />
          <button
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            onClick={() => onDelete(task.id)}>
            Delete
          </button>
        </div>
      </CardContent>
    </Card>
  );
}
