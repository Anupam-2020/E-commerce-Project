'use client';

import Link from 'next/link';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const { items } = useCart();

  return (
    <header className="border-b">
      <nav className="mx-auto flex max-w-6xl items-center justify-between p-4">
        <div className="flex gap-4">
          <Link href="/">Home</Link>
          <Link href="/products">Products</Link>
          <Link href="/cart">Cart ({items.length})</Link>
          {isAuthenticated && <Link href="/orders">Orders</Link>}
          {user?.role === 'admin' && <Link href="/admin">Admin</Link>}
        </div>

        <div className="flex gap-4">
          {isAuthenticated ? (
            <>
              <span>{user?.name}</span>
              <button onClick={logout}>Logout</button>
            </>
          ) : (
            <>
              <Link href="/login">Login</Link>
              <Link href="/register">Register</Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
}