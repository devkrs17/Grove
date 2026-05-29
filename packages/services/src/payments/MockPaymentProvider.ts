import {
  assertMoney,
  type Money,
  type PaymentProvider,
  type PaymentResult,
} from "./PaymentProvider";

/**
 * In-core payment provider for development and tests.
 *
 * Deterministic and offline: it makes no external calls and never randomly
 * fails, so order/settlement flows are reproducible. `authorize` auto-approves;
 * `capture` and `refund` transition a deterministic intent reference. The
 * intent ref is derived purely from the order ref, so the same order always
 * yields the same ref.
 */
export class MockPaymentProvider implements PaymentProvider {
  readonly name = "mock";

  async authorize(orderRef: string, money: Money): Promise<PaymentResult> {
    assertMoney(money);
    if (!orderRef) {
      throw new Error("orderRef is required to authorize a payment");
    }
    return {
      providerIntentRef: `mock_${orderRef}`,
      status: "authorized",
      amount: money.amount,
      currency: money.currency,
    };
  }

  async capture(
    providerIntentRef: string,
    money: Money,
  ): Promise<PaymentResult> {
    assertMoney(money);
    if (!providerIntentRef) {
      throw new Error("providerIntentRef is required to capture a payment");
    }
    return {
      providerIntentRef,
      status: "captured",
      amount: money.amount,
      currency: money.currency,
    };
  }

  async refund(
    providerIntentRef: string,
    money: Money,
  ): Promise<PaymentResult> {
    assertMoney(money);
    if (!providerIntentRef) {
      throw new Error("providerIntentRef is required to refund a payment");
    }
    return {
      providerIntentRef,
      status: "refunded",
      amount: money.amount,
      currency: money.currency,
    };
  }
}
