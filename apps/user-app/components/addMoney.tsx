"use client";
import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const Banks = [
  { name: "HDFC Bank", redirectUrl: "https://bank-bre4.onrender.com" },
  { name: "Axis Bank", redirectUrl: "https://www.axisbank.com/" },
];

export default function AddMoney() {
  const [amount, setAmount] = useState<number>(0);
  const [provider, setProvider] = useState<string>(Banks[0]?.name || "");
  const [redirectUrl, setRedirectUrl] = useState<string>(
    Banks[0]?.redirectUrl || ""
  );
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleAddMoney = async () => {
    if (amount <= 0) {
      alert("⚠️ Please enter a valid amount greater than 0.");
      return;
    }

    setLoading(true);
    try {
      const d = await onRampTrans(amount, provider);

      await axios.post('https://bank-bre4.onrender.com/hdfcwebhook', {
        token: `${d.token}`,
      });

        setLoading(false);
        alert("✅ Money added successfully!");
        router.refresh();

    } catch (error) {
      console.error("Error processing transaction:", error);
      alert("❌ Transaction failed. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center w-full ">

      {/* Loading Overlay */}
      {loading && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center space-y-3 w-[300px]">
            <div className="text-xl font-semibold text-gray-800">⏳ Processing</div>
            <p className="text-gray-700 text-sm">
              ⏳ Verifying payment from the { provider } of amount <span className="font-semibold">₹{amount}</span>  .
            </p>
            <p className="text-gray-600 text-sm mt-1">
              Please wait while the request is completed. <br />
              ⚠️ Do not press back or refresh.
            </p>
          </div>
        </div>
      )}

      {/* Page Content */}
      <Card
        title="💰 Add Money to Wallet"
        className="w-full max-w-md p-0 overflow-hidden border-0 shadow-xl rounded-2xl"
      >
        <div className="space-y-6 pt-6 p-4 border rounded-xl bg-gray-50 ">
          {/* Amount Input */}
          <InputCompo
            label="Enter Amount (₹)"
            inputtype="number"
            className="w-full border border-gray-300 rounded-lg p-3 text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            onChange={(e) => setAmount(Number(e))}
          />

          {/* Bank Selection */}
          <DropDown
            title="Select Bank"
            items={Banks.map((b) => b.name)}
            className="w-full border border-gray-300 rounded-lg p-3 bg-white text-gray-800 focus:ring-2 focus:ring-blue-500"
            onSelect={(e) => {
              setProvider(e);
              setRedirectUrl(
                Banks.find((x) => x.name === e)?.redirectUrl || ""
              );
            }}
          >
            <div className="text-blue-500 text-sm">
              🏦 Choose your bank from the list.
            </div>
          </DropDown>

          {/* Action Button */}
          <Button
            className="w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 rounded-lg shadow-md hover:scale-[1.02] hover:from-blue-600 hover:to-indigo-700 transition-all"
            onClick={handleAddMoney}
          >
            {loading ? "Processing..." : "Add Money"}
          </Button>
        </div>

      </Card>
    </div>
  );
}
