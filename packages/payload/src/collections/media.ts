import path from "path";
import { fileURLToPath } from "url";
import type { CollectionConfig } from "payload";
import { isAuthenticatedOrReadingFile, isAuthenticated, isSuperAdmin } from "../access";

const dirname = path.dirname(fileURLToPath(import.meta.url));

export const Media: CollectionConfig = {
  slug: "media",
  access: {
    // File bytes are public (storefront images); the document API stays gated.
    read: isAuthenticatedOrReadingFile,
    create: isAuthenticated,
    update: isAuthenticated,
    delete: isSuperAdmin,
  },
  upload: {
    // Local-disk storage for dev. Absolute + module-anchored so files land in
    // the same place regardless of the process cwd (Next dev, seed script, the
    // file-serving route all resolve to packages/payload/media). Swap for a
    // cloud storage adapter plugin (@payloadcms/storage-*) before production.
    staticDir: path.resolve(dirname, "../../media"),
    mimeTypes: ["image/*"],
    imageSizes: [
      {
        name: "thumbnail",
        width: 300,
        height: 300,
        position: "centre",
      },
      {
        name: "card",
        width: 768,
        height: 1024,
        position: "centre",
      },
    ],
  },
  fields: [
    {
      name: "alt",
      type: "text",
      required: true,
    },
    {
      name: "site",
      type: "relationship",
      relationTo: "sites",
    },
  ],
};
