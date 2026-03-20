'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema, LoginFormValues } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function LoginForm() {
    const { login, error, isLoading } = useAuth();
    const router = useRouter();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
        email: '',
        password: '',
        },
    });

    async function onSubmit(values: LoginFormValues) {
        const result = await login(values);
        if (result.success) {
        router.push('/products');
        }
    }
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border p-6">
        <div>
            <label className="mb-1 block text-sm font-medium">Email</label>
            <input className="w-full rounded border p-2" {...register('email')} />
            {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
        </div>
        <div>
            <label className="mb-1 block text-sm font-medium">Password</label>
            <input type="password" className="w-full rounded border p-2" {...register('password')} />
            {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isLoading} className="rounded bg-black px-4 py-2 text-white">
            {isLoading ? 'Logging in...' : 'Login'}
        </button>
        </form>
    );
}