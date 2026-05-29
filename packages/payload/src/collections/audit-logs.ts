import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

// Append-only system action log: create is allowed, but update and delete are
// restricted to super admins so the trail is tamper-evident.
export const AuditLogs: CollectionConfig = {
  slug: "audit-logs",
  admin: {
    useAsTitle: "action",
  },
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isSuperAdmin,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "actorType",
      type: "select",
      defaultValue: "system",
      options: [
        { label: "User", value: "user" },
        { label: "Partner", value: "partner" },
        { label: "System", value: "system" },
      ],
    },
    {
      name: "actorRef",
      type: "text",
    },
    {
      name: "action",
      type: "text",
      required: true,
    },
    {
      name: "entityType",
      type: "text",
    },
    {
      name: "entityId",
      type: "text",
    },
    {
      name: "ipAddress",
      type: "text",
    },
    {
      name: "deviceId",
      type: "text",
    },
    {
      name: "metadata",
      type: "json",
    },
  ],
};
