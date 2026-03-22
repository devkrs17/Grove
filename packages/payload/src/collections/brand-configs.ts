import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const BrandConfigs: CollectionConfig = {
  slug: "brand-configs",
  admin: {
    useAsTitle: "site",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      required: true,
    },
    {
      name: "logo",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "primaryColor",
      type: "text",
    },
    {
      name: "secondaryColor",
      type: "text",
    },
    {
      name: "typography",
      type: "json",
    },
  ],
};
