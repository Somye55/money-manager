import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "./button";

describe("Button Component", () => {
  it("renders with default variant and size", () => {
    render(<Button>Click me</Button>);
    const button = screen.getByRole("button", { name: /click me/i });
    expect(button).toBeInTheDocument();
  });

  it("renders all 6 variants correctly", () => {
    const variants = [
      "default",
      "destructive",
      "outline",
      "secondary",
      "ghost",
      "link",
    ] as const;

    variants.forEach((variant) => {
      const { container } = render(
        <Button variant={variant}>{variant}</Button>
      );
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
    });
  });

  it("renders all 4 sizes correctly", () => {
    const sizes = ["default", "sm", "lg", "icon"] as const;

    sizes.forEach((size) => {
      const { container } = render(<Button size={size}>Button</Button>);
      const button = container.querySelector("button");
      expect(button).toBeInTheDocument();
      // All sizes should have minimum 44px touch target
      expect(button).toHaveClass("min-h-[44px]");
    });
  });

  it("shows loading spinner when loading prop is true", () => {
    const { container } = render(<Button loading>Loading</Button>);
    const spinner = container.querySelector("svg.animate-spin");
    expect(spinner).toBeInTheDocument();
  });

  it("disables button when disabled prop is true", () => {
    render(<Button disabled>Disabled</Button>);
    const button = screen.getByRole("button", { name: /disabled/i });
    expect(button).toBeDisabled();
  });

  it("disables button when loading prop is true", () => {
    render(<Button loading>Loading</Button>);
    const button = screen.getByRole("button", { name: /loading/i });
    expect(button).toBeDisabled();
  });

  it("ensures minimum 44px touch targets for all sizes", () => {
    const sizes = ["default", "sm", "lg", "icon"] as const;

    sizes.forEach((size) => {
      const { container } = render(<Button size={size}>Button</Button>);
      const button = container.querySelector("button");
      expect(button).toHaveClass("min-h-[44px]");

      if (size === "icon") {
        expect(button).toHaveClass("min-w-[44px]");
      }
    });
  });
});
