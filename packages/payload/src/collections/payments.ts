import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Payments: CollectionConfig = {
  slug: "payments",
  admin: {
    useAsTitle: "provider",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "order",
      type: "relationship",
      relationTo: "orders",
      required: true,
    },
    {
      name: "provider",
      type: "text",
      required: true,
    },
    {
      name: "providerIntentRef",
      type: "text",
    },
    {
      name: "method",
      type: "select",
      defaultValue: "card",
      options: [
        { label: "ACH", value: "ach" },
        { label: "RTP", value: "rtp" },
        { label: "Card", value: "card" },
        { label: "Pay by Bank", value: "pay_by_bank" },
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
      name: "status",
      type: "select",
      defaultValue: "requires_action",
      options: [
        { label: "Requires Action", value: "requires_action" },
        { label: "Authorized", value: "authorized" },
        { label: "Captured", value: "captured" },
        { label: "Failed", value: "failed" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    {
      name: "capturedAt",
      type: "date",
    },
  ],
};
