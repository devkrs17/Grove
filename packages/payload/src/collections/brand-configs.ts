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
    {
      name: "showLabReports",
      type: "checkbox",
      defaultValue: false,
      admin: {
        description:
          "Regulated-goods vertical: when on, the storefront renders the lab-report (COA) library at /lab-reports, the nav/footer 'Lab reports' links, the homepage CTA, and the per-product COA panel. Off (the default) for tenants that don't publish certificates of analysis.",
      },
    },
  ],
};
