'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkoutSchema, CheckoutFormValues } from '@/lib/validators';
import { useCart } from '@/hooks/useCart';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function CheckoutPage() {
    const { items, clearCart } = useCart();
    const router = useRouter();

    const {
      register,
      handleSubmit,
      formState: { errors, isSubmitting },
    } = useForm<CheckoutFormValues>({
      resolver: zodResolver(checkoutSchema),
      defaultValues: {
        shipping_address: '',
        payment_method: 'upi',
      },
    });

    async function onSubmit(values: CheckoutFormValues) {
      const orderPayload = {
        shipping_address: values.shipping_address,
        items: items.map((item) => ({ product_id: item.id, quantity: item.quantity })),
      };
    const orderRes = await api.post(endpoints.orders.create, orderPayload);

      await api.post(endpoints.payments.create, {
        order_id: orderRes.data.orderId,
        payment_method: values.payment_method,
        transaction_ref: `TXN_${Date.now()}`,
      });

      clearCart();
      router.push(`/orders/${orderRes.data.orderId}`);
    }

    return (
      <ProtectedRoute>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 rounded-2xl border p-6">
          <div>
            <label className="mb-1 block text-sm font-medium">Shipping Address</label>
            <textarea className="w-full rounded border p-2" {...register('shipping_address')} />
            {errors.shipping_address && <p className="mt-1 text-sm text-red-600">{errors.shipping_address.message}</p>}
          </div>
          <div>
            <label className="mb-1 block text-sm font-medium">Payment Method</label>
            <select className="w-full rounded border p-2" {...register('payment_method')}>
              <option value="upi">UPI</option>
              <option value="card">Card</option>
              <option value="netbanking">Netbanking</option>
              <option value="cod">Cash on Delivery</option>
            </select>
          </div>
          <button type="submit" disabled={isSubmitting} className="rounded bg-black px-4 py-2 text-white">
            {isSubmitting ? 'Placing order...' : 'Place Order'}
          </button>
        </form>
      </ProtectedRoute>
    );
}