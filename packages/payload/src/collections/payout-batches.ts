import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const PayoutBatches: CollectionConfig = {
  slug: "payout-batches",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "scheduledFor",
      type: "date",
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
      ],
    },
    {
      name: "provider",
      type: "text",
    },
    {
      name: "totalAmount",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "currency",
      type: "text",
      required: true,
      defaultValue: "USD",
    },
  ],
};
