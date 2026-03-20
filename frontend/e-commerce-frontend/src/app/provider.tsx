'use client';

import { ReactNode } from 'react';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { CartProvider } from '@/context/CartContext';

export default function Providers({ children }: { children: ReactNode }) {
    return (
        <AuthProvider>
        <ProductProvider>
            <CartProvider>{children}</CartProvider>
        </ProductProvider>
        </AuthProvider>
    );
}