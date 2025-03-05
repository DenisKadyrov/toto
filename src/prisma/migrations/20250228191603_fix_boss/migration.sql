-- DropForeignKey
ALTER TABLE "users" DROP CONSTRAINT "users_bossId_fkey";

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "bossId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_bossId_fkey" FOREIGN KEY ("bossId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
