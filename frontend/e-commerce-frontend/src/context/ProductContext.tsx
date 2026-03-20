'use client';

import { createContext, ReactNode, useEffect, useMemo, useReducer } from 'react';
import api from '@/lib/api';
import endpoints from '@/lib/endpoints';
import { productReducer, initialProductState } from '@/reducers/productReducer';
import { PRODUCT_ACTIONS } from '@/constants/actionTypes';
import { Product } from '@/types/product';

interface ProductContextValue {
    products: Product[];
    isLoading: boolean;
    error: string | null;
    fetchProducts: () => Promise<void>;
}

export const ProductContext = createContext<ProductContextValue | null>(null);

export function ProductProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(productReducer, initialProductState);

    async function fetchProducts() {
        dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_START });
        try {
        const { data } = await api.get(endpoints.products.list);
        dispatch({ type: PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS, payload: data });
        } catch (error: any) {
        dispatch({
            type: PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE,
            payload: error?.response?.data?.message || 'Failed to fetch products',
        });
        }
    }

    useEffect(() => {
        fetchProducts();
    }, []);

    const value = useMemo(() => ({ ...state, fetchProducts }), [state]);

    return <ProductContext.Provider value={value}>{children}</ProductContext.Provider>;
}