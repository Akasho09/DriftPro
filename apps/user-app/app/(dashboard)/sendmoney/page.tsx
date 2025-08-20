
import Send from "../../../components/sendMoney";
import B from "../../../components/sendTrans";

export default function () {
  return (
    <div className="min-h-screen w-full pt-36 px-6 flex flex-col items-center gap-8">
      {/* Page Title */}
      <h1 className="text-3xl font-bold text-gray-800 flex ">💳 Wallet Dashboard</h1>

        {/* Left: Send Money */}
        <div className="w-full p-6">
          <Send />
        </div>

          <B />
      
      </div>
  );
}
