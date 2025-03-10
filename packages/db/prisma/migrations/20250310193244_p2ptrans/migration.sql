-- CreateTable
CREATE TABLE "p2ptransactions" (
    "id" SERIAL NOT NULL,
    "fromNum" TEXT NOT NULL,
    "toNum" TEXT NOT NULL,

    CONSTRAINT "p2ptransactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_fromNum_fkey" FOREIGN KEY ("fromNum") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "p2ptransactions" ADD CONSTRAINT "p2ptransactions_toNum_fkey" FOREIGN KEY ("toNum") REFERENCES "User"("mobile") ON DELETE RESTRICT ON UPDATE CASCADE;
