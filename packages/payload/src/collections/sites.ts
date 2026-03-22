import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Sites: CollectionConfig = {
  slug: "sites",
  admin: {
    useAsTitle: "name",
  },
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "name",
      type: "text",
      required: true,
    },
    {
      name: "slug",
      type: "text",
      required: true,
      unique: true,
    },
    {
      name: "domain",
      type: "text",
    },
    {
      name: "description",
      type: "textarea",
    },
  ],
};
