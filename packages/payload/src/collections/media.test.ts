import { describe, it, expect } from "vitest";
import { Media } from "./media";
import { isAuthenticatedOrReadingFile, isAuthenticated, isSuperAdmin } from "../access";

describe("Media collection", () => {
  it("has slug 'media'", () => {
    expect(Media.slug).toBe("media");
  });

  it("has upload enabled with image sizes", () => {
    expect(Media.upload).toBeTruthy();
    const upload = Media.upload as any;
    expect(upload.imageSizes).toHaveLength(2);
    expect(upload.imageSizes[0].name).toBe("thumbnail");
    expect(upload.imageSizes[1].name).toBe("card");
  });

  it("configures local-disk storage restricted to images", () => {
    const upload = Media.upload as any;
    // Absolute staticDir so uploads land predictably regardless of cwd.
    expect(typeof upload.staticDir).toBe("string");
    expect(upload.staticDir.length).toBeGreaterThan(0);
    expect(upload.staticDir.endsWith("media")).toBe(true);
    expect(upload.mimeTypes).toEqual(["image/*"]);
  });

  it("has required alt text field", () => {
    const field = Media.fields.find(
      (f) => "name" in f && f.name === "alt",
    );
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has optional site relationship field", () => {
    const field = Media.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({ type: "relationship", relationTo: "sites" });
  });

  it("has exactly 2 fields", () => {
    expect(Media.fields).toHaveLength(2);
  });

  it("serves files publicly but gates the document API behind auth", () => {
    expect(Media.access?.read).toBe(isAuthenticatedOrReadingFile);
  });

  it("allows create for authenticated users", () => {
    expect(Media.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(Media.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Media.access?.delete).toBe(isSuperAdmin);
  });
});
