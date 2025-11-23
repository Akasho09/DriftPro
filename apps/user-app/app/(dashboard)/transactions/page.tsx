import { Suspense } from "react";
import Balance from "../../../components/Balance";
import AddMoneyTransactions from "../../../components/AddMoneyTrans";
import SendReceiveTransactions from "../../../components/sendTrans";

export default function DashboardPage() {
  return (
    <div className="min-h-screen w-full pt-28 px-4 flex flex-col items-center">
      <section className="w-full max-w-4xl mb-8">
        <Balance />
      </section>

      <section className="w-full max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-6 mb-8 items-start">
        <Suspense fallback={<div className="p-6 text-gray-500">Loading Send/Receive Transactions...</div>}>
          <SendReceiveTransactions />
        </Suspense>

        <Suspense fallback={<div className="p-6 text-gray-500">Loading Add Money Transactions...</div>}>
          <AddMoneyTransactions n={4} />
        </Suspense>
      </section>
    </div>
  );
}
