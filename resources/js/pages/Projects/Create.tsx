import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import { toast } from 'sonner';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useTranslation } from '../../hooks/useTranslation';

export default function Create() {
    const { t } = useTranslation();
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        description: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/projects', {
            onError: () => {
                toast.error(t('common.failed_to_create_project'));
            },
        });
    };

    return (
        <Layout title={t('common.create_new_project')}>
            <div className="max-w-3xl mx-auto sm:px-6 lg:px-8">
                <div className="px-4 py-8 sm:px-0">
                    <div className="mb-6">
                        <Link href="/projects" className="inline-flex items-center text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {t('common.back_to_projects')}
                        </Link>
                    </div>

                    <Card padding="lg">
                        <div className="mb-6">
                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)]">{t('common.create_new_project')}</h1>
                            <p className="mt-1 text-sm text-[var(--color-text-secondary)]">{t('common.start_new_project')}</p>
                        </div>

                        <form onSubmit={submit} className="space-y-6">
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                label={t('common.project_name')}
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder={t('common.enter_project_name')}
                                error={errors.name}
                            />

                            <Input
                                id="description"
                                name="description"
                                as="textarea"
                                label={t('common.description')}
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder={t('common.describe_project')}
                                error={errors.description}
                                rows={4}
                            />

                            <div className="flex justify-end gap-3 pt-4 border-t border-[var(--color-border-primary)]">
                                <Link href="/projects">
                                    <Button type="button" variant="outline">
                                        {t('common.cancel')}
                                    </Button>
                                </Link>
                                <Button
                                    type="submit"
                                    variant="primary"
                                    isLoading={processing}
                                    disabled={processing}
                                >
                                    {t('common.create')} {t('common.project')}
                                </Button>
                            </div>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
