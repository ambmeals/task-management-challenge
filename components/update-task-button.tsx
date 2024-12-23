'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Pencil } from 'lucide-react';
import { TaskForm } from '@/components/task-form';

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(PRIORITIES),
    status: z.enum(STATUSES),
    dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

export function EditTaskButton({ task }: { task: TaskFormData & { id: string } }) {
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: TaskFormData) => {
        const updatedTask = { ...data, dueDate: data.dueDate || null };
        const response = await fetch(`https://localhost:7025/api/task/${task.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedTask),
        });

        if (response.ok) {
            setOpen(false);
            window.location.reload();
        } else
            console.error('Failed to update task');    
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <Pencil className="mr-2 h-4 w-4" />
                    Edit Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                    <DialogDescription>
                        Update the details for this task below.
                    </DialogDescription>
                </DialogHeader>
                <TaskForm
                    defaultValues={{
                        ...task,
                        dueDate: task.dueDate || '',
                    }}
                    onSubmit={onSubmit}
                    submitButtonLabel="Save Changes"
                />
            </DialogContent>
        </Dialog>
    );
}