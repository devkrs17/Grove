import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const Homepage: CollectionConfig = {
  slug: "homepage",
  admin: {
    useAsTitle: "heroHeadline",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "announcement",
      type: "text",
    },
    {
      name: "heroEyebrow",
      type: "text",
    },
    {
      name: "heroHeadline",
      type: "text",
      required: true,
    },
    {
      name: "heroHighlight",
      type: "text",
    },
    {
      name: "heroSubhead",
      type: "textarea",
    },
    {
      name: "heroImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "heroRating",
      type: "text",
    },
    {
      name: "heroCtaPrimaryLabel",
      type: "text",
    },
    {
      name: "heroCtaPrimaryHref",
      type: "text",
    },
    {
      name: "heroCtaSecondaryLabel",
      type: "text",
    },
    {
      name: "heroCtaSecondaryHref",
      type: "text",
    },
    {
      name: "heroStickers",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
        },
      ],
    },
    {
      name: "marqueeItems",
      type: "array",
      fields: [
        {
          name: "text",
          type: "text",
        },
      ],
    },
    {
      name: "featuredHeading",
      type: "text",
    },
    {
      name: "featuredProducts",
      type: "relationship",
      relationTo: "products",
      hasMany: true,
    },
    {
      name: "categoryTiles",
      type: "array",
      fields: [
        {
          name: "label",
          type: "text",
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
          name: "image",
          type: "upload",
          relationTo: "media",
        },
      ],
    },
    {
      name: "storyHeading",
      type: "text",
    },
    {
      name: "storyBody",
      type: "richText",
    },
    {
      name: "storyImage",
      type: "upload",
      relationTo: "media",
    },
    {
      name: "reviewsHeading",
      type: "text",
    },
    {
      name: "reviews",
      type: "array",
      fields: [
        {
          name: "title",
          type: "text",
        },
        {
          name: "body",
          type: "textarea",
        },
        {
          name: "author",
          type: "text",
        },
        {
          name: "badge",
          type: "text",
        },
      ],
    },
    {
      name: "emailHeading",
      type: "text",
    },
    {
      name: "emailSub",
      type: "text",
    },
    {
      name: "emailCta",
      type: "text",
    },
    {
      name: "metaTitle",
      type: "text",
    },
    {
      name: "metaDescription",
      type: "textarea",
    },
  ],
};
