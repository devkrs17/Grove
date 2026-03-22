import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import { Skeleton } from "./skeleton";

afterEach(cleanup);

describe("Skeleton", () => {
  it("renders a div with animation class", () => {
    const { container } = render(<Skeleton />);
    const el = container.firstElementChild!;
    expect(el.className).toContain("animate-pulse");
  });

  it("merges custom className", () => {
    const { container } = render(<Skeleton className="h-10 w-40" />);
    const el = container.firstElementChild!;
    expect(el.className).toContain("h-10");
    expect(el.className).toContain("w-40");
  });

  it("passes through HTML attributes", () => {
    const { container } = render(<Skeleton data-testid="skeleton" />);
    expect(container.querySelector("[data-testid='skeleton']")).toBeTruthy();
  });
});
