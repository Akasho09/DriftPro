"use client";
import AddMoney from "../../../components/addMoney";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMoneyPage() {
  const router = useRouter();
  const [amount, setAmount] = useState<number | undefined>(undefined);
  
  return (
    <div className="min-h-screen w-full pt-28 px-4 flex flex-col items-center ">
      
      <div className="text-center mb-8">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-center text-black">
        💸 Add <span className="text-emerald-600">Money</span>  to Wallet
        </h1>
        <p className="text-gray-600 mt-2">
          Securely add funds using your preferred bank or provider.
        </p>
      </div>

      <div className="rounded-2xl shadow-xl hover:shadow-2xl transition duration-300 w-full max-w-md ">
        <AddMoney 
          prefillAmount={amount} 
          onAmountChange={setAmount} 
        />
      </div>

      {/* Info / Notes */}
      <div className="mt-6 text-sm text-gray-500 max-w-md text-center">
        💡 All transactions are processed securely. Funds usually reflect instantly.
      </div>

      {/* Back to Wallet Button */}
      <button
        onClick={() => router.push("/wallet")}
        className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md"
      >
        ← Back to Wallet Dashboard
      </button>
    </div>
  );
}
