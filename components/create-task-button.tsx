'use client';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import { TaskForm } from '@/components/task-form';

type TaskFormData = {
    title: string;
    description?: string;
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    status: 'TODO' | 'IN_PROGRESS' | 'DONE';
    dueDate?: string;
};

export function CreateTaskButton() {
    const [open, setOpen] = useState(false);

    const onSubmit = async (data: TaskFormData) => {
        const taskData = { ...data, dueDate: data.dueDate || null };
        const response = await fetch('https://localhost:7025/api/task', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData),
        });

        if (response.ok) {
            setOpen(false);
            window.location.reload();
        }
        else
            console.error('Failed to create task');
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>
                    <PlusCircle className="mr-2 h-4 w-4" />
                    Create Task
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Create New Task</DialogTitle>
                    <DialogDescription>
                        Enter the details for your new task below.
                    </DialogDescription>
                </DialogHeader>
                <TaskForm
                    defaultValues={{ priority: 'MEDIUM', status: 'TODO' }}
                    onSubmit={onSubmit}
                    submitButtonLabel="Create Task" />
            </DialogContent>
        </Dialog>
    );
}
