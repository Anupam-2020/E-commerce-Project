export interface OrderItemPayload {
  product_id: number;
  quantity: number;
}

export interface CreateOrderPayload {
  shipping_address: string;
  items: OrderItemPayload[];
}

export interface Order {
  id: number;
  total_amount: number;
  status: string;
  payment_status: string;
  shipping_address: string;
  created_at: string;
}