'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  productId: string;
  name: string;
  price: number;
  selectedSize: string;
  quantity: number;
  image: string;
}

export interface User {
  id: string;
  email: string;
  role: 'ADMIN' | 'CUSTOMER';
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

interface UserState {
  user: User | null;
  setUser: (user: User | null) => void;
  logout: () => void;
}

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
            i.productId === productId && i.selectedSize === selectedSize
              ? { ...i, quantity }
              : i
          ),
        })),
      clearCart: () => set({ cart: [] }),
      cartCount: () => get().cart.reduce((sum, item) => sum + item.quantity, 0),
      cartTotal: () => get().cart.reduce((sum, item) => sum + item.price * item.quantity, 0),
    }),
    { name: 'bantuwear-cart' }
  )
);

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
      logout: () => set({ user: null }),
    }),
    { name: 'bantuwear-user' }
  )
);
