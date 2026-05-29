import type { CollectionConfig } from "payload";
import { isAuthenticated, isSuperAdmin } from "../access";

export const ComplianceChecks: CollectionConfig = {
  slug: "compliance-checks",
  access: {
    read: isAuthenticated,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  fields: [
    {
      name: "subjectType",
      type: "select",
      required: true,
      options: [
        { label: "Customer", value: "customer" },
        { label: "Partner", value: "partner" },
        { label: "Order", value: "order" },
      ],
    },
    {
      name: "subjectRef",
      type: "text",
    },
    {
      name: "checkType",
      type: "select",
      required: true,
      options: [
        { label: "Identity (KYC)", value: "identity_kyc" },
        { label: "AML", value: "aml" },
        { label: "Eligibility", value: "eligibility" },
        { label: "Credential Verification", value: "credential_verification" },
      ],
    },
    {
      name: "status",
      type: "select",
      defaultValue: "pending",
      options: [
        { label: "Pending", value: "pending" },
        { label: "Passed", value: "passed" },
        { label: "Failed", value: "failed" },
        { label: "Expired", value: "expired" },
      ],
    },
    {
      name: "provider",
      type: "text",
    },
    {
      name: "result",
      type: "json",
    },
    {
      name: "checkedAt",
      type: "date",
    },
    {
      name: "expiresAt",
      type: "date",
    },
  ],
};
