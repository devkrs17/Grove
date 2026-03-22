import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const ServiceRequests: CollectionConfig = {
  slug: "service-requests",
  admin: {
    useAsTitle: "title",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "title",
      type: "text",
      required: true,
    },
    {
      name: "description",
      type: "textarea",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "In Progress", value: "in-progress" },
        { label: "Completed", value: "completed" },
        { label: "Rejected", value: "rejected" },
      ],
    },
    {
      name: "priority",
      type: "select",
      defaultValue: "medium",
      options: [
        { label: "Low", value: "low" },
        { label: "Medium", value: "medium" },
        { label: "High", value: "high" },
      ],
    },
    {
      name: "requestedBy",
      type: "relationship",
      relationTo: "users",
    },
  ],
};
