'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, ProductFormValues } from '@/lib/validators';

export default function ProductForm({
  onSubmit,
  isSubmitting,
}: {
  onSubmit: (values: ProductFormValues) => Promise<void>;
  isSubmitting: boolean;
}) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productSchema) as any,
    defaultValues: {
      name: '',
      category: '',
      price: 0,
      quantity: 0,
    },
  });
  
return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border p-6">
      <div>
        <label className="mb-1 block text-sm font-medium">Name</label>
        <input className="w-full rounded border p-2" {...register('name')} />
        {errors.name && <p className="text-sm text-red-600">{errors.name.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Category</label>
        <input className="w-full rounded border p-2" {...register('category')} />
        {errors.category && <p className="text-sm text-red-600">{errors.category.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Price</label>
        <input type="number" step="0.01" className="w-full rounded border p-2" {...register('price')} />
        {errors.price && <p className="text-sm text-red-600">{errors.price.message}</p>}
      </div>
      <div>
        <label className="mb-1 block text-sm font-medium">Quantity</label>
        <input type="number" className="w-full rounded border p-2" {...register('quantity')} />
        {errors.quantity && <p className="text-sm text-red-600">{errors.quantity.message}</p>}
      </div>
      <button type="submit" disabled={isSubmitting} className="rounded bg-black px-4 py-2 text-white">
        {isSubmitting ? 'Saving...' : 'Create Product'}
      </button>
    </form>
  );
}