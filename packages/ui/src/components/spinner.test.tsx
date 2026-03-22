import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Spinner } from "./spinner";

afterEach(cleanup);

describe("Spinner", () => {
  it("renders with role status", () => {
    render(<Spinner />);
    expect(screen.getByRole("status")).toBeInTheDocument();
  });

  it("has loading aria-label", () => {
    render(<Spinner />);
    expect(screen.getByLabelText("Loading")).toBeInTheDocument();
  });

  it("renders default size", () => {
    render(<Spinner />);
    const svg = screen.getByRole("status");
    expect(svg.classList.contains("h-6")).toBe(true);
  });

  it("renders sm size", () => {
    render(<Spinner size="sm" />);
    const svg = screen.getByRole("status");
    expect(svg.classList.contains("h-4")).toBe(true);
  });

  it("renders lg size", () => {
    render(<Spinner size="lg" />);
    const svg = screen.getByRole("status");
    expect(svg.classList.contains("h-8")).toBe(true);
  });

  it("merges custom className", () => {
    render(<Spinner className="text-red-500" />);
    expect(screen.getByRole("status").classList.contains("text-red-500")).toBe(true);
  });

  it("forwards ref", () => {
    const ref = createRef<SVGSVGElement>();
    render(<Spinner ref={ref} />);
    expect(ref.current).toBeInstanceOf(SVGSVGElement);
  });

  it("has correct displayName", () => {
    expect(Spinner.displayName).toBe("Spinner");
  });
});
