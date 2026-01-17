import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';
import { toast } from 'sonner';
import Layout from '../../../components/Layout';
import Card from '../../../components/Card';
import Button from '../../../components/Button';
import { useTranslation } from '../../../hooks/useTranslation';

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    is_admin: boolean;
    created_at: string;
    projects_count: number;
    tasks_count: number;
}

interface UsersIndexProps {
    users: User[];
}

export default function Index({ users }: UsersIndexProps) {
    const { t } = useTranslation();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleToggleStatus = (userId: number, userName: string, isActive: boolean) => {
        toast(t('common.confirm_change_status'), {
            title: isActive ? t('common.deactivate_user') : t('common.activate_user'),
            description: t('common.action_will_affect_user').replace(':name', userName),
            action: {
                label: t('common.confirm'),
                onClick: () => {
                    router.patch(`/admin/users/${userId}/toggle-status`, {}, {
                        preserveScroll: true,
                        onError: () => {
                            toast.error(t('common.operation_failed'));
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

    const handleDeleteUser = (userId: number, userName: string) => {
        toast(t('common.confirm_delete_user').replace(':name', userName), {
            title: t('common.delete_user'),
            description: t('common.action_cannot_undo'),
            action: {
                label: t('common.delete'),
                onClick: () => {
                    router.delete(`/admin/users/${userId}`, {
                        preserveScroll: true,
                        onError: () => {
                            toast.error(t('common.operation_failed'));
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
        <Layout title={t('common.users_management')}>
            <Head title={`${t('common.users')} - ${t('common.admin')}`} />
            
            <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    {/* Header */}
                    <div className="mb-8">
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-[var(--color-text-primary)]">
                                    {t('common.users_management')}
                                </h1>
                                <p className="mt-1 text-sm text-[var(--color-text-secondary)]">
                                    {t('common.manage_system_users')}
                                </p>
                            </div>
                            <Link href="/admin">
                                <Button variant="secondary">
                                    ← {t('common.back_to_dashboard')}
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-1 gap-6 mb-8 sm:grid-cols-3">
                        <Card padding="md">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-primary-light)] text-[var(--color-primary)] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{t('common.total_users')}</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">{users.length}</p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-success)]/10 text-[var(--color-success)] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{t('common.active_users')}</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                        {users.filter(u => u.is_active).length}
                                    </p>
                                </div>
                            </div>
                        </Card>

                        <Card padding="md">
                            <div className="flex items-center gap-4">
                                <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-[var(--color-error)]/10 text-[var(--color-error)] flex items-center justify-center">
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                    </svg>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--color-text-secondary)]">{t('common.inactive_users')}</p>
                                    <p className="text-2xl font-bold text-[var(--color-text-primary)]">
                                        {users.filter(u => !u.is_active).length}
                                    </p>
                                </div>
                            </div>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card padding="md" className="mb-6">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder={t('common.search_users')}
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 pl-10 border border-[var(--color-border)] rounded-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)]"
                            />
                            <svg
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-[var(--color-text-secondary)]"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </Card>

                    {/* Users Table */}
                    <Card>
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-[var(--color-border)]">
                                <thead className="bg-[var(--color-bg-secondary)]">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.user')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.email')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.role')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.status')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.projects')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.tasks')}
                                        </th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.registration_date')}
                                        </th>
                                        <th className="px-6 py-3 text-right text-xs font-medium text-[var(--color-text-secondary)] uppercase tracking-wider">
                                            {t('common.actions')}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="bg-[var(--color-bg-primary)] divide-y divide-[var(--color-border)]">
                                    {filteredUsers.length === 0 ? (
                                        <tr>
                                            <td colSpan={8} className="px-6 py-12 text-center text-[var(--color-text-secondary)]">
                                                {t('common.no_users_found')}
                                            </td>
                                        </tr>
                                    ) : (
                                        filteredUsers.map((user) => (
                                            <tr key={user.id} className="hover:bg-[var(--color-bg-secondary)] transition-colors">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="flex items-center">
                                                        <div className="flex-shrink-0 h-10 w-10 bg-[var(--color-primary-light)] text-[var(--color-primary)] rounded-full flex items-center justify-center font-semibold">
                                                            {user.name.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div className="ml-4">
                                                            <div className="text-sm font-medium text-[var(--color-text-primary)]">
                                                                {user.name}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-[var(--color-text-secondary)]">{user.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        user.is_admin
                                                            ? 'bg-[var(--color-primary-light)] text-[var(--color-primary)]'
                                                            : 'bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)]'
                                                    }`}>
                                                        {user.is_admin ? t('common.admin_role') : t('common.user_role')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                                        user.is_active
                                                            ? 'bg-[var(--color-success)]/10 text-[var(--color-success)]'
                                                            : 'bg-[var(--color-error)]/10 text-[var(--color-error)]'
                                                    }`}>
                                                        {user.is_active ? t('common.active') : t('common.inactive')}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {user.projects_count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {user.tasks_count}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-[var(--color-text-secondary)]">
                                                    {user.created_at}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <button
                                                            onClick={() => handleToggleStatus(user.id, user.name, user.is_active)}
                                                            className={`inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
                                                                user.is_active
                                                                    ? 'bg-[var(--color-warning)]/10 text-[var(--color-warning)] hover:bg-[var(--color-warning)]/20'
                                                                    : 'bg-[var(--color-success)]/10 text-[var(--color-success)] hover:bg-[var(--color-success)]/20'
                                                            }`}
                                                        >
                                                            {user.is_active ? t('common.deactivate') : t('common.activate')}
                                                        </button>
                                                        <button
                                                            onClick={() => handleDeleteUser(user.id, user.name)}
                                                            className="inline-flex items-center px-3 py-1.5 rounded-md text-xs font-medium bg-[var(--color-error)]/10 text-[var(--color-error)] hover:bg-[var(--color-error)]/20 transition-colors"
                                                        >
                                                            {t('common.delete')}
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
