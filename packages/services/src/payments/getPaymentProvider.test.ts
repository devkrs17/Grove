import { describe, it, expect } from "vitest";
import { getPaymentProvider } from "./getPaymentProvider";
import { MockPaymentProvider } from "./MockPaymentProvider";

describe("getPaymentProvider", () => {
  it("defaults to the mock provider when none is configured", () => {
    expect(getPaymentProvider(undefined)).toBeInstanceOf(MockPaymentProvider);
  });

  it("returns the mock provider when explicitly selected", () => {
    expect(getPaymentProvider("mock")).toBeInstanceOf(MockPaymentProvider);
  });

  // WHY: core ships no real provider; selecting one that isn't registered must
  // fail loudly at startup rather than silently falling back to the mock and
  // appearing to take real payments.
  it("throws for an unknown provider rather than silently falling back", () => {
    expect(() => getPaymentProvider("stripe")).toThrow(
      /Unknown payment provider "stripe"/,
    );
  });
});
