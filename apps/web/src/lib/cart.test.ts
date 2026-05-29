import { describe, it, expect } from "vitest";
import {
  addItem,
  removeItem,
  setQty,
  cartCount,
  cartSubtotal,
  type CartItem,
} from "./cart";

const base = { slug: "sour-grapes", name: "Sour Grapes", price: 44, meta: "1g vape", img: "x" };
const line = (id: string, qty: number, price = 44): CartItem => ({
  id,
  slug: id,
  name: id,
  price,
  meta: "",
  img: "",
  qty,
});

describe("addItem", () => {
  it("appends a new line with quantity 1 by default", () => {
    const next = addItem([], { id: "a", ...base });
    expect(next).toEqual([{ id: "a", ...base, qty: 1 }]);
  });

  it("respects an explicit quantity", () => {
    const next = addItem([], { id: "a", ...base }, 3);
    expect(next[0]!.qty).toBe(3);
  });

  it("merges quantity into an existing line instead of duplicating it", () => {
    // WHY: clicking add twice must bump qty, not create two identical lines.
    const next = addItem([line("a", 2)], { id: "a", ...base }, 2);
    expect(next).toHaveLength(1);
    expect(next[0]!.qty).toBe(4);
  });

  it("does not mutate the input array", () => {
    const items = [line("a", 1)];
    addItem(items, { id: "b", ...base });
    expect(items).toHaveLength(1);
  });
});

describe("removeItem", () => {
  it("drops the matching line and leaves others", () => {
    expect(removeItem([line("a", 1), line("b", 2)], "a")).toEqual([line("b", 2)]);
  });
});

describe("setQty", () => {
  it("updates the quantity of the matching line", () => {
    expect(setQty([line("a", 1)], "a", 5)[0]!.qty).toBe(5);
  });

  it("removes the line when quantity hits zero", () => {
    // WHY: the qty stepper must never leave a zero-quantity ghost line.
    expect(setQty([line("a", 1)], "a", 0)).toEqual([]);
  });

  it("removes the line for negative quantities", () => {
    expect(setQty([line("a", 3)], "a", -1)).toEqual([]);
  });
});

describe("cartCount", () => {
  it("sums quantities across lines", () => {
    expect(cartCount([line("a", 2), line("b", 3)])).toBe(5);
  });

  it("is zero for an empty cart", () => {
    expect(cartCount([])).toBe(0);
  });
});

describe("cartSubtotal", () => {
  it("sums price × quantity across lines", () => {
    expect(cartSubtotal([line("a", 2, 44), line("b", 1, 10)])).toBe(98);
  });

  it("is zero for an empty cart", () => {
    expect(cartSubtotal([])).toBe(0);
  });
});
