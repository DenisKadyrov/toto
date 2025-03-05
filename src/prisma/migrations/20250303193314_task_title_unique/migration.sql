/*
  Warnings:

  - The values [CREATED] on the enum `Status` will be removed. If these variants are still used in the database, this will fail.
  - A unique constraint covering the columns `[title]` on the table `tasks` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "Status_new" AS ENUM ('PENDING', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED');
ALTER TABLE "tasks" ALTER COLUMN "status" TYPE "Status_new" USING ("status"::text::"Status_new");
ALTER TYPE "Status" RENAME TO "Status_old";
ALTER TYPE "Status_new" RENAME TO "Status";
DROP TYPE "Status_old";
COMMIT;

-- CreateIndex
CREATE UNIQUE INDEX "tasks_title_key" ON "tasks"("title");
