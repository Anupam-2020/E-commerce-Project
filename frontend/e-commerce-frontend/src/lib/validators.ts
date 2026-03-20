import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Enter a valid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  age: z.coerce.number().int().positive().optional(),
  city: z.string().min(2, 'City is required'),
});

export const productSchema = z.object({
  name: z.string().min(2, 'Product name is required'),
  category: z.string().min(2, 'Category is required'),
  price: z.coerce.number().positive('Price must be greater than 0'),
  quantity: z.coerce.number().int().min(0, 'Quantity cannot be negative'),
});

export const checkoutSchema = z.object({
  shipping_address: z.string().min(8, 'Shipping address is too short'),
  payment_method: z.enum(['card', 'upi', 'netbanking', 'cod']),
});

export type LoginFormValues = z.infer<typeof loginSchema>;
export type RegisterFormValues = z.infer<typeof registerSchema>;
export type ProductFormValues = z.infer<typeof productSchema>;
export type CheckoutFormValues = z.infer<typeof checkoutSchema>;