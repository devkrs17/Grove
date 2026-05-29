/**
 * Provider-agnostic payment abstraction.
 *
 * All amounts are integer minor units (e.g. cents) paired with an ISO 4217
 * currency code — never floats, never major units. Concrete providers
 * (Stripe, an ACH bank, etc.) are adapters chosen via config; core ships only
 * the mock. Industry- or vendor-specific behavior never leaks into this layer.
 */

/** A monetary amount in integer minor units plus an ISO 4217 currency code. */
export interface Money {
  /** Integer minor units (e.g. 1999 = $19.99). Must be a non-negative integer. */
  amount: number;
  /** ISO 4217 currency code, e.g. "USD". */
  currency: string;
}

/**
 * Lifecycle status of a payment intent, mirroring the `payments` collection's
 * `status` field values.
 */
export type PaymentStatus =
  | "requires_action"
  | "authorized"
  | "captured"
  | "failed"
  | "refunded";

/** Outcome of a provider operation against a single payment intent. */
export interface PaymentResult {
  /** Provider-side reference for the intent (maps to `providerIntentRef`). */
  providerIntentRef: string;
  status: PaymentStatus;
  /** Amount the result pertains to, in integer minor units. */
  amount: number;
  currency: string;
}

export interface PaymentProvider {
  /** Stable identifier recorded on the payment (maps to `provider`). */
  readonly name: string;
  /** Reserve funds for an order. Returns an intent in `authorized` state. */
  authorize(orderRef: string, money: Money): Promise<PaymentResult>;
  /** Capture a previously authorized intent (full or partial). */
  capture(providerIntentRef: string, money: Money): Promise<PaymentResult>;
  /** Refund a captured intent (full or partial). */
  refund(providerIntentRef: string, money: Money): Promise<PaymentResult>;
}

/**
 * Guard that enforces the integer-minor-units + currency invariant at the
 * boundary of every provider call, so a float or negative amount can never
 * silently flow into settlement or the ledger.
 */
export function assertMoney(money: Money): void {
  if (!Number.isInteger(money.amount)) {
    throw new Error(
      `Payment amount must be an integer in minor units, got ${money.amount}`,
    );
  }
  if (money.amount < 0) {
    throw new Error(`Payment amount must be non-negative, got ${money.amount}`);
  }
  if (!money.currency) {
    throw new Error("Payment currency is required");
  }
}
