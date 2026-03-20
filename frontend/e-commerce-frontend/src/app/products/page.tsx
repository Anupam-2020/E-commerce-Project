'use client';

import ProductCard from '@/components/products/ProductCard';
import { useProducts } from '@/hooks/useProduct';

export default function ProductsPage() {
  const { products, isLoading, error } = useProducts();

  if (isLoading) return <p>Loading products...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Products</h1>
      <div className="grid gap-4 md:grid-cols-3">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}