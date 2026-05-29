import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const PartnerLocations: CollectionConfig = {
  slug: "partner-locations",
  admin: {
    useAsTitle: "label",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "partner",
      type: "relationship",
      relationTo: "partners",
      required: true,
    },
    {
      name: "label",
      type: "text",
      required: true,
    },
    {
      name: "address",
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
      name: "lat",
      type: "number",
    },
    {
      name: "lng",
      type: "number",
    },
    {
      name: "serviceRadiusKm",
      type: "number",
      defaultValue: 0,
      min: 0,
    },
    {
      name: "active",
      type: "checkbox",
      defaultValue: true,
    },
  ],
};
