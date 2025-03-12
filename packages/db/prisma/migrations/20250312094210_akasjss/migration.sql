-- DropForeignKey
ALTER TABLE "p2ptransactions" DROP CONSTRAINT "p2ptransactions_fromNum_fkey";

-- DropForeignKey
ALTER TABLE "p2ptransactions" DROP CONSTRAINT "p2ptransactions_toNum_fkey";

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_fromNum_fkey" FOREIGN KEY ("fromNum") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_toNum_fkey" FOREIGN KEY ("toNum") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;
