import { Head, Link, router, usePage } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Button from './Button';
import { Toaster } from './ui/sonner';
import { useFlashMessages } from '../hooks/useFlashMessages';
import { useTranslation } from '../hooks/useTranslation';

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
    url?: string;
    [key: string]: unknown;
}

interface LayoutProps {
    children: React.ReactNode;
    title?: string;
}

export default function Layout({ children, title }: LayoutProps) {
    useFlashMessages();
    const { auth, url, locale } = usePage<PageProps>().props;
    const user = auth?.user;
    const { t } = useTranslation();
    
    // Extract pathname from full URL
    const getPathname = (fullUrl: string | undefined): string => {
        if (!fullUrl) {
            return typeof window !== 'undefined' ? window.location.pathname : '';
        }
        try {
            const urlObj = new URL(fullUrl);
            return urlObj.pathname;
        } catch {
            // If it's already a pathname, return as is
            return fullUrl;
        }
    };
    
    const currentPath = getPathname(url);

    const isActive = (path: string) => {
        if (path === '/admin') {
            return currentPath === '/admin' || currentPath === '/admin/';
        }
        return currentPath.startsWith(path);
    };

    const handleLogout: FormEventHandler = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    const handleLocaleChange = (newLocale: string) => {
        router.visit(`/locale/${newLocale}`, {
            preserveState: true,
            preserveScroll: true,
        });
    };

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen bg-[var(--color-bg-secondary)] flex flex-col">
                <nav className="bg-[var(--color-bg-primary)] border-b border-[var(--color-border-primary)] shadow-sm">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex justify-between h-16">
                            <div className="flex">
                                <div className="flex-shrink-0 flex items-center">
                                    <Link 
                                        href={user ? (user.is_admin ? "/admin" : "/projects") : "/"} 
                                        className="flex items-center gap-2 group"
                                    >
                                        <div className="w-8 h-8 bg-[var(--color-primary)] rounded-lg flex items-center justify-center group-hover:bg-[var(--color-primary-dark)] transition-colors">
                                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-xl font-bold text-[var(--color-text-primary)]">{t('common.app_name')}</span>
                                    </Link>
                                </div>
                                {user && (
                                    <div className="hidden sm:ml-8 sm:flex sm:space-x-1">
                                        {user.is_admin && (
                                            <Link
                                                href="/admin"
                                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    isActive('/admin') && !isActive('/admin/users')
                                                        ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]'
                                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                                                }`}
                                            >
                                                {t('common.admin')}
                                            </Link>
                                        )}
                                        <Link
                                            href="/projects"
                                            className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                isActive('/projects')
                                                    ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]'
                                                    : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                                            }`}
                                        >
                                            {t('common.projects')}
                                        </Link>
                                        {user.is_admin && (
                                            <Link
                                                href="/admin/users"
                                                className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                                                    isActive('/admin/users')
                                                        ? 'text-[var(--color-primary)] bg-[var(--color-primary-light)]'
                                                        : 'text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] hover:bg-[var(--color-primary-light)]'
                                                }`}
                                            >
                                                {t('common.users')}
                                            </Link>
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex items-center gap-3">
                                <div className="hidden sm:flex items-center">
                                    <select
                                        value={locale || 'en'}
                                        onChange={(e) => handleLocaleChange(e.target.value)}
                                        className="px-3 py-1.5 text-sm rounded-lg border border-[var(--color-border-primary)] bg-[var(--color-bg-primary)] text-[var(--color-text-primary)] focus:border-[var(--color-primary)] focus:ring-[var(--color-primary)] transition-colors"
                                    >
                                        <option value="en">{t('common.english')}</option>
                                        <option value="es">{t('common.spanish')}</option>
                                    </select>
                                </div>
                                {user ? (
                                    <>
                                        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[var(--color-primary-light)]">
                                            <div className="w-8 h-8 bg-[var(--color-primary)] rounded-full flex items-center justify-center text-white text-sm font-semibold">
                                                {user.name.charAt(0).toUpperCase()}
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-sm font-medium text-[var(--color-text-primary)]">{user.name}</span>
                                                <span className="text-xs text-[var(--color-text-secondary)]">{user.email}</span>
                                            </div>
                                        </div>
                                        <form onSubmit={handleLogout}>
                                            <Button type="submit" variant="ghost" size="sm">
                                                {t('common.logout')}
                                            </Button>
                                        </form>
                                    </>
                                ) : (
                                    <>
                                        <Link href="/login">
                                            <Button variant="ghost" size="sm">
                                                {t('common.login')}
                                            </Button>
                                        </Link>
                                        <Link href="/register">
                                            <Button variant="primary" size="sm">
                                                {t('common.register')}
                                            </Button>
                                        </Link>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </nav>
                <main className="py-10 flex-1">{children}</main>
                <footer className="bg-[var(--color-bg-primary)] border-t border-[var(--color-border-primary)] mt-auto">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                            <div className="text-sm text-[var(--color-text-secondary)]">
                                <p>&copy; {new Date().getFullYear()} {t('common.app_name')}. {t('common.copyright')}</p>
                            </div>
                            <div className="flex items-center gap-4 text-sm text-[var(--color-text-secondary)]">
                                <span>{t('common.built_with')}</span>
                            </div>
                        </div>
                    </div>
                </footer>
                <Toaster position="top-right" richColors />
            </div>
        </>
    );
}
