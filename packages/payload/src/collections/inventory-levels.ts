import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const InventoryLevels: CollectionConfig = {
  slug: "inventory-levels",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "partnerLocation",
      type: "relationship",
      relationTo: "partner-locations",
      required: true,
    },
    {
      name: "quantityAvailable",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "quantityReserved",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
  ],
};
