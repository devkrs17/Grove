import { describe, it, expect } from "vitest";
import { assertMoney } from "./PaymentProvider";

describe("assertMoney", () => {
  it("accepts a non-negative integer amount with a currency", () => {
    expect(() => assertMoney({ amount: 1999, currency: "USD" })).not.toThrow();
    expect(() => assertMoney({ amount: 0, currency: "USD" })).not.toThrow();
  });

  // WHY: floats are how rounding bugs enter money math; the boundary must
  // reject them so only integer minor units ever reach settlement/ledger.
  it("rejects a non-integer amount", () => {
    expect(() => assertMoney({ amount: 19.99, currency: "USD" })).toThrow(
      /integer in minor units/,
    );
  });

  // WHY: a negative authorization/capture would silently move money the wrong
  // direction; refunds are modeled as their own operation, not negative charges.
  it("rejects a negative amount", () => {
    expect(() => assertMoney({ amount: -1, currency: "USD" })).toThrow(
      /non-negative/,
    );
  });

  // WHY: an amount without a currency is ambiguous and unsettleable.
  it("rejects a missing currency", () => {
    expect(() => assertMoney({ amount: 100, currency: "" })).toThrow(
      /currency is required/,
    );
  });
});
