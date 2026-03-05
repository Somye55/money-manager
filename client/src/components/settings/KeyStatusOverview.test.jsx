import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, waitFor } from "@testing-library/react";
import KeyStatusOverview from "./KeyStatusOverview";
import { keyManager } from "../../lib/keyManager";

// Mock the keyManager
vi.mock("../../lib/keyManager", () => ({
  keyManager: {
    getKeyStatuses: vi.fn(),
  },
}));

describe("KeyStatusOverview", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should display loading state initially", () => {
    keyManager.getKeyStatuses.mockImplementation(
      () => new Promise(() => {}), // Never resolves
    );

    render(<KeyStatusOverview />);
    expect(screen.getByRole("status", { hidden: true })).toBeInTheDocument();
  });

  it("should display no keys configured message when no keys exist", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      groq: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(screen.getByText("No Keys Configured")).toBeInTheDocument();
      expect(
        screen.getByText("Add an API key to enable AI features"),
      ).toBeInTheDocument();
    });
  });

  it("should display correct counts when keys are configured", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: true,
        valid: true,
        lastTested: Date.now(),
        maskedKey: "sk-...1234",
        error: null,
      },
      groq: {
        configured: true,
        valid: false,
        lastTested: Date.now(),
        maskedKey: "gsk_...5678",
        error: "Invalid key",
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(screen.getByText("2")).toBeInTheDocument(); // Configured count
      expect(screen.getByText("1")).toBeInTheDocument(); // Valid count
      expect(screen.getByText("3")).toBeInTheDocument(); // Total count
    });
  });

  it("should display AI features available when at least one valid key exists", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: true,
        valid: true,
        lastTested: Date.now(),
        maskedKey: "sk-...1234",
        error: null,
      },
      groq: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(screen.getByText("AI Features Available")).toBeInTheDocument();
      expect(
        screen.getByText("1 provider configured and working"),
      ).toBeInTheDocument();
    });
  });

  it("should display validation warning when keys configured but not valid", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: true,
        valid: null,
        lastTested: null,
        maskedKey: "sk-...1234",
        error: null,
      },
      groq: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(screen.getByText("Keys Need Validation")).toBeInTheDocument();
      expect(
        screen.getByText("Please test your configured keys"),
      ).toBeInTheDocument();
    });
  });

  it("should display status for each provider", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: true,
        valid: true,
        lastTested: Date.now(),
        maskedKey: "sk-...1234",
        error: null,
      },
      groq: {
        configured: true,
        valid: false,
        lastTested: Date.now(),
        maskedKey: "gsk_...5678",
        error: "Invalid",
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(screen.getByText("ChatGPT (OpenAI)")).toBeInTheDocument();
      expect(screen.getByText("Groq")).toBeInTheDocument();
      expect(screen.getByText("Gemini (Google)")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
      expect(screen.getByText("Invalid")).toBeInTheDocument();
      expect(screen.getByText("Not configured")).toBeInTheDocument();
    });
  });

  it("should display benefits notice when no valid keys exist", async () => {
    keyManager.getKeyStatuses.mockResolvedValue({
      chatgpt: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      groq: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
      gemini: {
        configured: false,
        valid: null,
        lastTested: null,
        maskedKey: null,
        error: null,
      },
    });

    render(<KeyStatusOverview />);

    await waitFor(() => {
      expect(
        screen.getByText("💡 Why provide your own API key?"),
      ).toBeInTheDocument();
      expect(
        screen.getByText(/Unlimited AI-powered expense parsing/),
      ).toBeInTheDocument();
    });
  });
});
