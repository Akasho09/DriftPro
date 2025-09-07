import RecentT from "../../../components/sendTrans";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";

export default function TransactionsPage() {
  return (
    <div className="min-h-screen w-full pt-28 px-4 flex flex-col items-center ">
      {/* Grid for RecentT and Recent Transactions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-4xl shadow-md rounded-xl bg-white p-4">
        <div>
          <RecentT />
        </div>
        <div>
          <ReTr n={1} />
        </div>
      </div>

      {/* Balance Section */}
      <div className="mt-8 w-full max-w-4xl">
        <Balance />
      </div>
    </div>
  );
}
