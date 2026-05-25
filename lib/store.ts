'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { DEFAULT_CURRENCY, type Currency } from './currency';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  selectedSize: string;
  quantity: number;
  image: string;
}

interface CartState {
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (productId: string, selectedSize: string) => void;
  updateQuantity: (productId: string, selectedSize: string, quantity: number) => void;
  clearCart: () => void;
  cartCount: () => number;
  cartTotal: () => number;
}

// ─── Currency store ───────────────────────────────────────────────────────────
interface CurrencyState {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
}

export const useCurrencyStore = create<CurrencyState>()(
  persist(
    (set) => ({
      currency: DEFAULT_CURRENCY,
      setCurrency: (currency) => set({ currency }),
    }),
    { name: 'bantuwear-currency' }
  )
);

// ─── Cart store ───────────────────────────────────────────────────────────────
export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      addToCart: (item) =>
        set((state) => {
          const existingIndex = state.cart.findIndex(
            (i) => i.productId === item.productId && i.selectedSize === item.selectedSize
          );
          if (existingIndex > -1) {
            const updated = [...state.cart];
            updated[existingIndex].quantity += item.quantity;
            return { cart: updated };
          }
          return { cart: [...state.cart, item] };
        }),
      removeFromCart: (productId, selectedSize) =>
        set((state) => ({
          cart: state.cart.filter(
            (i) => !(i.productId === productId && i.selectedSize === selectedSize)
          ),
        })),
      updateQuantity: (productId, selectedSize, quantity) =>
        set((state) => ({
          cart: state.cart.map((i) =>
            i.productId === productId && i.selectedSize === selectedSize ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'bantuwear-cart' }
  )
);
