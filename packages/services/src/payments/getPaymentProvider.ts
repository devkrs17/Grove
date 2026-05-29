import type { PaymentProvider } from "./PaymentProvider";
import { MockPaymentProvider } from "./MockPaymentProvider";

/**
 * Resolve the active payment provider from configuration.
 *
 * Selection is driven by the `PAYMENT_PROVIDER` env var and defaults to the
 * mock when unset. Core ships no real provider, so any other value is an
 * explicit misconfiguration and fails loudly rather than silently falling back.
 */
export function getPaymentProvider(
  providerName: string | undefined = process.env.PAYMENT_PROVIDER,
): PaymentProvider {
  switch (providerName ?? "mock") {
    case "mock":
      return new MockPaymentProvider();
    default:
      throw new Error(
        `Unknown payment provider "${providerName}". Core ships only "mock"; ` +
          `register a real provider adapter before selecting it.`,
      );
  }
}
