import Send from "../../../components/sendMoney";
import B from "../../../components/sendTrans";
import ContactList from "../../../components/ContactList";

export default function WalletDashboard() {
  return (
    <div className="min-h-screen w-full pt-28 px-6 flex flex-col items-center">
      {/* Page Title */}
      <h1 className="text-4xl font-extrabold text-gray-800 mb-10 flex items-center gap-2">
        💳 Wallet Dashboard
      </h1>

      {/* Layout Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-6xl">
        {/* Left Column */}
        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-xl p-6 gap-4">
          <div className="mb-4"><Send /></div>
          <div><B /></div>
        </div>

        </div>

        <div className="space-y-8">
          <div className="bg-white shadow-md rounded-xl p-6">
            <ContactList />
          </div>
        </div>
      </div>
    </div>
  );
}
