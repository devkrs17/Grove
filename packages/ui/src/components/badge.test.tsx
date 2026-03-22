import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Badge } from "./badge";

afterEach(cleanup);

describe("Badge", () => {
  it("renders with default variant", () => {
    render(<Badge>Status</Badge>);
    const badge = screen.getByText("Status");
    expect(badge).toBeInTheDocument();
    expect(badge.className).toContain("bg-primary");
  });

  it("renders secondary variant", () => {
    render(<Badge variant="secondary">Tag</Badge>);
    expect(screen.getByText("Tag").className).toContain("bg-secondary");
  });

  it("renders destructive variant", () => {
    render(<Badge variant="destructive">Error</Badge>);
    expect(screen.getByText("Error").className).toContain("bg-destructive");
  });

  it("renders outline variant", () => {
    render(<Badge variant="outline">Outline</Badge>);
    const badge = screen.getByText("Outline");
    expect(badge.className).toContain("text-foreground");
    expect(badge.className).not.toContain("bg-primary");
  });

  it("merges custom className", () => {
    render(<Badge className="custom-class">Custom</Badge>);
    expect(screen.getByText("Custom").className).toContain("custom-class");
  });
});
