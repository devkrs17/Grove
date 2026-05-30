import { describe, it, expect } from "vitest";
import { LabReports } from "./lab-reports";
import { isAuthenticated, isSuperAdmin } from "../access";

describe("LabReports collection", () => {
  it("has slug 'lab-reports'", () => {
    expect(LabReports.slug).toBe("lab-reports");
  });

  it("uses batchLot as admin title", () => {
    expect(LabReports.admin?.useAsTitle).toBe("batchLot");
  });

  it("lists batchLot, product, lab, testedDate, status as default columns", () => {
    expect(LabReports.admin?.defaultColumns).toEqual([
      "batchLot",
      "product",
      "lab",
      "testedDate",
      "status",
    ]);
  });

  it("has a required product relationship to products", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "product");
    expect(f).toMatchObject({
      type: "relationship",
      relationTo: "products",
      required: true,
    });
  });

  it("has a required batchLot text field", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "batchLot");
    expect(f).toMatchObject({ type: "text", required: true });
  });

  it("has a potency text field", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "potency");
    expect(f).toMatchObject({ type: "text" });
  });

  it("has a testedDate date field", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "testedDate");
    expect(f).toMatchObject({ type: "date" });
  });

  it("has a lab text field", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "lab");
    expect(f).toMatchObject({ type: "text" });
  });

  it("has a status select that defaults to pass with pass/fail/pending options", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "status") as any;
    expect(f).toMatchObject({ type: "select", defaultValue: "pass" });
    expect(f.options).toEqual([
      { label: "Pass", value: "pass" },
      { label: "Fail", value: "fail" },
      { label: "Pending", value: "pending" },
    ]);
  });

  it("has a cannabinoids array of { name, value }", () => {
    const f = LabReports.fields.find(
      (x) => "name" in x && x.name === "cannabinoids",
    ) as any;
    expect(f).toMatchObject({ type: "array" });
    expect(f.fields).toEqual([
      { name: "name", type: "text" },
      { name: "value", type: "text" },
    ]);
  });

  it("has a safetyScreens array of { name, result }", () => {
    const f = LabReports.fields.find(
      (x) => "name" in x && x.name === "safetyScreens",
    ) as any;
    expect(f).toMatchObject({ type: "array" });
    expect(f.fields).toEqual([
      { name: "name", type: "text" },
      { name: "result", type: "text" },
    ]);
  });

  it("has a terpenes text field", () => {
    const f = LabReports.fields.find((x) => "name" in x && x.name === "terpenes");
    expect(f).toMatchObject({ type: "text" });
  });

  it("has a reportFile upload to media that is not required", () => {
    const f = LabReports.fields.find(
      (x) => "name" in x && x.name === "reportFile",
    ) as any;
    expect(f).toMatchObject({ type: "upload", relationTo: "media" });
    expect(f.required).toBeUndefined();
  });

  it("has 10 fields", () => {
    expect(LabReports.fields).toHaveLength(10);
  });

  it("applies the standard access rules", () => {
    expect(LabReports.access?.read).toBe(isAuthenticated);
    expect(LabReports.access?.create).toBe(isAuthenticated);
    expect(LabReports.access?.update).toBe(isAuthenticated);
    expect(LabReports.access?.delete).toBe(isSuperAdmin);
  });
});
