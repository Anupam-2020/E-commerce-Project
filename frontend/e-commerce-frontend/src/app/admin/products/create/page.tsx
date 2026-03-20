'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import AdminRoute from '@/components/common/AdminRoute';
import ProductForm from '@/components/forms/ProductForm';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import { ProductFormValues } from '@/lib/validators';

export default function CreateProductPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(values: ProductFormValues) {
    try {
      setIsSubmitting(true);
      await api.post(endpoints.products.create, values);
      router.push('/products');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AdminRoute>
      <div className="mx-auto max-w-lg">
        <h1 className="mb-4 text-2xl font-bold">Create Product</h1>
        <ProductForm onSubmit={onSubmit} isSubmitting={isSubmitting} />
      </div>
    </AdminRoute>
  );
}