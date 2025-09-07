import AddMoney from "../../../components/addMoney";
import Balance from "../../../components/Balance";
import ReTr from "../../../components/RecentTrans";

export default function WalletPage() {
  return (
    <div className="mt-24 container mx-auto px-4 py-8">
      <div className="flex flex-col md:grid md:grid-cols-2 gap-6">
        
        {/* Add Money Section */}
        <div className="w-full">
          <AddMoney />
        </div>

        {/* Balance Section */}
        <div className="w-full">
          <Balance />
        </div>
        
        {/* Recent Transactions spans full width on small screens and two columns on larger */}
        <div className="md:col-span-2 w-full">
          <ReTr n={1} />
        </div>
        
      </div>
    </div>
  );
}
