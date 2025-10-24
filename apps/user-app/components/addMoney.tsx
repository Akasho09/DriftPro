"use client";
import { Card } from "@repo/ui/card";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import getBal from "../lib/getBal";
import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";

const BANKS = [
  { name: "HDFC Bank", id: "HDFC", redirectUrl: "https://bank-bre4.onrender.com/hdfcwebhook" },
  // { name: "HDFC Bank", id: "HDFC", redirectUrl: "http://localhost:3004/hdfcwebhook" },
  { name: "Axis Bank", id: "AXIS", redirectUrl: "https://www.axisbank.com/" },
];

interface AddMoneyProps {
  prefillAmount?: number;
  onAmountChange?: (value: number | undefined) => void;
}

export default function AddMoney({ prefillAmount, onAmountChange }: AddMoneyProps) {
  const [amount, setAmount] = useState<number | undefined>(prefillAmount);
  const [providerId, setProviderId] = useState(BANKS[0]?.id || "");
  const [isLoading, setIsLoading] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  const projectedBalance = balance !== null && amount ? balance + amount : balance;
  const selectedProvider = BANKS.find(bank => bank.id === providerId);

  // Fetch balance
  const fetchBalance = async () => {
    try {
      const data = await getBal();
      if (data) setBalance(data.amount / 100);
    } catch (err) {
      console.error("Failed to fetch balance:", err);
    }
  };

  // Handle amount input changes
  const handleAmountChange = (value: number | undefined) => {
    setAmount(value);
    onAmountChange && value && onAmountChange(value);
  };

  // Polling transaction status
 const checkStatus = async (token: string, toastId?: string) => {
    try {
      toast.dismiss(toastId)
      const { data } = await axios.get(`/api/transaction-status?token=${token}`);
      if(!data) return
      if (data.status === "Success") {
        toast.dismiss(toastId);
        localStorage.removeItem("pendingTransaction");
        await fetchBalance();
        return;
      } else if (data.status === "Failure") {
        toast.dismiss(toastId); // remove loading toast
        toast.error("Transaction failed!");
        localStorage.removeItem("pendingTransaction");
        return;
      } else if (data.status === "Processing"){
        const toastId = toast.loading(`Transaction still processing...`, {
          style: {
            border: "1px solid #facc15", // yellow border
            padding: "16px",
            color: "#b45309", // amber text
            fontWeight: "bold",
            borderRadius: "12px",
            fontSize: "14px",
          },
          icon: "⏳",
        });
         setTimeout(() => checkStatus(token , toastId), 5000);
      }
    } catch (error) {
      console.error("Status check error:", error);
      toast.error("Backend Error!");
      localStorage.removeItem("pendingTransaction");
    }
  };

  // Handle Add Money
  const handleAddMoney = useCallback(async () => {
    if (!amount || amount <= 0) {
      toast.error("Please enter a valid amount greater than ₹0.");
      return;
    }

    if (!providerId || !selectedProvider) {
      toast.error("Please select a bank provider.");
      return;
    }

    setIsLoading(true);
    try {
      const transactionResult = await onRampTrans(amount, selectedProvider.name);

      if (transactionResult?.error) {
        toast.error(transactionResult.error, {
          duration: 2000,
          position: "top-center",
          style: { border: "1px solid #ef4444", padding: "14px", color: "#7f1d1d", fontWeight: "bold" },
          icon: "⚠️",
        });
        return;
      }

      if (!transactionResult?.token) {
        toast.error("Transaction could not be initiated. Please try again later.");
        return;
      }

      // Store token in localStorage for polling
      localStorage.setItem("pendingTransaction", JSON.stringify({
        token: transactionResult.token,
        amount,
        provider: selectedProvider.name,
        timestamp: Date.now(),
      }));

      checkStatus(transactionResult.token);
      await axios.post(selectedProvider.redirectUrl, { token: transactionResult.token });

      handleAmountChange(undefined);

      toast.dismiss()
      toast.success(`Transfer of ₹${amount} via ${selectedProvider.name} Sucesses!`, {
        duration: 5000,
        position: "top-center",
        style: { border: "1px solid #4ade80", padding: "16px", color: "#166534", fontWeight: "bold", fontSize: "16px" },
        icon: "💸",
      });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.error || "Something went wrong while processing your request.",
        { duration: 5000, position: "top-center", style: { border: "1px solid #ef4444", padding: "16px", color: "#7f1d1d", fontWeight: "bold" }, icon: "🚫" }
      );
    } finally {
      setIsLoading(false);
    }
  }, [amount, providerId, selectedProvider]);

  // On mount, fetch balance and check pending transaction
  useEffect(() => {
    if (prefillAmount) setAmount(prefillAmount);
    fetchBalance();
  }, [prefillAmount]);

  return (
    <Card title="💰 Add Money" className="bg-white/90 w-full max-w-md p-10 backdrop-blur-xl rounded-3xl shadow-2xl border border-green-200">
      <div className="mb-4 text-center">
        <p className="text-gray-700 font-medium">Current Balance:</p>
        <p className="text-2xl font-bold text-green-600">₹{balance?.toFixed(2) ?? ""}</p>
        {amount && amount > 0 && (
          <p className="text-sm mt-1 text-gray-700">
            Projected Balance: <span className="font-semibold text-green-700">₹{projectedBalance?.toFixed(2)}</span>
          </p>
        )}
      </div>

      {/* Quick Amount Buttons */}
      <div className="flex gap-2 mb-4 justify-center">
        {[100, 500, 1000, 2000].map((val) => (
          <Button
            key={val}
            onClick={() => handleAmountChange(val)}
            className={`px-4 py-1 rounded-lg text-sm ${amount === val ? "bg-pink-400 text-white" : "bg-green-300 text-black"} transition`}
          >
            ₹{val}
          </Button>
        ))}
      </div>

      {/* Amount Input */}
      <InputCompo
        label="Amount (₹)"
        placeholder="Enter amount"
        inputtype="number"
        min={1}
        value={amount === undefined ? "" : amount.toString()}
        onChange={(e) => {
          const num = Number(e);
          handleAmountChange(num >= 0 ? num : undefined);
        }}
        className="w-full p-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400 transition mb-6"
      />

      {/* Bank Dropdown */}
      <DropDown
        title="Bank Provider"
        items={BANKS.map((b) => b.name)}
        onSelect={(name) => setProviderId(BANKS.find(b => b.name === name)?.id || "")}
        className="w-full p-4 border border-green-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pink-300 transition mb-6"
      />

      {/* Action Button */}
      <Button
        className="w-full py-3 bg-green-500 hover:bg-pink-400 text-white text-lg font-semibold rounded-xl shadow-md disabled:opacity-60 disabled:cursor-not-allowed transition duration-150 ease-in-out"
        onClick={handleAddMoney}
        disabled={isLoading || !amount || amount <= 0 || !providerId}
      >
        {isLoading ? "Processing Transaction..." : "Initiate Transfer"}
      </Button>

      <p className="mt-4 text-center text-green-700 text-sm">
        💡 Transfers are instant for supported bank accounts. Please verify your bank details.
      </p>
    </Card>
  );
}
