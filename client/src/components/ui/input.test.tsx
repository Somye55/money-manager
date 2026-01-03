import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Input } from "./input";

describe("Input Component", () => {
  it("renders with consistent height (h-9, 36px)", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");
    expect(input).toBeInTheDocument();
    expect(input).toHaveClass("h-9");
  });

  it("renders with correct background color", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("bg-input-background");
  });

  it("applies focus ring styling classes", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");
    expect(input).toHaveClass("focus-visible:ring-ring/50");
    expect(input).toHaveClass("focus-visible:ring-[3px]");
  });

  it("supports error styling with aria-invalid", () => {
    const { container } = render(<Input error="This field is required" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveClass("aria-invalid:border-destructive");

    const errorMessage = screen.getByRole("alert");
    expect(errorMessage).toHaveTextContent("This field is required");
  });

  it("does not set aria-invalid when no error", () => {
    const { container } = render(<Input placeholder="Test input" />);
    const input = container.querySelector("input");
    expect(input).toHaveAttribute("aria-invalid", "false");
  });

  it("supports icon positioning", () => {
    const { container } = render(
      <Input icon={<span data-testid="test-icon">🔍</span>} />
    );
    const iconWrapper = container.querySelector(
      ".absolute.left-4.top-1\\/2.-translate-y-1\\/2"
    );
    expect(iconWrapper).toBeInTheDocument();
    expect(screen.getByTestId("test-icon")).toBeInTheDocument();
  });

  it("adds left padding when icon is present", () => {
    const { container } = render(
      <Input icon={<span>🔍</span>} placeholder="Search" />
    );
    const input = container.querySelector("input");
    expect(input).toHaveClass("pl-11");
  });

  it("applies disabled state styling", () => {
    const { container } = render(<Input disabled placeholder="Disabled" />);
    const input = container.querySelector("input");
    expect(input).toBeDisabled();
    expect(input).toHaveClass("disabled:cursor-not-allowed");
    expect(input).toHaveClass("disabled:opacity-50");
  });

  it("forwards ref correctly", () => {
    const ref = { current: null };
    render(<Input ref={ref} />);
    expect(ref.current).toBeInstanceOf(HTMLInputElement);
  });
});
