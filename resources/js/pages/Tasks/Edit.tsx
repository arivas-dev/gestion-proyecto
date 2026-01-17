import { Head, Link, useForm, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Select from '../../components/Select';
import Button from '../../components/Button';
import Card from '../../components/Card';

interface User {
    id: number;
    name: string;
    email: string;
    is_admin?: boolean;
}

interface PageProps {
    auth?: {
        user?: User;
    };
    [key: string]: unknown;
}

interface Project {
    id: number;
    name: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    due_date?: string | null;
    assigned_to?: number | null;
    completed_at?: string | null;
    completed_by?: number | null;
    completion_comment?: string | null;
}

interface TasksEditProps {
    project: Project;
    task: Task;
    users?: User[];
}

export default function Edit({ project, task, users = [] }: TasksEditProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;
    const isAdmin = currentUser?.is_admin || false;
    const isCompleting = task.status !== 'completed';

    const { data, setData, put, processing, errors } = useForm({
        title: task.title,
        description: task.description || '',
        status: task.status,
        due_date: task.due_date || '',
        assigned_to: task.assigned_to?.toString() || '',
        completion_comment: task.completion_comment || '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/projects/${project.id}/tasks/${task.id}`, {
            onError: () => {
                toast.error('Failed to update task');
            },
        });
    };

    const statusOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'in_progress', label: 'In Progress' },
        { value: 'completed', label: 'Completed' },
    ];

    const userOptions = users.map(user => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
    }));

    return (
        <Layout title={`Edit ${task.title}`}>
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="mb-6">
                        <Link
                            href={`/projects/${project.id}/tasks/${task.id}`}
                            className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to task
                        </Link>
                    </div>

                    <Card padding="lg">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">Edit Task</h1>
                            <p className="text-sm text-[var(--color-text-secondary)]">Update task information</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <Input
                                id="title"
                                name="title"
                                type="text"
                                label="Task Title"
                                required
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="Enter task title"
                                error={errors.title}
                            />

                            <Input
                                id="description"
                                name="description"
                                as="textarea"
                                label="Description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Describe the task (optional)"
                                error={errors.description}
                                rows={4}
                            />

                            <Select
                                id="status"
                                name="status"
                                label="Status"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                                options={statusOptions}
                                error={errors.status}
                            />

                            <Input
                                id="due_date"
                                name="due_date"
                                type="date"
                                label="Due Date"
                                value={data.due_date}
                                onChange={(e) => setData('due_date', e.target.value)}
                                error={errors.due_date}
                            />

                            {isAdmin && userOptions.length > 0 && (
                                <Select
                                    id="assigned_to"
                                    name="assigned_to"
                                    label="Assign To"
                                    value={data.assigned_to}
                                    onChange={(e) => setData('assigned_to', e.target.value)}
                                    options={[{ value: '', label: 'Unassigned' }, ...userOptions]}
                                    error={errors.assigned_to}
                                />
                            )}

                            {data.status === 'completed' && (
                                <Input
                                    id="completion_comment"
                                    name="completion_comment"
                                    as="textarea"
                                    label="Completion Comment"
                                    required={data.status === 'completed'}
                                    value={data.completion_comment}
                                    onChange={(e) => setData('completion_comment', e.target.value)}
                                    placeholder="Add a comment about the completion of this task"
                                    error={errors.completion_comment}
                                    rows={3}
                                />
                            )}

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                                <Link href={`/projects/${project.id}/tasks/${task.id}`}>
                                    <Button type="button" variant="outline">
                                        Cancel
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={processing}
                                    disabled={processing}
                                >
                                    Update Task
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
