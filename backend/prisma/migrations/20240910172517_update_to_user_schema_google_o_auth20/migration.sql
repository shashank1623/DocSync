-- AlterTable
ALTER TABLE "User" ADD COLUMN     "image" TEXT,
ADD COLUMN     "socialId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;
