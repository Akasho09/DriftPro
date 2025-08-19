
import Send from "../../../components/sendMoney";
import B from "../../../components/sendTrans";

export default function () {
  return (
    <div className="min-h-screen w-full pt-36 px-6 flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 mb-8">💳 Wallet Dashboard</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-6xl w-full">
        {/* Left: Send Money */}
        <div className=" rounded-2xl shadow-lg border border-gray-200 p-6">
          <Send />
        </div>

        {/* Right: Transactions */}
        <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
          <B />
        </div>
      </div>
    </div>
  );
}
