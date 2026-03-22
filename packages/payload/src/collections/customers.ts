import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Customers: CollectionConfig = {
  slug: "customers",
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "email",
      type: "email",
      required: true,
      unique: true,
    },
    {
      name: "firstName",
      type: "text",
    },
    {
      name: "lastName",
      type: "text",
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      required: true,
    },
  ],
};
