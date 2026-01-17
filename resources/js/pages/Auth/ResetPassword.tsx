import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
import Layout from '../../components/Layout';
import Input from '../../components/Input';
import Button from '../../components/Button';
import Card from '../../components/Card';

interface ResetPasswordProps {
    token: string;
    email: string;
}

export default function ResetPassword({ token, email }: ResetPasswordProps) {
    const { data, setData, post, processing, errors } = useForm({
        token: token,
        email: email,
        password: '',
        password_confirmation: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/reset-password');
    };

    return (
        <Layout title="Reset Password">
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[var(--color-bg-secondary)] to-[var(--color-primary-light)] py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-md w-full">
                    <Card padding="lg" className="shadow-xl">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                                Reset your password
                            </h2>
                            <p className="text-[var(--color-text-secondary)]">
                                Enter your new password below
                            </p>
                        </div>
                        <form className="space-y-5" onSubmit={submit}>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                label="Email address"
                                required
                                value={data.email}
                                onChange={(e) => setData('email', e.target.value)}
                                className="bg-[var(--color-bg-secondary)]"
                                readOnly
                                error={errors.email}
                            />

                            <Input
                                id="password"
                                name="password"
                                type="password"
                                label="New password"
                                autoComplete="new-password"
                                required
                                value={data.password}
                                onChange={(e) => setData('password', e.target.value)}
                                placeholder="Enter your new password"
                                error={errors.password}
                                helperText="Must be at least 8 characters"
                            />

                            <Input
                                id="password_confirmation"
                                name="password_confirmation"
                                type="password"
                                label="Confirm new password"
                                autoComplete="new-password"
                                required
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                                placeholder="Confirm your new password"
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
                                Reset password
                            </Button>
                        </form>
                    </Card>
                </div>
            </div>
        </Layout>
    );
}
