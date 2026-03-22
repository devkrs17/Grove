import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  SelectGroup,
  SelectLabel,
  SelectSeparator,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from "./select";

afterEach(cleanup);

describe("Select", () => {
  it("renders a trigger with placeholder", () => {
    render(
      <Select>
        <SelectTrigger>
          <SelectValue placeholder="Pick one" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
    expect(screen.getByText("Pick one")).toBeInTheDocument();
  });

  it("merges custom className on trigger", () => {
    render(
      <Select>
        <SelectTrigger className="custom-trigger">
          <SelectValue placeholder="Choose" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByRole("combobox").className).toContain("custom-trigger");
  });

  it("supports disabled state on trigger", () => {
    render(
      <Select disabled>
        <SelectTrigger>
          <SelectValue placeholder="Disabled" />
        </SelectTrigger>
      </Select>,
    );
    expect(screen.getByRole("combobox")).toBeDisabled();
  });

  it("has correct displayNames", () => {
    expect(SelectTrigger.displayName).toBe("SelectTrigger");
    expect(SelectContent.displayName).toBe("SelectContent");
    expect(SelectItem.displayName).toBe("SelectItem");
    expect(SelectLabel.displayName).toBe("SelectLabel");
    expect(SelectSeparator.displayName).toBe("SelectSeparator");
    expect(SelectScrollUpButton.displayName).toBe("SelectScrollUpButton");
    expect(SelectScrollDownButton.displayName).toBe("SelectScrollDownButton");
  });

  it("exports all sub-components", () => {
    expect(Select).toBeDefined();
    expect(SelectGroup).toBeDefined();
    expect(SelectValue).toBeDefined();
    expect(SelectTrigger).toBeDefined();
    expect(SelectContent).toBeDefined();
    expect(SelectItem).toBeDefined();
    expect(SelectLabel).toBeDefined();
    expect(SelectSeparator).toBeDefined();
    expect(SelectScrollUpButton).toBeDefined();
    expect(SelectScrollDownButton).toBeDefined();
  });
});
