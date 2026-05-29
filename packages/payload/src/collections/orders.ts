import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Orders: CollectionConfig = {
  slug: "orders",
  admin: {
    useAsTitle: "orderNumber",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "orderNumber",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "customer",
      type: "relationship",
      relationTo: "customers",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      required: true,
    },
    {
      name: "items",
      type: "array",
      fields: [
        {
          name: "product",
          type: "relationship",
          relationTo: "products",
          required: true,
        },
        {
          name: "quantity",
          type: "number",
          required: true,
          min: 1,
        },
        {
          name: "unitPrice",
          type: "number",
          required: true,
          min: 0,
        },
        {
          name: "lineTotal",
          type: "number",
          required: true,
          min: 0,
        },
      ],
    },
    {
      name: "subtotal",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "fees",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "total",
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
        { label: "Confirmed", value: "confirmed" },
        { label: "Routed", value: "routed" },
        { label: "Fulfilling", value: "fulfilling" },
        { label: "Delivered", value: "delivered" },
        { label: "Completed", value: "completed" },
        { label: "Cancelled", value: "cancelled" },
        { label: "Refunded", value: "refunded" },
      ],
    },
    {
      name: "paymentStatus",
      type: "select",
      defaultValue: "unpaid",
      options: [
        { label: "Unpaid", value: "unpaid" },
        { label: "Authorized", value: "authorized" },
        { label: "Paid", value: "paid" },
        { label: "Refunded", value: "refunded" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "fulfillmentStatus",
      type: "select",
      defaultValue: "unfulfilled",
      options: [
        { label: "Unfulfilled", value: "unfulfilled" },
        { label: "Assigned", value: "assigned" },
        { label: "In Transit", value: "in_transit" },
        { label: "Delivered", value: "delivered" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "shippingAddress",
      type: "group",
      fields: [
        { name: "line1", type: "text" },
        { name: "line2", type: "text" },
        { name: "city", type: "text" },
        { name: "region", type: "text" },
        { name: "postalCode", type: "text" },
        { name: "country", type: "text" },
      ],
    },
    {
      name: "placedAt",
      type: "date",
    },
  ],
};
