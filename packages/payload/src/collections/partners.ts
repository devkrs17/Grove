import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Partners: CollectionConfig = {
  slug: "partners",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "type",
      type: "select",
      defaultValue: "fulfillment",
      options: [
        { label: "Supplier", value: "supplier" },
        { label: "Fulfillment", value: "fulfillment" },
        { label: "Hybrid", value: "hybrid" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Active", value: "active" },
        { label: "Suspended", value: "suspended" },
      ],
    },
    {
      name: "contactEmail",
      type: "email",
    },
    {
      name: "credentials",
      type: "array",
      fields: [
        { name: "type", type: "text" },
        { name: "identifier", type: "text" },
        {
          name: "status",
          type: "select",
          defaultValue: "pending",
          options: [
            { label: "Pending", value: "pending" },
            { label: "Verified", value: "verified" },
            { label: "Expired", value: "expired" },
            { label: "Rejected", value: "rejected" },
          ],
        },
        { name: "expiresAt", type: "date" },
      ],
    },
    {
      name: "payoutMethod",
      type: "group",
      fields: [
        { name: "provider", type: "text" },
        { name: "accountRef", type: "text" },
      ],
    },
  ],
};
