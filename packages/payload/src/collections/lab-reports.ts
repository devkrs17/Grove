import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const LabReports: CollectionConfig = {
  slug: "lab-reports",
  admin: {
    useAsTitle: "batchLot",
    defaultColumns: ["batchLot", "product", "lab", "testedDate", "status"],
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "product",
      type: "relationship",
      relationTo: "products",
      required: true,
    },
    {
      name: "batchLot",
      type: "text",
      required: true,
    },
    {
      name: "potency",
      type: "text",
      admin: {
        description: "Headline potency for the lot, e.g. '86.4% THCa' or '1000mg total'.",
      },
    },
    {
      name: "testedDate",
      type: "date",
    },
    {
      name: "lab",
      type: "text",
      admin: {
        description: "Third-party testing lab, e.g. 'Kaycha Labs'.",
      },
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pass",
      options: [
        { label: "Pass", value: "pass" },
        { label: "Fail", value: "fail" },
        { label: "Pending", value: "pending" },
      ],
    },
    {
      name: "cannabinoids",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "value",
          type: "text",
        },
      ],
    },
    {
      name: "safetyScreens",
      type: "array",
      fields: [
        {
          name: "name",
          type: "text",
        },
        {
          name: "result",
          type: "text",
        },
      ],
    },
    {
      name: "terpenes",
      type: "text",
      admin: {
        description: "Optional dominant-terpene summary, e.g. 'Limonene · Caryophyllene · Linalool'.",
      },
    },
    {
      name: "reportFile",
      type: "upload",
      relationTo: "media",
      admin: {
        description: "The COA PDF for this lot, served from the Media library.",
      },
    },
  ],
};
