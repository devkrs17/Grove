import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  upload: {
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
    },
  ],
};
