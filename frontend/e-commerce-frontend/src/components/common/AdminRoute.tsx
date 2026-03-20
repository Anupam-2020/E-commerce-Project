'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function AdminRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading, user } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && (!isAuthenticated || user?.role !== 'admin')) {
        router.replace('/products');
        }
    }, [isAuthenticated, isLoading, user, router]);

    if (isLoading) return <p>Loading...</p>;
    if (!isAuthenticated || user?.role !== 'admin') return null;
    return <>{children}</>;
}