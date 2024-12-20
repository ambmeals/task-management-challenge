import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

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
    const { register, handleSubmit, formState: { errors } } = useForm<TaskFormData>({
        resolver: zodResolver(taskSchema),
        defaultValues,
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
                <label>Title</label>
                <Input {...register('title')} />
                {errors.title && <p>{errors.title.message}</p>}
            </div>
            <div>
                <label>Description</label>
                <Input {...register('description')} />
            </div>
            <Button type="submit">{submitButtonLabel}</Button>
        </form>
    );
}