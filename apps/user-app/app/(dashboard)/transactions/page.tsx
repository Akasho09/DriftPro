import RecentT from "../../../components/sendTrans";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";
import { Card } from "@repo/ui/card";

export default function TransactionsPage() {
  return (
    <div className="w-full pt-24">
    <Card
      title="Recent Transactions"
      className="w-full shadow-md rounded-xl m-4 bg-white"
    >
      <div className="divide-y divide-gray-300">
        <div className="py-4">
          <RecentT />
        </div>
        <div className="py-4">
          <ReTr n={1} />
        </div>
      </div>
    </Card></div>
    
  );
}
