'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema, RegisterFormValues } from '@/lib/validators';
import { useAuth } from '@/hooks/useAuth';
import { useRouter } from 'next/navigation';

export default function RegisterForm() {
  const { register: registerUser, error, isLoading } = useAuth();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema) as any,
    defaultValues: {
      name: '',
      email: '',
      password: '',
      city: '',
    },
  });

  async function onSubmit(values: RegisterFormValues) {
    const result = await registerUser(values);
    if (result.success) {
      router.push('/products');
    }
  }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border p-6">
        <div>
            <label className="mb-1 block text-sm font-medium">Name</label>
            <input className="w-full rounded border p-2" {...register('name')} />
            {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>}
        </div>
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
        <div>
            <label className="mb-1 block text-sm font-medium">Age</label>
            <input type="number" className="w-full rounded border p-2" {...register('age')} />
        </div>
        <div>
            <label className="mb-1 block text-sm font-medium">City</label>
            <input className="w-full rounded border p-2" {...register('city')} />
            {errors.city && <p className="mt-1 text-sm text-red-600">{errors.city.message}</p>}
        </div>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="submit" disabled={isLoading} className="rounded bg-black px-4 py-2 text-white">
            {isLoading ? 'Creating account...' : 'Register'}
        </button>
        </form>
    );
}