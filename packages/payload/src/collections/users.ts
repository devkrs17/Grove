import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: {
    useAsTitle: "email",
  },
  access: {
    read: isAuthenticated,
    create: isSuperAdmin,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [],
};
