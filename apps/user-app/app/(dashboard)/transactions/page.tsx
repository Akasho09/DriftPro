import { Suspense } from "react";
import Balance from "../../../components/Balance";
import AddMoneyTransactions from "../../../components/AddMoneyTrans";
import SendReceiveTransactions from "../../../components/sendTrans";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full pt-28 flex flex-col items-center">
      <section className="w-full mb-8">
        <Balance />
      </section>

      <section className="max-w-4xl w-full md:flex gap-2">
        <div className="md:w-[50%] mb-8 md:mb-0">
        <Suspense fallback={<div className="p-6 text-gray-500">Loading Send/Receive Transactions...</div>}>
          <SendReceiveTransactions />
        </Suspense>
        </div>
        <div className="md:w-[50%]">
        <Suspense fallback={<div className="p-6 text-gray-500">Loading Add Money Transactions...</div>}>
          <AddMoneyTransactions/>
        </Suspense>
        </div>
      </section>

    </div>
  );
}
