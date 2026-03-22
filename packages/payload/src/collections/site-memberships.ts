import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const SiteMemberships: CollectionConfig = {
  slug: "site-memberships",
  admin: {
    useAsTitle: "role",
  },
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "user",
      type: "relationship",
      relationTo: "users",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
      required: true,
    },
    {
      name: "role",
      type: "select",
      required: true,
      options: [
        { label: "Owner", value: "owner" },
        { label: "Manager", value: "manager" },
        { label: "Worker", value: "worker" },
      ],
    },
  ],
};
