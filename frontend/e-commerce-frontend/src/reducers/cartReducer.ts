import { CART_ACTIONS } from '@/constants/actionTypes';
import { CartItem } from '@/types/cart';

export interface CartState {
  items: CartItem[];
}

export const initialCartState: CartState = {
  items: [],
};

type CartAction =
  | { type: typeof CART_ACTIONS.ADD_TO_CART; payload: CartItem }
  | { type: typeof CART_ACTIONS.REMOVE_FROM_CART; payload: number }
  | { type: typeof CART_ACTIONS.UPDATE_QTY; payload: { id: number; quantity: number } }
  | { type: typeof CART_ACTIONS.CLEAR_CART };

export function cartReducer(state: CartState, action: CartAction): CartState {
  switch (action.type) {
    case CART_ACTIONS.ADD_TO_CART: {
      const existing = state.items.find((item) => item.id === action.payload.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map((item) =>
            item.id === action.payload.id
              ? { ...item, quantity: item.quantity + action.payload.quantity }
              : item
          ),
        };
      }
      return { ...state, items: [...state.items, action.payload] };
    }
    case CART_ACTIONS.REMOVE_FROM_CART:
      return { ...state, items: state.items.filter((item) => item.id !== action.payload) };
    case CART_ACTIONS.UPDATE_QTY:
      return {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id ? { ...item, quantity: action.payload.quantity } : item
        ),
      };
    case CART_ACTIONS.CLEAR_CART:
      return initialCartState;
    default:
      return state;
  }
}