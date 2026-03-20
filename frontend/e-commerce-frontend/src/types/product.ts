export interface Product {
    id: number;
    name: string;
    category: string;
    price: number;
    is_active?: boolean;
    quantity: number;
    reserved_quantity?: number;
}