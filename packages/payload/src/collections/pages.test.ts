import { describe, it, expect } from "vitest";
import { Pages } from "./pages";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("Pages collection", () => {
  it("has slug 'pages'", () => {
    expect(Pages.slug).toBe("pages");
  });

  it("uses title as admin title", () => {
    expect(Pages.admin?.useAsTitle).toBe("title");
  });

  it("has drafts enabled", () => {
    expect(Pages.versions).toMatchObject({ drafts: true });
  });

  it("has required title field", () => {
    const field = Pages.fields.find(
      (f) => "name" in f && f.name === "title",
    );
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has required slug field", () => {
    const field = Pages.fields.find(
      (f) => "name" in f && f.name === "slug",
    );
    expect(field).toMatchObject({ type: "text", required: true });
  });

  it("has required site relationship field", () => {
    const field = Pages.fields.find(
      (f) => "name" in f && f.name === "site",
    );
    expect(field).toMatchObject({
      type: "relationship",
      relationTo: "sites",
      required: true,
    });
  });

  it("has content richText field", () => {
    const field = Pages.fields.find(
      (f) => "name" in f && f.name === "content",
    );
    expect(field).toMatchObject({ type: "richText" });
  });

  it("has status select field defaulting to draft", () => {
    const field = Pages.fields.find(
      (f) => "name" in f && f.name === "status",
    ) as any;
    expect(field).toMatchObject({ type: "select", defaultValue: "draft" });
    expect(field.options).toEqual([
      { label: "Draft", value: "draft" },
      { label: "Published", value: "published" },
    ]);
  });

  it("has exactly 5 fields", () => {
    expect(Pages.fields).toHaveLength(5);
  });

  it("allows read for authenticated users", () => {
    expect(Pages.access?.read).toBe(isAuthenticated);
  });

  it("allows create for authenticated users", () => {
    expect(Pages.access?.create).toBe(isAuthenticated);
  });

  it("allows update for authenticated users", () => {
    expect(Pages.access?.update).toBe(isAuthenticated);
  });

  it("restricts delete to super admin", () => {
    expect(Pages.access?.delete).toBe(isSuperAdmin);
  });
});
