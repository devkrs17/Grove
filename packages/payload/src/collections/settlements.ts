import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Settlements: CollectionConfig = {
  slug: "settlements",
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
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Allocated", value: "allocated" },
        { label: "Posted", value: "posted" },
        { label: "Reconciled", value: "reconciled" },
      ],
    },
    {
      name: "allocations",
      type: "array",
      fields: [
        {
          name: "payeeType",
          type: "select",
          options: [
            { label: "Platform", value: "platform" },
            { label: "Supplier", value: "supplier" },
            { label: "Partner", value: "partner" },
          ],
        },
        { name: "payeeRef", type: "text" },
        { name: "amount", type: "number", min: 0 },
        { name: "basis", type: "text" },
      ],
    },
    {
      name: "computedAt",
      type: "date",
    },
    {
      name: "postedAt",
      type: "date",
    },
  ],
};
