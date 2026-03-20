'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import ProtectedRoute from '@/components/common/ProtectedRoute';

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const { data } = await api.get(endpoints.orders.detail(params.id));
        setOrder(data);
      } finally {
        setLoading(false);
      }
    }
    if (params?.id) fetchOrder();
  }, [params]);

  return (
    <ProtectedRoute>
      {loading ? (
        <p>Loading...</p>
      ) : order ? (
        <div className="space-y-4">
          <h1 className="text-2xl font-bold">Order #{order.id}</h1>
          <p>Total: Rs. {order.total_amount}</p>
          <p>Status: {order.status}</p>
          <p>Payment: {order.payment_status}</p>
          <div className="rounded border p-4">
          <h2 className="mb-3 text-lg font-semibold">Items</h2>
            <div className="space-y-2">
              {order.items?.map((item: any) => (
                <div key={item.id} className="flex justify-between">
                  <span>{item.product_name} x {item.quantity}</span>
                  <span>Rs. {item.line_total}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <p>Order not found.</p>
      )}
    </ProtectedRoute>
  );
}