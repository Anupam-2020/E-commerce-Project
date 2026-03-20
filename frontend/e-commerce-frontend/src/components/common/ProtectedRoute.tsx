'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';

export default function ProtectedRoute({ children }: { children: ReactNode }) {
    const { isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
        router.replace('/login');
        }
    }, [isAuthenticated, isLoading, router]);

    if (isLoading) return <p>Loading...</p>;
    if (!isAuthenticated) return null;
    return <>{children}</>;
}