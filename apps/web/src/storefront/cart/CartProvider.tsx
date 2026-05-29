"use client";

// Client-side cart: wires the pure reducers in src/lib/cart.ts to React state
// and persists to localStorage. No checkout — the flow ends at /cart.

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  addItem,
  removeItem,
  setQty as setQtyReducer,
  cartCount,
  cartSubtotal,
  type CartItem,
} from "@/lib/cart";

type CartContextValue = {
  items: CartItem[];
  add: (item: Omit<CartItem, "qty">, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  count: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const STORAGE_KEY = "grove.cart.v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  // Hydrate once on mount (localStorage isn't available during SSR).
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        setItems(JSON.parse(raw) as CartItem[]);
      }
    } catch {
      // Corrupt/unavailable storage — start with an empty cart.
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Ignore storage write failures (private mode, quota, etc.).
    }
  }, [items]);

  const value: CartContextValue = {
    items,
    add: (item, qty = 1) => setItems((cur) => addItem(cur, item, qty)),
    remove: (id) => setItems((cur) => removeItem(cur, id)),
    setQty: (id, qty) => setItems((cur) => setQtyReducer(cur, id, qty)),
    clear: () => setItems([]),
    count: cartCount(items),
    subtotal: cartSubtotal(items),
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart(): CartContextValue {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}
