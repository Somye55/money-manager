-- AlterTable
ALTER TABLE "Category" ADD COLUMN "budget" DECIMAL(10,2);

-- CreateIndex
CREATE INDEX "Category_userId_budget_idx" ON "Category"("userId", "budget");
