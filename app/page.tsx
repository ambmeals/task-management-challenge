'use client';

import { useEffect, useState } from 'react';
import { CreateTaskButton } from '@/components/create-task-button';
import { EditTaskButton } from '@/components/update-task-button';
import BootstrapToast from '@/components/bootstrap-toastr';
import axios from 'axios';
import https from 'https';

function formatDueDate(dateString: string | null) {
    if (!dateString)
        return 'No due date';

    const date = new Date(dateString);
    if (isNaN(date.getTime()))
        return 'Invalid date';

    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'short',
        day: '2-digit',
    }).format(date);
}

function getStatusBadge(status: string) {
    if (status === 'TODO')
        return { label: 'To Do', className: 'badge bg-secondary' };
    if (status === 'IN_PROGRESS')
        return { label: 'In Progress', className: 'badge bg-warning text-dark' };
    if (status === 'DONE')
        return { label: 'Done', className: 'badge bg-success' };

    return { label: status, className: 'badge bg-light text-dark' };
}

function getPriorityBadge(priority: string) {
    if (priority === 'LOW')
        return { label: 'Low', className: 'badge bg-blue-100 text-black' };
    if (priority === 'MEDIUM')
        return { label: 'Medium', className: 'badge bg-yellow-100 text-black' };
    if (priority === 'HIGH')
        return { label: 'High', className: 'badge bg-red-100 text-black' };
    return { label: priority, className: 'badge bg-light text-dark' };
}

const api = axios.create({
    baseURL: 'https://localhost:7025/api/task',
    httpsAgent: new https.Agent({
        rejectUnauthorized: false,
    }),
});

export default function Home() {
    const [tasks, setTasks] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [toasts, setToasts] = useState<{ id: number; title: string; message: string }[]>([]);

    const addToast = (title: string, message: string) => {
        const id = Date.now();
        setToasts((prev) => [...prev, { id, title, message }]);
        setTimeout(() => setToasts((prev) => prev.filter((toast) => toast.id !== id)), 3000);
    };

    useEffect(() => {
        api.get('')
            .then((response) => {
                if (response.status === 200 && response.data) {
                    setTasks(response.data.data);
                    addToast('Success', 'Tasks loaded successfully.');
                }
            })
            .catch(() => {
                addToast('Error', 'Failed to load tasks.');
            })
            .finally(() => setLoading(false));
    }, []);

    const handleDelete = (taskId: string) => {
        api.delete(`/${taskId}`)
            .then((response) => {
                if (response.status === 200) {
                    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
                    addToast('Deleted', 'Task deleted successfully.');
                }
            })
            .catch(() => {
                addToast('Error', 'Failed to delete task.');
            });
    };

    if (loading)
        return <p>Loading tasks...</p>;

    return (
        <main className="container mx-auto p-4">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-4xl font-bold">Task Management</h1>
                <CreateTaskButton />
            </div>
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
                {tasks.map((task: any) => {
                    const { label, className } = getStatusBadge(task.status);

                    return (
                        <div key={task.id} className="border p-4 rounded-lg shadow">
                            <h2 className="text-xl font-bold mb-2">{task.title}</h2>
                            <p className="text-gray-600 mb-2">
                                {task.description || 'No description provided'}
                            </p>
                            <p className="text-gray-800 mb-2">
                                Priority:{' '}
                                <span className={getPriorityBadge(task.priority).className}>
                                    {getPriorityBadge(task.priority).label}
                                </span>
                            </p>
                            <p>
                                <span className={className}>{label}</span>
                            </p>
                            <p className="text-gray-600 mb-4">
                                Due Date: {formatDueDate(task.dueDate)}
                            </p>
                            <div className="flex gap-2">
                                <EditTaskButton task={task} />
                                <button
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                    onClick={() => handleDelete(task.id)}>
                                    Delete
                                </button>
                            </div>
                        </div>
                    );
                })}
            </div>
            {toasts.map((toast) => (
                <BootstrapToast
                    key={toast.id}
                    title={toast.title}
                    message={toast.message} />
            ))}
        </main>
    );
}