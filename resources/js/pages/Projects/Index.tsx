import { Head, Link, router } from '@inertiajs/react';
import { toast } from 'sonner';
import Layout from '../../components/Layout';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTranslation } from '../../hooks/useTranslation';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface Project {
    id: number;
    name: string;
    description: string | null;
    tasks: Task[];
}

interface ProjectsIndexProps {
    projects: Project[];
}

export default function Index({ projects }: ProjectsIndexProps) {
    const { t } = useTranslation();
    
    const handleDelete = (id: number) => {
        toast(t('common.confirm_delete_project'), {
            title: t('common.delete_project'),
            description: t('common.action_cannot_undo'),
            action: {
                label: t('common.delete'),
                onClick: () => {
                    router.delete(`/projects/${id}`, {
                        onError: () => {
                            toast.error(t('common.failed_to_delete_project'));
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

    return (
        <Layout title={t('common.projects')}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{t('common.my_projects')}</h1>
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t('common.manage_and_organize')}</p>
                        </div>
                        <Link href="/projects/create">
                            <Button variant="primary">
                                <svg className="w-5 h-5 inline-block mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                                </svg>
                                {t('common.new_project')}
                            </Button>
                        </Link>
                    </div>

                    {projects.length === 0 ? (
                        <Card padding="lg" className="text-center">
                            <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">{t('common.no_projects_yet')}</h3>
                            <p className="text-[var(--color-text-secondary)] mb-6">{t('common.get_started')}</p>
                            <Link href="/projects/create">
                                <Button variant="primary">{t('common.create_first_project')}</Button>
                            </Link>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                            {projects.map((project) => (
                                <Card key={project.id} hover padding="md" className="flex flex-col">
                                    <div className="flex-1">
                                        <div className="flex items-start justify-between mb-3">
                                            <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                                <Link
                                                    href={`/projects/${project.id}`}
                                                    className="hover:text-[var(--color-primary)] transition-colors"
                                                >
                                                    {project.name}
                                                </Link>
                                            </h3>
                                        </div>
                                        {project.description && (
                                            <p className="text-sm text-[var(--color-text-secondary)] mb-4 line-clamp-3">
                                                {project.description}
                                            </p>
                                        )}
                                        <div className="flex items-center text-sm text-[var(--color-text-secondary)] mb-4">
                                            <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                            <span className="font-medium">{project.tasks?.length || 0}</span>
                                            <span className="ml-1">{t('common.tasks')}</span>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 pt-4 border-t border-[var(--color-border-primary)]">
                                        <Link
                                            href={`/projects/${project.id}`}
                                            className="flex-1"
                                        >
                                            <Button variant="outline" size="sm" className="w-full">
                                                {t('common.view')}
                                            </Button>
                                        </Link>
                                        <Link
                                            href={`/projects/${project.id}/edit`}
                                            className="flex-1"
                                        >
                                            <Button variant="ghost" size="sm" className="w-full">
                                                {t('common.edit')}
                                            </Button>
                                        </Link>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="flex-1 text-red-600 hover:text-red-700 hover:bg-red-50"
                                            onClick={() => handleDelete(project.id)}
                                        >
                                            {t('common.delete')}
                                        </Button>
                                    </div>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </Layout>
    );
}
