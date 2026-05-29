import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Payouts: CollectionConfig = {
  slug: "payouts",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "batch",
      type: "relationship",
      relationTo: "payout-batches",
      required: true,
    },
    {
      name: "payee",
      type: "relationship",
      relationTo: "partners",
      required: true,
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
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Processing", value: "processing" },
        { label: "Paid", value: "paid" },
        { label: "Failed", value: "failed" },
        { label: "Reversed", value: "reversed" },
      ],
    },
    {
      name: "providerRef",
      type: "text",
    },
    {
      name: "method",
      type: "select",
      defaultValue: "ach",
      options: [
        { label: "ACH", value: "ach" },
        { label: "RTP", value: "rtp" },
        { label: "Card", value: "card" },
        { label: "Pay by Bank", value: "pay_by_bank" },
      ],
    },
    {
      name: "settledAt",
      type: "date",
    },
  ],
};
