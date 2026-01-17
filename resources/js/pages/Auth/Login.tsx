import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Checkbox from '../../components/Checkbox';
import Card from '../../components/Card';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
        remember: false,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <Layout title="Login">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-primary-light)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card padding="lg" className="shadow-xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                Welcome back
                            </h2>
                            <p className="text-[var(--color-text-secondary)]">
                                Sign in to your account or{' '}
                                <Link href="/register" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                                    create a new account
                                </Link>
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

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="Password"
                                autoComplete="current-password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your password"
                                error={errors.password}
                            />

                            <div className="flex items-center justify-between">
                                <Checkbox
                                    id="remember"
                                    name="remember"
                                    label="Remember me"
                                    checked={data.remember}
                                    onChange={(e) => setData('remember', e.target.checked)}
                                />
                                <Link href="/forgot-password" className="text-sm font-medium text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                                    Forgot password?
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
                                Sign in
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
