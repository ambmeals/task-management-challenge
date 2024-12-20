'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Pencil } from 'lucide-react';

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
    const { register, handleSubmit, reset, formState: { errors }, setValue } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues: {
            ...task,
            dueDate: task.dueDate || '',
        },
    });

    const onSubmit = async (data: TaskFormData) => {
        try {
            const updatedTask = {
                ...data,
                dueDate: data.dueDate || null,
            };

            const response = await fetch(`https://localhost:7025/api/task/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (!response.ok)
                throw new Error('Failed to update task');

            reset();
            setOpen(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating task:', error);
        }
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
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input id="title" {...register('title')} />
                        {errors.title && (
                            <p className="text-red-500 text-sm">{errors.title.message}</p>
                        )}
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input id="description" {...register('description')} />
                    </div>
                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue('priority', value as TaskFormData['priority'], { shouldValidate: true })
                            }
                            defaultValue={task.priority}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select priority" />
                            </SelectTrigger>
                            <SelectContent>
                                {PRIORITIES.map((priority) => (
                                    <SelectItem key={priority} value={priority}>
                                        {priority}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="status">Status</Label>
                        <Select
                            onValueChange={(value) =>
                                setValue('status', value as TaskFormData['status'], { shouldValidate: true })
                            }
                            defaultValue={task.status}>
                            <SelectTrigger>
                                <SelectValue placeholder="Select status" />
                            </SelectTrigger>
                            <SelectContent>
                                {STATUSES.map((status) => (
                                    <SelectItem key={status} value={status}>
                                        {status}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input type="date" id="dueDate" {...register('dueDate')} />
                    </div>
                    <Button type="submit" className="w-full">
                        Save Changes
                    </Button>
                </form>
            </DialogContent>
        </Dialog>
    );
}