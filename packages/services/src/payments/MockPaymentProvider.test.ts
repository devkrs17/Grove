import { describe, it, expect } from "vitest";
import { MockPaymentProvider } from "./MockPaymentProvider";

const usd = (amount: number) => ({ amount, currency: "USD" });

describe("MockPaymentProvider", () => {
  const provider = new MockPaymentProvider();

  it("identifies itself as 'mock' (recorded on the payment)", () => {
    expect(provider.name).toBe("mock");
  });

  describe("authorize", () => {
    it("auto-authorizes and derives a deterministic intent ref from the order", async () => {
      const result = await provider.authorize("order_123", usd(1999));
      expect(result).toEqual({
        providerIntentRef: "mock_order_123",
        status: "authorized",
        amount: 1999,
        currency: "USD",
      });
    });

    // WHY: determinism is the whole point of the mock — same order, same ref —
    // so order/settlement flows are reproducible across runs.
    it("is deterministic for the same order ref", async () => {
      const a = await provider.authorize("order_123", usd(1999));
      const b = await provider.authorize("order_123", usd(1999));
      expect(a.providerIntentRef).toBe(b.providerIntentRef);
    });

    it("validates the amount", async () => {
      await expect(provider.authorize("order_123", usd(19.99))).rejects.toThrow(
        /integer in minor units/,
      );
    });

    it("requires an order ref", async () => {
      await expect(provider.authorize("", usd(1999))).rejects.toThrow(
        /orderRef is required/,
      );
    });
  });

  describe("capture", () => {
    it("captures an authorized intent", async () => {
      const result = await provider.capture("mock_order_123", usd(1999));
      expect(result).toEqual({
        providerIntentRef: "mock_order_123",
        status: "captured",
        amount: 1999,
        currency: "USD",
      });
    });

    it("validates the amount", async () => {
      await expect(
        provider.capture("mock_order_123", usd(-5)),
      ).rejects.toThrow(/non-negative/);
    });

    it("requires an intent ref", async () => {
      await expect(provider.capture("", usd(1999))).rejects.toThrow(
        /providerIntentRef is required/,
      );
    });
  });

  describe("refund", () => {
    it("refunds a captured intent (partial amounts allowed)", async () => {
      const result = await provider.refund("mock_order_123", usd(500));
      expect(result).toEqual({
        providerIntentRef: "mock_order_123",
        status: "refunded",
        amount: 500,
        currency: "USD",
      });
    });

    it("validates the amount", async () => {
      await expect(
        provider.refund("mock_order_123", usd(1.5)),
      ).rejects.toThrow(/integer in minor units/);
    });

    it("requires an intent ref", async () => {
      await expect(provider.refund("", usd(500))).rejects.toThrow(
        /providerIntentRef is required/,
      );
    });
  });
});
