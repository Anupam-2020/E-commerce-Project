'use client';

import { createContext, ReactNode, useMemo, useReducer } from 'react';
import { cartReducer, initialCartState } from '@/reducers/cartReducer';
import { CART_ACTIONS } from '@/constants/actionTypes';
import { Product } from '@/types/product';

interface CartContextValue {
    items: { id: number; name: string; price: number; quantity: number }[];
    cartTotal: number;
    addToCart: (product: Product, quantity?: number) => void;
    removeFromCart: (id: number) => void;
    updateQuantity: (id: number, quantity: number) => void;
    clearCart: () => void;
}

export const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(cartReducer, initialCartState);

    const addToCart = (product: Product, quantity = 1) => {
        dispatch({
        type: CART_ACTIONS.ADD_TO_CART,
        payload: {
            id: product.id,
            name: product.name,
            price: Number(product.price),
            quantity,
        },
        });
    };

    const removeFromCart = (id: number) => {
        dispatch({ type: CART_ACTIONS.REMOVE_FROM_CART, payload: id });
    };

    const updateQuantity = (id: number, quantity: number) => {
        dispatch({ type: CART_ACTIONS.UPDATE_QTY, payload: { id, quantity } });
    };

    const clearCart = () => dispatch({ type: CART_ACTIONS.CLEAR_CART });

    const cartTotal = state.items.reduce((sum, item) => sum + item.price * item.quantity, 0);

    const value = useMemo(
        () => ({ items: state.items, cartTotal, addToCart, removeFromCart, updateQuantity, clearCart }),
        [state.items, cartTotal]
    );

    return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}