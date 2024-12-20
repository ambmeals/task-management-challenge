'use client';
import { useState } from 'react';
import { Trash } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function DeleteTaskButton({ taskId, onTaskDeletedAction }: { taskId: string; onTaskDeletedAction: () => void }) {
    const [isDeleting, setIsDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Are you sure you want to delete this task?'))
            return;

        setIsDeleting(true);

        const response = await fetch(`https://localhost:7025/api/task/${taskId}`, {
            method: 'DELETE',
        });

        if (response.ok)
            onTaskDeletedAction();
        else
            alert('Failed to delete the task.');

        setIsDeleting(false);
    };

    return (
        <Button onClick={handleDelete} disabled={isDeleting} variant="destructive">
            <Trash className="mr-2 h-4 w-4" />
            {isDeleting ? 'Deleting...' : 'Delete Task'}
        </Button>
    );
}