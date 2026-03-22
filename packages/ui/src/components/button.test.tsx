import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Button } from "./button";

afterEach(cleanup);

describe("Button", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    const btn = screen.getByRole("button", { name: "Click me" });
    expect(btn).toBeInTheDocument();
    expect(btn.className).toContain("bg-primary");
    expect(btn.className).toContain("h-10");
  });

  it("renders destructive variant", () => {
    render(<Button variant="destructive">Delete</Button>);
    const btn = screen.getByRole("button", { name: "Delete" });
    expect(btn.className).toContain("bg-destructive");
  });

  it("renders outline variant", () => {
    render(<Button variant="outline">Outline</Button>);
    const btn = screen.getByRole("button", { name: "Outline" });
    expect(btn.className).toContain("border");
    expect(btn.className).toContain("bg-background");
  });

  it("renders ghost variant", () => {
    render(<Button variant="ghost">Ghost</Button>);
    const btn = screen.getByRole("button", { name: "Ghost" });
    expect(btn.className).not.toContain("bg-primary");
  });

  it("renders sm size", () => {
    render(<Button size="sm">Small</Button>);
    const btn = screen.getByRole("button", { name: "Small" });
    expect(btn.className).toContain("h-9");
  });

  it("renders lg size", () => {
    render(<Button size="lg">Large</Button>);
    const btn = screen.getByRole("button", { name: "Large" });
    expect(btn.className).toContain("h-11");
  });

  it("merges custom className", () => {
    render(<Button className="custom-class">Custom</Button>);
    const btn = screen.getByRole("button", { name: "Custom" });
    expect(btn.className).toContain("custom-class");
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLButtonElement>();
    render(<Button ref={ref}>Ref</Button>);
    expect(ref.current).toBeInstanceOf(HTMLButtonElement);
  });

  it("passes through HTML button props", () => {
    render(
      <Button disabled type="submit">
        Submit
      </Button>,
    );
    const btn = screen.getByRole("button", { name: "Submit" });
    expect(btn).toBeDisabled();
    expect(btn).toHaveAttribute("type", "submit");
  });

  it("has correct displayName", () => {
    expect(Button.displayName).toBe("Button");
  });
});
