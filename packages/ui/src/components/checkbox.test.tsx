import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Checkbox } from "./checkbox";

afterEach(cleanup);

describe("Checkbox", () => {
  it("renders a checkbox", () => {
    render(<Checkbox aria-label="Accept terms" />);
    expect(screen.getByRole("checkbox")).toBeInTheDocument();
  });

  it("merges custom className", () => {
    render(<Checkbox aria-label="Check" className="custom-class" />);
    expect(screen.getByRole("checkbox").className).toContain("custom-class");
  });

  it("supports disabled state", () => {
    render(<Checkbox aria-label="Check" disabled />);
    expect(screen.getByRole("checkbox")).toBeDisabled();
  });

  it("has correct displayName", () => {
    expect(Checkbox.displayName).toBe("Checkbox");
  });
});
