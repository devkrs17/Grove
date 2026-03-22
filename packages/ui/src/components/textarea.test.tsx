import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { createRef } from "react";
import { Textarea } from "./textarea";

afterEach(cleanup);

describe("Textarea", () => {
  it("renders a textarea element", () => {
    render(<Textarea placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("forwards ref", () => {
    const ref = createRef<HTMLTextAreaElement>();
    render(<Textarea ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement);
  });

  it("merges custom className", () => {
    render(<Textarea className="custom-class" data-testid="textarea" />);
    expect(screen.getByTestId("textarea").className).toContain("custom-class");
  });

  it("supports disabled state", () => {
    render(<Textarea disabled data-testid="textarea" />);
    expect(screen.getByTestId("textarea")).toBeDisabled();
  });

  it("has correct displayName", () => {
    expect(Textarea.displayName).toBe("Textarea");
  });
});
