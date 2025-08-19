import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";

export default function A() {
  return (
    <div className="min-h-screen w-full pt-36 pb-10 px-6 flex items-start justify-center">
      <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-8">
        
        {/* Left Section - Add Money */}
        <div className="flex justify-center bg-[#ebe6e6]">
          <AddMoney />
        </div>

        {/* Right Section - Balance + Recent Transactions */}
        <div className="space-y-6">
          <Balance />
          <ReTr n={0} />
        </div>
      </div>
    </div>
  );
}
