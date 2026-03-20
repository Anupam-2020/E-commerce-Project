'use client';

import Link from 'next/link';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items, cartTotal, removeFromCart, updateQuantity } = useCart();

  return (
    <div>
      <h1 className="mb-6 text-2xl font-bold">Cart</h1>
      {items.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {items.map((item) => (
            <div key={item.id} className="flex items-center justify-between rounded border p-4 gap-4">
              <div>
                <p className="font-semibold">{item.name}</p>
                <p>Rs. {item.price}</p>
              </div>
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) => updateQuantity(item.id, Number(e.target.value))}
                className="w-20 rounded border p-2"
              />
              <button onClick={() => removeFromCart(item.id)} className="text-red-600">Remove</button>
            </div>
          ))}
          <div className="rounded border p-4">
          <p className="text-lg font-semibold">Total: Rs. {cartTotal}</p>
            <Link href="/checkout" className="mt-3 inline-block rounded bg-black px-4 py-2 text-white">
              Proceed to Checkout
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}