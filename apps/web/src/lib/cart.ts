// Pure cart logic. Lives in src/lib (coverage-gated to 100%) so the shopping
// behaviour is verified independently of React. The CartProvider in
// src/storefront/cart wires these reducers to React state + localStorage.

export type CartItem = {
  id: string;
  slug: string;
  name: string;
  price: number;
  meta: string;
  img: string;
  qty: number;
};

/** Adds an item, merging quantity into an existing line with the same id. */
export function addItem(
  items: CartItem[],
  item: Omit<CartItem, "qty">,
  qty = 1,
): CartItem[] {
  if (items.some((i) => i.id === item.id)) {
    return items.map((i) => (i.id === item.id ? { ...i, qty: i.qty + qty } : i));
  }
  return [...items, { ...item, qty }];
}

/** Removes a line entirely. */
export function removeItem(items: CartItem[], id: string): CartItem[] {
  return items.filter((i) => i.id !== id);
}

/** Sets a line's quantity; quantities at or below zero remove the line. */
export function setQty(items: CartItem[], id: string, qty: number): CartItem[] {
  if (qty <= 0) {
    return removeItem(items, id);
  }
  return items.map((i) => (i.id === id ? { ...i, qty } : i));
}

/** Total number of units across all lines (the nav badge count). */
export function cartCount(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.qty, 0);
}

/** Sum of price × quantity across all lines, in whole dollars. */
export function cartSubtotal(items: CartItem[]): number {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}
