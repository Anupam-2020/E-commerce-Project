'use client';

import { useEffect, useState } from 'react';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import ProtectedRoute from '@/components/common/ProtectedRoute';
import { Order } from '@/types/order';

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data } = await api.get(endpoints.orders.my);
        // backend returns { orders: [...] } — accept either shape
        const ordersPayload = Array.isArray(data) ? data : data?.orders;
        setOrders(ordersPayload || []);
        // setOrders(data || []);
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  console.log('Fetched orders:', orders);

  return (
    <ProtectedRoute>
      <div>
        <h1 className="mb-6 text-2xl font-bold">My Orders</h1>
        {loading ? (
          <p>Loading...</p>
        ) : (
          <div className="space-y-4">
            {orders && orders.length !== 0 ? orders.map((order) => (
              <div key={order.id} className="rounded border p-4">
                <p className="font-semibold">Order #{order.id}</p>
                <p>Total: Rs. {order.total_amount}</p>
                <p>Status: {order.status}</p>
                <p>Payment: {order.payment_status}</p>
              </div>
            )) : <p>You have no orders yet.</p>}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}