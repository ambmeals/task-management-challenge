'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
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

const PRIORITIES = ['LOW', 'MEDIUM', 'HIGH'] as const;
const STATUSES = ['TODO', 'IN_PROGRESS', 'DONE'] as const;

export function EditTaskButton({ task }: { task: any }) {
    const [open, setOpen] = useState(false);
    const [updatedTask, setUpdatedTask] = useState(task);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        setUpdatedTask((prev: any) => ({ ...prev, [name]: value }));
    };

    const handleUpdate = async () => {
        try {
            const response = await fetch(`https://localhost:7025/api/task/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            });

            if (response.ok) {
                setOpen(false);
                window.location.reload();
            } else {
                const errorData = await response.json();
                alert(errorData.message || 'Failed to update the task.');
            }
        } catch (error) {
            alert('An error occurred while updating the task.');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button>Edit Task</Button>
            </DialogTrigger>

            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <div>
                        <Label htmlFor="title">Title</Label>
                        <Input
                            id="title"
                            name="title"
                            value={updatedTask.title}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="description">Description</Label>
                        <Input
                            id="description"
                            name="description"
                            value={updatedTask.description || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="priority">Priority</Label>
                        <Select
                            onValueChange={(value) =>
                                setUpdatedTask((prev: any) => ({ ...prev, priority: value }))}
                            defaultValue={updatedTask.priority}>
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
                                setUpdatedTask((prev: any) => ({ ...prev, status: value }))}
                            defaultValue={updatedTask.status}>
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
                        <Input
                            type="date"
                            id="dueDate"
                            name="dueDate"
                            value={updatedTask.dueDate || ''}
                            onChange={handleInputChange} />
                    </div>
                    <Button onClick={handleUpdate} className="w-full">
                        Update Task
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
}