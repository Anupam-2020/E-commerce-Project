import Link from 'next/link';
import AdminRoute from '@/components/common/AdminRoute';

export default function AdminPage() {
  return (
    <AdminRoute>
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Admin Dashboard</h1>
        <Link href="/admin/products/create" className="inline-block rounded bg-black px-4 py-2 text-white">
          Create Product
        </Link>
      </div>
    </AdminRoute>
  );
}