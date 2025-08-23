/*
  Warnings:

  - Added the required column `userId` to the `Task` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "public"."TaskStatus" AS ENUM ('todo', 'in_progress', 'done');

-- AlterTable
ALTER TABLE "public"."Task" ADD COLUMN     "status" "public"."TaskStatus" NOT NULL DEFAULT 'todo',
ADD COLUMN     "userId" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "Task_userId_status_dueDate_idx" ON "public"."Task"("userId", "status", "dueDate");
