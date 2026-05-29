import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

// Immutable, append-only double-entry postings: update and delete are
// restricted to super admins. Balance validation (Σdebits == Σcredits per
// transactionId) is enforced by a hook in a later ticket.
export const LedgerEntries: CollectionConfig = {
  slug: "ledger-entries",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "transactionId",
      type: "text",
      required: true,
    },
    {
      name: "account",
      type: "relationship",
      relationTo: "ledger-accounts",
      required: true,
    },
    {
      name: "direction",
      type: "select",
      required: true,
      options: [
        { label: "Debit", value: "debit" },
        { label: "Credit", value: "credit" },
      ],
    },
    {
      name: "amount",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "currency",
      type: "text",
      required: true,
      defaultValue: "USD",
    },
    {
      name: "refType",
      type: "select",
      options: [
        { label: "Order", value: "order" },
        { label: "Settlement", value: "settlement" },
        { label: "Payout", value: "payout" },
        { label: "Refund", value: "refund" },
        { label: "Adjustment", value: "adjustment" },
      ],
    },
    {
      name: "refId",
      type: "text",
    },
    {
      name: "postedAt",
      type: "date",
    },
    {
      name: "memo",
      type: "text",
    },
  ],
};
