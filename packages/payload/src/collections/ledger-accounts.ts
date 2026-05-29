import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const LedgerAccounts: CollectionConfig = {
  slug: "ledger-accounts",
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
      required: true,
      options: [
        { label: "Platform Fee", value: "platform_fee" },
        { label: "Customer Funds", value: "customer_funds" },
        { label: "Partner Payable", value: "partner_payable" },
        { label: "Supplier Payable", value: "supplier_payable" },
        { label: "Refunds Payable", value: "refunds_payable" },
      ],
    },
    {
      name: "ownerType",
      type: "select",
      defaultValue: "platform",
      options: [
        { label: "Platform", value: "platform" },
        { label: "Partner", value: "partner" },
        { label: "Supplier", value: "supplier" },
        { label: "Customer", value: "customer" },
      ],
    },
    {
      name: "ownerRef",
      type: "text",
    },
    {
      name: "currency",
      type: "text",
      required: true,
      defaultValue: "USD",
    },
  ],
};
