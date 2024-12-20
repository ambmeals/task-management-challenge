import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

const taskSchema = z.object({
    title: z.string().min(1, 'Title is required'),
    description: z.string().optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']),
    status: z.enum(['TODO', 'IN_PROGRESS', 'DONE']),
    dueDate: z.string().optional(),
});

type TaskFormData = z.infer<typeof taskSchema>;

type TaskFormProps = {
    defaultValues?: Partial<TaskFormData>;
    onSubmit: (data: TaskFormData) => Promise<void>;
    submitButtonLabel: string;
};

export function TaskForm({ defaultValues, onSubmit, submitButtonLabel }: TaskFormProps) {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label htmlFor="title" className="block text-sm font-medium">Title</label>
                <Input id="title" {...register('title')} />
                {errors.title && <p className="text-red-500 text-sm">{errors.title.message}</p>}
            </div>
            <div>
                <label htmlFor="description" className="block text-sm font-medium">Description</label>
                <Input id="description" {...register('description')} />
            </div>
            <div>
                <label htmlFor="priority" className="block text-sm font-medium">Priority</label>
                <Select
                    onValueChange={(value) =>
                        setValue('priority', value as TaskFormData['priority'], { shouldValidate: true })
                    }
                    defaultValue={defaultValues?.priority || 'MEDIUM'}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select priority" />
                    </SelectTrigger>
                    <SelectContent>
                        {['LOW', 'MEDIUM', 'HIGH'].map((priority) => (
                            <SelectItem key={priority} value={priority}>
                                {priority}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label htmlFor="status" className="block text-sm font-medium">Status</label>
                <Select
                    onValueChange={(value) =>
                        setValue('status', value as TaskFormData['status'], { shouldValidate: true })
                    }
                    defaultValue={defaultValues?.status || 'TODO'}>
                    <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                        {['TODO', 'IN_PROGRESS', 'DONE'].map((status) => (
                            <SelectItem key={status} value={status}>
                                {status}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            </div>
            <div>
                <label htmlFor="dueDate" className="block text-sm font-medium">Due Date</label>
                <Input type="date" id="dueDate" {...register('dueDate')} />
            </div>
            <Button type="submit" className="w-full">{submitButtonLabel}</Button>
        </form>
    );
}
