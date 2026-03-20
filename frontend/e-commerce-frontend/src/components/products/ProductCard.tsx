'use client';

import { Product } from '@/types/product';
import { useCart } from '@/hooks/useCart';

export default function ProductCard({ product }: { product: Product }) {
    const { addToCart } = useCart();

    return (
        <div className="rounded-2xl border p-4">
        <h2 className="text-lg font-semibold">{product.name}</h2>
        <p className="text-sm text-gray-600">{product.category}</p>
        <p className="mt-2 font-medium">Rs. {product.price}</p>
        <p className="mt-1 text-sm">Stock: {product.quantity}</p>
        <button
            className="mt-3 rounded bg-black px-4 py-2 text-white disabled:opacity-50"
            onClick={() => addToCart(product, 1)}
            disabled={product.quantity <= 0}
        >
            {product.quantity > 0 ? 'Add to cart' : 'Out of stock'}
        </button>
        </div>
    );
}