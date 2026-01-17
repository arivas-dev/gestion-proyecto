import { Head, Link, usePage } from '@inertiajs/react';
import Layout from '../../components/Layout';
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

interface AssignedUser {
    id: number;
    name: string;
    email: string;
}

interface CompletedByUser {
    id: number;
    name: string;
    email: string;
}

interface Task {
    id: number;
    title: string;
    description: string | null;
    status: string;
    due_date?: string | null;
    assigned_to?: number | null;
    assigned_user?: AssignedUser | null;
    completed_at?: string | null;
    completed_by?: number | null;
    completed_by_user?: CompletedByUser | null;
    completion_comment?: string | null;
}

interface TasksShowProps {
    project: Project;
    task: Task;
}

export default function Show({ project, task }: TasksShowProps) {
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;
    const isAdmin = currentUser?.is_admin || false;

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };
    const getStatusColor = (status: string) => {
        switch (status) {
            case 'completed':
                return 'bg-[var(--color-success-light)] text-[var(--color-success)] border-[var(--color-success-light)]';
            case 'in_progress':
                return 'bg-[var(--color-primary-light)] text-[var(--color-primary)] border-[var(--color-primary)]/30';
            default:
                return 'bg-[var(--color-bg-tertiary)] text-[var(--color-text-primary)] border-[var(--color-border-primary)]';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'completed':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                );
            case 'in_progress':
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
            default:
                return (
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                    </svg>
                );
        }
    };

    return (
        <Layout title={task.title}>
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="mb-6">
                        <Link
                            href={`/projects/${project.id}`}
                            className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                        >
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            Back to project
                        </Link>
                    </div>

                    <Card padding="lg">
                        <div className="flex justify-between items-start mb-6">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-3">{task.title}</h1>
                                <span
                                    className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-full border ${getStatusColor(
                                        task.status
                                    )}`}
                                >
                                    {getStatusIcon(task.status)}
                                    {task.status.replace('_', ' ')}
                                </span>
                            </div>
                            <Link href={`/projects/${project.id}/tasks/${task.id}/edit`}>
                                <Button variant="primary" size="sm">
                                    Edit Task
                                </Button>
                            </Link>
                        </div>

                        {task.description && (
                            <div className="mb-6 pb-6 border-b border-[var(--color-border-primary)]">
                                <h2 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-3 uppercase tracking-wide">Description</h2>
                                <p className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed">{task.description}</p>
                            </div>
                        )}

                        <div className="space-y-4 mb-6 pb-6 border-b border-[var(--color-border-primary)]">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {task.due_date && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Due Date</h3>
                                        <p className="text-[var(--color-text-primary)]">
                                            {formatDate(task.due_date)}
                                            {new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                                                <span className="ml-2 text-red-600 text-xs">(Overdue)</span>
                                            )}
                                        </p>
                                    </div>
                                )}
                                
                                {task.assigned_user && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Assigned To</h3>
                                        <p className="text-[var(--color-text-primary)]">
                                            {task.assigned_user.name} ({task.assigned_user.email})
                                        </p>
                                    </div>
                                )}

                                {task.status === 'completed' && task.completed_by_user && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Completed By</h3>
                                        <p className="text-[var(--color-text-primary)]">
                                            {task.completed_by_user.name}
                                        </p>
                                    </div>
                                )}

                                {task.status === 'completed' && task.completed_at && (
                                    <div>
                                        <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-1">Completed At</h3>
                                        <p className="text-[var(--color-text-primary)]">
                                            {formatDate(task.completed_at)}
                                        </p>
                                    </div>
                                )}
                            </div>

                            {task.status === 'completed' && task.completion_comment && (
                                <div>
                                    <h3 className="text-sm font-semibold text-[var(--color-text-secondary)] mb-2 uppercase tracking-wide">Completion Comment</h3>
                                    <p className="text-[var(--color-text-primary)] whitespace-pre-wrap leading-relaxed bg-[var(--color-primary-light)] p-3 rounded-lg">
                                        {task.completion_comment}
                                    </p>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center gap-2 text-sm">
                            <span className="text-[var(--color-text-secondary)]">Project:</span>
                            <Link
                                href={`/projects/${project.id}`}
                                className="font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors"
                            >
                                {project.name}
                            </Link>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
