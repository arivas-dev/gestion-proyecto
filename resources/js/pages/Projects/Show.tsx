import { Head, Link, router, useForm, usePage } from '@inertiajs/react';
import { toast } from 'sonner';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import MultiSelect from '../../components/MultiSelect';
import { useTranslation } from '../../hooks/useTranslation';

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
    flash?: {
        success?: string;
        error?: string;
    };
    [key: string]: unknown;
}

interface AssignedUser {
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
    assigned_user?: AssignedUser | null;
}

interface ProjectUser {
    id: number;
    name: string;
    email: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    tasks: Task[];
    users?: ProjectUser[];
}

interface ProjectsShowProps {
    project: Project;
    users?: User[];
}

export default function Show({ project, users = [] }: ProjectsShowProps) {
    const { t } = useTranslation();
    const { auth } = usePage<PageProps>().props;
    const currentUser = auth?.user;
    const isAdmin = currentUser?.is_admin || false;

    const { data: assignData, setData: setAssignData, post: assignPost, processing: assignProcessing } = useForm({
        user_ids: project.users?.map(u => u.id) || [],
    });

    const handleDeleteTask = (taskId: number) => {
        toast(t('common.confirm_delete_task'), {
            title: t('common.delete_task'),
            description: t('common.action_cannot_undo'),
            action: {
                label: t('common.delete'),
                onClick: () => {
                    router.delete(`/projects/${project.id}/tasks/${taskId}`, {
                        onError: () => {
                            toast.error(t('common.failed_to_delete_task'));
                        },
                    });
                },
            },
            cancel: {
                label: t('common.cancel'),
            },
            duration: Infinity,
        });
    };

    const handleAssignUsers = (e: React.FormEvent) => {
        e.preventDefault();
        const userIdsAsNumbers = assignData.user_ids.map(id => parseInt(id.toString()));
        setAssignData('user_ids', userIdsAsNumbers);
        assignPost(`/projects/${project.id}/assign-users`, {
            preserveScroll: true,
            onSuccess: () => {
                router.reload();
            },
            onError: () => {
                toast.error(t('common.failed_to_assign_users'));
            },
        });
    };

    const userOptions = users.map(user => ({
        value: user.id.toString(),
        label: `${user.name} (${user.email})`,
    }));

    const formatDate = (dateString: string | null | undefined): string => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric'
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
        <Layout title={project.name}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="mb-6">
                        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {t('common.back_to_projects')}
                        </Link>
                    </div>

                    <Card padding="lg" className="mb-6">
                        <div className="flex justify-between items-start mb-4">
                            <div className="flex-1">
                                <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">{project.name}</h1>
                                {project.description && (
                                    <p className="text-[var(--color-text-secondary)]">{project.description}</p>
                                )}
                            </div>
                            <div className="flex gap-2 ml-4">
                                <Link href={`/projects/${project.id}/edit`}>
                                    <Button variant="outline" size="sm">
                                        {t('common.edit')} {t('common.project')}
                                    </Button>
                                </Link>
                                <Link href={`/projects/${project.id}/tasks/create`}>
                                    <Button variant="primary" size="sm">
                                        <svg className="w-4 h-4 inline-block mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                        </svg>
                                        {t('common.add_task')}
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        {isAdmin && users.length > 0 && (
                            <div className="pt-4 border-t border-[var(--color-border-primary)]">
                                <form onSubmit={handleAssignUsers} className="space-y-4">
                                    <MultiSelect
                                        id="user_ids"
                                        name="user_ids"
                                        label={t('common.assign_users_to_project')}
                                        value={assignData.user_ids.map(id => id.toString())}
                                        onChange={(values) => {
                                            const numValues = values.map(v => parseInt(v));
                                            setAssignData('user_ids', numValues);
                                        }}
                                        options={userOptions}
                                        placeholder="Select users to assign..."
                                    />
                                    <Button
                                        type="submit"
                                        variant="secondary"
                                        size="sm"
                                        isLoading={assignProcessing}
                                        disabled={assignProcessing}
                                    >
                                        Update Assignments
                                    </Button>
                                </form>
                            </div>
                        )}

                        {project.users && project.users.length > 0 && (
                            <div className="pt-4 border-t border-[var(--color-border-primary)]">
                                <h3 className="text-sm font-semibold text-[var(--color-text-primary)] mb-2">Assigned Users</h3>
                                <div className="flex flex-wrap gap-2">
                                    {project.users.map((user) => (
                                        <span
                                            key={user.id}
                                            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-[var(--color-primary-light)] text-[var(--color-primary)]"
                                        >
                                            {user.name}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </Card>

                    <Card padding="none">
                        <div className="px-6 py-4 border-b border-[var(--color-border-primary)] bg-[var(--color-bg-secondary)]">
                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)]">{t('common.tasks')}</h2>
                        </div>
                        {project.tasks && project.tasks.length > 0 ? (
                            <ul className="divide-y divide-[var(--color-border-primary)]">
                                {project.tasks.map((task) => (
                                    <li key={task.id} className="px-6 py-4 hover:bg-[var(--color-bg-secondary)] transition-colors">
                                        <div className="flex items-center justify-between">
                                            <div className="flex-1 min-w-0">
                                                <Link
                                                    href={`/projects/${project.id}/tasks/${task.id}`}
                                                    className="text-lg font-semibold text-[var(--color-text-primary)] hover:text-[var(--color-primary)] transition-colors block"
                                                >
                                                    {task.title}
                                                </Link>
                                                {task.description && (
                                                    <p className="mt-1 text-sm text-[var(--color-text-secondary)] line-clamp-2">{task.description}</p>
                                                )}
                                                <div className="mt-2 flex flex-wrap gap-3 text-xs text-[var(--color-text-secondary)]">
                                                    {task.due_date && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                                            </svg>
                                                            Due: {formatDate(task.due_date)}
                                                            {new Date(task.due_date) < new Date() && task.status !== 'completed' && (
                                                                <span className="text-red-600">(Overdue)</span>
                                                            )}
                                                        </span>
                                                    )}
                                                    {task.assigned_user && (
                                                        <span className="flex items-center gap-1">
                                                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                                            </svg>
                                                            {task.assigned_user.name}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                            <div className="flex items-center gap-3 ml-4">
                                                <span
                                                    className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-semibold rounded-full border ${getStatusColor(
                                                        task.status
                                                    )}`}
                                                >
                                                    {getStatusIcon(task.status)}
                                                    {task.status.replace('_', ' ')}
                                                </span>
                                                <Link
                                                    href={`/projects/${project.id}/tasks/${task.id}/edit`}
                                                >
                                                    <Button variant="ghost" size="sm">
                                                        Edit
                                                    </Button>
                                                </Link>
                                                {isAdmin && (
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                                        onClick={() => handleDeleteTask(task.id)}
                                                    >
                                                        Delete
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="px-6 py-12 text-center">
                                <svg className="mx-auto h-12 w-12 text-[#826251]/40 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                </svg>
                                <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No tasks yet</h3>
                                <p className="text-[var(--color-text-secondary)] mb-6">Get started by creating your first task for this project.</p>
                                <Link href={`/projects/${project.id}/tasks/create`}>
                                    <Button variant="primary">Create your first task</Button>
                                </Link>
                            </div>
                        )}
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
