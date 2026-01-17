import { Head, Link } from '@inertiajs/react';
import Layout from '../../components/Layout';
import Card from '../../components/Card';
import Button from '../../components/Button';
import { useTranslation } from '../../hooks/useTranslation';

interface DashboardStats {
    totalProjects: number;
    totalCollaborators: number;
    pendingTasks: number;
    completedTasks: number;
}

interface DashboardProps {
    stats: DashboardStats;
}

export default function Dashboard({ stats }: DashboardProps) {
    const { t } = useTranslation();
    
    const statCards = [
        {
            title: t('common.total_projects'),
            value: stats.totalProjects,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
            ),
            color: 'bg-[var(--color-primary-light)] text-[var(--color-primary)]',
        },
        {
            title: t('common.collaborators'),
            value: stats.totalCollaborators,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'bg-[var(--color-info)]/10 text-[var(--color-info)]',
        },
        {
            title: t('common.pending_tasks'),
            value: stats.pendingTasks,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-[var(--color-warning)]/10 text-[var(--color-warning)]',
        },
        {
            title: t('common.completed_tasks'),
            value: stats.completedTasks,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'bg-[var(--color-success)]/10 text-[var(--color-success)]',
        },
    ];

    return (
        <Layout title={t('common.admin_dashboard')}>
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">{t('common.admin_dashboard')}</h1>
                        <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t('common.overview_stats')}</p>
                    </div>

                    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                        {statCards.map((stat, index) => (
                            <Card key={index} padding="md" hover className="flex items-center gap-4">
                                <div className={`flex-shrink-0 w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                                    {stat.icon}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium text-[var(--color-text-secondary)] mb-1">{stat.title}</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{stat.value}</p>
                                </div>
                            </Card>
                        ))}
                    </div>

                    {/* Quick Actions */}
                    <div className="mt-8">
                        <h2 className="text-xl font-bold text-[var(--color-text-primary)] mb-4">{t('common.quick_actions')}</h2>
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            <Link href="/projects">
                                <Card padding="md" hover className="h-full">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-info)]/10 text-[var(--color-info)] flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('common.manage_projects')}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{t('common.view_and_manage_projects')}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Card>
                            </Link>

                            <Link href="/admin/users">
                                <Card padding="md" hover className="h-full">
                                    <div className="flex items-center gap-4">
                                        <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                            </svg>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-sm font-medium text-[var(--color-text-primary)]">{t('common.manage_users')}</p>
                                            <p className="text-xs text-[var(--color-text-secondary)] mt-1">{t('common.view_and_manage_users')}</p>
                                        </div>
                                        <svg className="w-5 h-5 text-[var(--color-text-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                </Card>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
}
