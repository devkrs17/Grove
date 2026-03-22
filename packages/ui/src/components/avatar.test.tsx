import { describe, it, expect, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import { Avatar, AvatarImage, AvatarFallback } from "./avatar";

afterEach(cleanup);

describe("Avatar", () => {
  it("renders with fallback text", () => {
    render(
      <Avatar>
        <AvatarFallback>JD</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("JD")).toBeInTheDocument();
  });

  it("merges custom className on Avatar", () => {
    const { container } = render(
      <Avatar className="custom-avatar">
        <AvatarFallback>AB</AvatarFallback>
      </Avatar>,
    );
    const root = container.firstElementChild!;
    expect(root.className).toContain("custom-avatar");
  });

  it("merges custom className on AvatarFallback", () => {
    render(
      <Avatar>
        <AvatarFallback className="custom-fallback">AB</AvatarFallback>
      </Avatar>,
    );
    expect(screen.getByText("AB").className).toContain("custom-fallback");
  });

  it("exports AvatarImage component", () => {
    expect(AvatarImage).toBeDefined();
    expect(AvatarImage.displayName).toBe("AvatarImage");
  });

  it("has correct displayNames", () => {
    expect(Avatar.displayName).toBe("Avatar");
    expect(AvatarImage.displayName).toBe("AvatarImage");
    expect(AvatarFallback.displayName).toBe("AvatarFallback");
  });
});
