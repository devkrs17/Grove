import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Fulfillments: CollectionConfig = {
  slug: "fulfillments",
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
      name: "partner",
      type: "relationship",
      relationTo: "partners",
      required: true,
    },
    {
      name: "partnerLocation",
      type: "relationship",
      relationTo: "partner-locations",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "assigned",
      options: [
        { label: "Assigned", value: "assigned" },
        { label: "Accepted", value: "accepted" },
        { label: "Picked Up", value: "picked_up" },
        { label: "In Transit", value: "in_transit" },
        { label: "Delivered", value: "delivered" },
        { label: "Failed", value: "failed" },
      ],
    },
    {
      name: "assignedAt",
      type: "date",
    },
    {
      name: "deliveredAt",
      type: "date",
    },
    {
      name: "trackingRef",
      type: "text",
    },
  ],
};
