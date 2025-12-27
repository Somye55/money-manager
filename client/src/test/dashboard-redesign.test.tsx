import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import {
  BalanceCard,
  ExpenseSummaryCard,
  CategoryBreakdownCard,
  QuickActionsCard,
  EmptyStateCard,
} from "../components/dashboard";

describe("Dashboard Redesign Components", () => {
  describe("BalanceCard", () => {
    it("should render balance information with modern styling", () => {
      const { container } = render(
        <BalanceCard
          balance={5000}
          monthlyBudget={10000}
          totalExpense={5000}
          currencySymbol="₹"
        />
      );

      const card = container.querySelector('[class*="bg-gradient-to-br"]');
      expect(card).toBeTruthy();
      expect(screen.getByText("Current Balance")).toBeInTheDocument();
      expect(screen.getByText("₹5,000")).toBeInTheDocument();
    });

    it("should show over budget indicator when expenses exceed budget", () => {
      render(
        <BalanceCard
          balance={-2000}
          monthlyBudget={8000}
          totalExpense={10000}
          currencySymbol="₹"
        />
      );

      expect(screen.getByText("Over Budget")).toBeInTheDocument();
      expect(screen.getByText("₹-2,000")).toBeInTheDocument();
    });
  });

  describe("ExpenseSummaryCard", () => {
    it("should render expense summary with gradient styling", () => {
      const { container } = render(
        <ExpenseSummaryCard
          totalExpense={3500}
          expenseCount={15}
          currencySymbol="₹"
          currentMonth="December 2024"
        />
      );

      const card = container.querySelector('[class*="bg-gradient-to-br"]');
      expect(card).toBeTruthy();
      expect(screen.getByText("Total Expenses")).toBeInTheDocument();
      expect(screen.getByText("₹3,500")).toBeInTheDocument();
      expect(screen.getByText("15 expenses")).toBeInTheDocument();
    });
  });

  describe("QuickActionsCard", () => {
    it("should render action buttons with proper styling", () => {
      const mockNavigate = vi.fn();
      const { container } = render(
        <QuickActionsCard onNavigate={mockNavigate} expenseCount={10} />
      );

      expect(screen.getByText("Add Expense")).toBeInTheDocument();
      expect(screen.getByText("View All")).toBeInTheDocument();
      expect(screen.getByText("10 expenses")).toBeInTheDocument();

      // Check for gradient styling
      const gradientButtons = container.querySelectorAll(
        '[class*="bg-gradient-to-br"]'
      );
      expect(gradientButtons.length).toBeGreaterThan(0);
    });
  });

  describe("EmptyStateCard", () => {
    it("should render welcome message and call-to-action", () => {
      const mockAddExpense = vi.fn();
      render(<EmptyStateCard onAddExpense={mockAddExpense} />);

      expect(screen.getByText("Welcome to Money Manager!")).toBeInTheDocument();
      expect(screen.getByText("Add Your First Expense")).toBeInTheDocument();
      expect(
        screen.getByText(/Start tracking your expenses/)
      ).toBeInTheDocument();
    });
  });

  describe("CategoryBreakdownCard", () => {
    it("should render empty state when no categories", () => {
      render(
        <CategoryBreakdownCard
          categoryTotals={{}}
          totalExpense={0}
          currencySymbol="₹"
          categories={[]}
        />
      );

      expect(screen.getByText("No expense categories yet")).toBeInTheDocument();
    });

    it("should render category data with proper styling", () => {
      const categoryTotals = {
        Food: { total: 1500, color: "#ef4444", count: 5 },
        Transport: { total: 800, color: "#3b82f6", count: 3 },
      };

      const categories = [
        { name: "Food", icon: "Utensils", color: "#ef4444" },
        { name: "Transport", icon: "Car", color: "#3b82f6" },
      ];

      render(
        <CategoryBreakdownCard
          categoryTotals={categoryTotals}
          totalExpense={2300}
          currencySymbol="₹"
          categories={categories}
        />
      );

      expect(screen.getByText("Category Breakdown")).toBeInTheDocument();
      expect(screen.getByText("₹2,300")).toBeInTheDocument();
    });
  });
});
