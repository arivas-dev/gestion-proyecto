import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

export default function Register() {
    const { data, setData, post, processing, errors } = useForm({
        name: '',
        email: '',
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/register');
    };

    return (
        <Layout title="Register">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-primary-light)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card padding="lg" className="shadow-xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                Create your account
                            </h2>
                            <p className="text-[var(--color-text-secondary)]">
                                Already have an account?{' '}
                                <Link href="/login" className="font-semibold text-[var(--color-primary)] hover:text-[var(--color-primary-dark)] transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </div>
                        <form className="space-y-5" onSubmit={submit}>
                            <Input
                                id="name"
                                name="name"
                                type="text"
                                label="Full name"
                                required
                                value={data.name}
                                onChange={(e) => setData('name', e.target.value)}
                                placeholder="John Doe"
                                error={errors.name}
                            />

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
                                autoComplete="new-password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Create a strong password"
                                error={errors.password}
                                helperText="Must be at least 8 characters"
                            />

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                label="Confirm password"
                                autoComplete="new-password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your password"
                                error={errors.password_confirmation}
                            />

                            <Button
                                type="submit"
                                variant="primary"
                                size="lg"
                                className="w-full"
                                isLoading={processing}
                                disabled={processing}
                            >
                                Create account
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
