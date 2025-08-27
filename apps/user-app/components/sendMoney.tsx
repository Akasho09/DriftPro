"use client";

import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { Button } from "@repo/ui/button";
import SendMoney from "../lib/sendMoney";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SendM() {
  const router = useRouter();
  const [amount, setAmount] = useState<number>(0);
  const [to, setTo] = useState<string>("");
  const [loading, setLoading] = useState(false);

  async function handleSend() {
    setLoading(true)
    if (!to || isNaN(amount) || amount < 1) {
      alert("⚠️ Enter a valid mobile number or UPI id & amount (min ₹1).");
      return;
    }

    const response = await SendMoney(to, amount*100);
    alert(response);
    setLoading(false)
    router.refresh()
  }

  return (
    
    <div className="flex justify-center items-center w-full pt-4 from-orange-300 via-pink-500 to-red-200">
    {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-3 w-[300px]">
            <div className="text-xl font-semibold text-gray-800">⏳ Processing</div>
            <p className="text-gray-700 text-sm">
              ⏳ Sending amount of <span className="font-semibold">₹{amount} </span>  
              to <span className="font-semibold">{ to }</span>.
             </p>
             <p className="text-gray-600 text-sm mt-1">
              Please wait while the request is completed. <br />
              ⚠️ Do not press back or refresh.
            </p>
          </div>
        </div>
      )}
      <Card
        title="💸 Send Money"
        className="h-1/2 w-full max-w-md p-0 overflow-hidden border-0 shadow-xl rounded-2xl"
      >
        {/* Gradient Header */}
        <div className="bg-gradient-to-r from-blue-400 to-indigo-600 text-white px-6 py-4">
          <h2 className="text-xl font-semibold">Transfer Instantly</h2>
          <p className="text-sm text-blue-100">Send money securely in seconds</p>
        </div>

        {/* Form Body */}
        <div className="p-6 space-y-6 bg-gray-50">
          <InputCompo
            label="Receiver's Mobile Number / UPI id"
            inputtype="tel"
            onChange={(e) => setTo(String(e))}
            className="w-full"
          />

          <InputCompo
            label="Amount (₹)"
            inputtype="number"
            onChange={(e) => setAmount(Number(e))}
            className="w-full"
          />

          {/* Centered Button */}
          <div className="flex justify-center">
            <Button
              onClick={handleSend}
              className="px-6 py-2.5 bg-green-600 hover:bg-blue-700 rounded-lg shadow-md text-lg font-medium"
            >
            {loading ? "Verifying Details..." : "🚀 Send Money"}
            </Button>
          </div>
        </div>

        {/* Preview Card */}
        {(to || amount > 0) && (
          <div className="bg-white border-t border-gray-200 px-6 py-4 text-sm text-gray-700">
            <p>
              <span className="font-medium">To:</span> {to || "—"}
            </p>
            <p>
              <span className="font-medium">Amount:</span>{" "}
              {amount > 0 ? `₹${amount}` : "—"}
            </p>
          </div>
        )}
      </Card>
    </div>
  );
}

