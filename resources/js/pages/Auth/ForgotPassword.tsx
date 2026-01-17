import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';
import { useFlashMessages } from '../../hooks/useFlashMessages';

export default function ForgotPassword() {
    useFlashMessages();
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/forgot-password', {
            preserveScroll: true,
        });
    };

    return (
        <Layout title="Forgot Password">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-primary-light)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card padding="lg" className="shadow-xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                Reset your password
                            </h2>
                            <p className="text-[var(--color-text-secondary)]">
                                Enter your email address and we'll send you a link to reset your password.
                            </p>
                        </div>
                        <form className="space-y-6" onSubmit={submit}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                autoComplete="email"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                placeholder="you@example.com"
                                error={errors.email}
                            />

                            <div className="flex items-center justify-between">
                                <Link href="/login" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                                    ← Back to login
                                </Link>
                            </div>

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={processing}
                                disabled={processing}
                            >
                                Send reset link
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
