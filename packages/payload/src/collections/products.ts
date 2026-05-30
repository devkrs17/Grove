import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Products: CollectionConfig = {
  slug: "products",
  admin: {
    useAsTitle: "name",
    defaultColumns: ["name", "category", "price", "status"],
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
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
      admin: {
        description:
          "URL slug for the storefront product page, e.g. sour-grapes. Derived from the name on import when left blank.",
      },
    },
    {
      name: "price",
      type: "number",
      required: true,
      min: 0,
    },
    {
      name: "status",
      type: "select",
      defaultValue: "draft",
      options: [
        { label: "Draft", value: "draft" },
        { label: "Published", value: "published" },
      ],
    },
    {
      name: "subtitle",
      type: "text",
      admin: {
        description: "Short meta line shown under the name, e.g. 'Indica · live resin vape · 1g'.",
      },
    },
    {
      name: "description",
      type: "textarea",
    },
    {
      name: "category",
      type: "select",
      options: [
        { label: "Flower", value: "Flower" },
        { label: "Concentrates", value: "Concentrates" },
        { label: "Vapes", value: "Vapes" },
        { label: "Pre-rolls", value: "Pre-rolls" },
        { label: "Edibles", value: "Edibles" },
      ],
    },
    {
      name: "strainType",
      type: "select",
      options: [
        { label: "Indica", value: "Indica" },
        { label: "Sativa", value: "Sativa" },
        { label: "Hybrid", value: "Hybrid" },
      ],
    },
    {
      name: "effect",
      type: "select",
      options: [
        { label: "Sleep", value: "sleep" },
        { label: "Chill", value: "chill" },
        { label: "Euphoric", value: "euphoric" },
        { label: "Creative", value: "creative" },
        { label: "Focus", value: "focus" },
      ],
    },
    {
      name: "thcLabel",
      type: "text",
      admin: {
        description: "Potency label as shown to shoppers, e.g. '82% THCa' or '10mg/pc'.",
      },
    },
    {
      name: "lot",
      type: "text",
      admin: {
        description: "Batch / lot number traceable to the COA, e.g. 0421-A.",
      },
    },
    {
      name: "tag",
      type: "text",
      admin: {
        description: "Optional badge shown on the product card, e.g. 'Best seller', 'Limited'.",
      },
    },
    {
      name: "featuredImage",
      type: "upload",
      relationTo: "media",
      admin: {
        description:
          "Primary product image, served from the Media library. Preferred over imageId; falls back to imageId when empty. (Named featuredImage, not image, because imageId already owns the image_id column.)",
      },
    },
    {
      name: "imageId",
      type: "text",
      admin: {
        description:
          "Fallback product image when no Media image is set: a full https URL, or an Unsplash photo id consumed by the storefront image helper.",
      },
    },
    {
      name: "terpenes",
      type: "text",
      admin: {
        description: "Optional terpene summary for the COA panel, e.g. 'Limonene · Myrcene · Caryophyllene'.",
      },
    },
  ],
};
