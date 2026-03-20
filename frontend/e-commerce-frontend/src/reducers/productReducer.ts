import { PRODUCT_ACTIONS } from '@/constants/actionTypes';
import { Product } from '@/types/product';

export interface ProductState {
  products: Product[];
  isLoading: boolean;
  error: string | null;
}

export const initialProductState: ProductState = {
  products: [],
  isLoading: false,
  error: null,
};

type ProductAction =
  | { type: typeof PRODUCT_ACTIONS.FETCH_PRODUCTS_START }
  | { type: typeof PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS; payload: Product[] }
  | { type: typeof PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE; payload: string };

export function productReducer(state: ProductState, action: ProductAction): ProductState {
  switch (action.type) {
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_START:
      return { ...state, isLoading: true, error: null };
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_SUCCESS:
      return { ...state, isLoading: false, products: action.payload, error: null };
    case PRODUCT_ACTIONS.FETCH_PRODUCTS_FAILURE:
      return { ...state, isLoading: false, error: action.payload };
    default:
      return state;
  }
}