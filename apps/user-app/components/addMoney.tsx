"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import getBal from "../lib/getBal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiLoader, FiPlusCircle } from "react-icons/fi";
import { useRouter } from "next/navigation";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("opacity-0", "translate-y-8");

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            setTimeout(() => {
              el.classList.remove("opacity-0", "translate-y-8");
              el.classList.add("opacity-100", "translate-y-0");
            }, delay);
          }
        });
      },
      { threshold: 0.2 }
    );

    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);

  return ref;
}

const BANKS = [
  { name: "Drift Bank", id: "Drift", redirectUrl: "https://bank-bre4.onrender.com/driftpro" },
  { name: "HDFC Bank", id: "HDFC", redirectUrl: "http://localhost:3004/driftpro" },
  { name: "Axis Bank", id: "AXIS", redirectUrl: "https://www.axisbank.com/" },
];

export default function AddMoney() {
  const router = useRouter();
  const headerRef = useReveal();
  const cardRef = useReveal(100);

  const [amount, setAmount] = useState<number | undefined>();
  const [providerId, setProviderId] = useState(BANKS[0]?.id || "");
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const projectedBalance = balance !== null && amount ? balance + amount : balance;
  const selectedProvider = BANKS.find((b) => b.id === providerId);

  const fetchBalance = async () => {
    try {
      const data = await getBal();
      if (data) setBalance(data.amount / 100);
    } catch (e) {
      console.error("Balance fetch failed:", e);
    }
  };

  const handleAddMoney = useCallback(async () => {
    const toastId = toast.loading("Initiating transaction...");

    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid amount.", { id: toastId });
    }

    if (!selectedProvider) {
      return toast.error("Invalid bank selection.", { id: toastId });
    }

    setIsLoading(true);

    try {
      const result = await onRampTrans(amount, providerId);

      if (!result.token) {
        return toast.error("Failed to initiate transaction.", { id: toastId });
      }
      if (result.error) {
        return toast.error(result.error, { id: toastId });
      }

      await axios.post(selectedProvider.redirectUrl, { token: result.token });

      toast.success("Money added successfully!", { id: toastId });
      setAmount(undefined);
      fetchBalance();
    } catch (error) {
      const axiosError = error as any;
      toast.error(axiosError?.response?.data?.error || "Something went wrong.", { id: toastId });
    } finally {
      setIsLoading(false);
    }
  }, [amount, providerId, selectedProvider]);

  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen w-full pb-40">
      <div className="mx-auto w-full max-w-4xl px-4 pt-20 md:px-8 lg:px-12">

        {/* Header */}
        <header
          ref={headerRef}
          className="mb-16 text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-black via-zinc-800 to-yellow-500 bg-clip-text text-transparent drop-shadow-sm md:text-5xl">
            Top-up your wallet
          </h1>
          <p className="mx-auto max-w-2xl leading-relaxed text-lg text-slate-700">
            Add Money securely using your preferred bank provider.
          </p>
        </header>

        {/* Main Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl overflow-hidden hover:shadow-2xl transition">

            {/* Content */}
            <div className="p-6 sm:p-10 bg-gradient-to-br from-green-50 via-white to-pink-50">

              {/* Balance */}
              <div className="text-center mb-10">
                <p className="text-gray-600 font-medium">Current Balance</p>
                <p className="text-4xl font-extrabold text-emerald-600">
                  ₹{balance?.toFixed(2) ?? "--"}
                </p>

                {amount && amount > 0 && (
                  <p className="text-sm mt-1 text-gray-600">
                    Projected:{" "}
                    <span className="font-semibold text-green-700">
                      ₹{projectedBalance?.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>

              {/* Quick Buttons */}
              <div className="flex gap-3 mb-6 justify-center">
                {[100, 500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`
                      px-2 md:px-4 py-2 text-xs md:text-sm rounded-lg font-medium transition-all
                      ${amount === val
                        ? "bg-gradient-to-r from-black via-zinc-800 to-yellow-500 text-white shadow-md scale-105"
                        : "border text-black hover:bg-gradient-to-r hover:from-black hover:via-zinc-400 hover:to-yellow-400"}
                    `}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Amount Input */}
              <div className="mb-6">
                <InputCompo
                  label="Amount (₹)"
                  placeholder="Enter amount"
                  inputtype="number"
                  min={1}
                  value={amount ?? ""}
                  onChange={(e) => {
                    const val = Number(e);
                    setAmount(val > 0 ? val : undefined);
                  }}
                  className="w-full p-4 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 transition"
                />
              </div>

              {/* Bank Dropdown */}
              <DropDown
                title="Bank Provider"
                items={BANKS.map((b) => b.name)}
                onSelect={(name) => setProviderId(BANKS.find(b => b.name === name)?.id || "")}
                className="w-full border border-green-300 rounded-lg p-3 mb-6 focus:ring-2 focus:ring-pink-300 transition"
              />

              {/* Add Money Button */}
              <Button
                onClick={handleAddMoney}
                disabled={isLoading || !amount}
                fullWidth
                >
                {isLoading ? (
                  <>
                  <div className="flex gap-2 justify-center items-center">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </div>
                  </>
                ) : (
                  <>
                  <div className="flex gap-2 justify-center items-center">
                    <FiPlusCircle />
                    Add ₹{amount || "0"}
                  </div>

                  </>
                )}
              </Button>

              {/* Back */}
              <button
                onClick={() => router.push("/wallet")}
                className="mt-6 px-6 py-3 bg-black text-white rounded-lg hover:bg-gray-800 transition shadow-md"
              >
                ← Back to Wallet Dashboard
              </button>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

