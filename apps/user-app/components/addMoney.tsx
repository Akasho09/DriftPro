"use client";
import { useEffect, useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import { InputCompo } from "@repo/ui/input-compo";
import { DropDown } from "@repo/ui/drop-down";
import { Button } from "@repo/ui/button";
import onRampTrans from "../lib/onRampTransaction";
import getBal from "../lib/getBal";
import axios from "axios";
import { toast } from "react-hot-toast";
import { FiLoader, FiPlusCircle } from "react-icons/fi";


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
  {
    name: "Drift Bank",
    id: "Drift",
    redirectUrl: "https://bank-bre4.onrender.com/driftpro",
  },
  {
    name: "Local Bank",
    id: "HDFC",
    redirectUrl: "http://localhost:3004/driftpro",
  },
  {
    name: "Axis Bank",
    id: "AXIS",
    redirectUrl: "https://www.axisbank.com/",
  },
];

export default function AddMoney() {
  const router = useRouter();
  const headerRef = useReveal();
  const cardRef = useReveal(100);
  const [amount, setAmount] = useState<number | undefined>();
  const [providerId, setProviderId] = useState(BANKS[0]?.id || "");
  const [balance, setBalance] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const projectedBalance =
    balance !== null && amount ? balance + amount : balance;

  const selectedProvider = BANKS.find((b) => b.id === providerId);

  const fetchBalance = async () => {
    try {
      const data = await getBal();
      if (data) setBalance(data.amount / 100); // convert paise → rupees
    } catch (e) {
      console.error("Balance fetch failed:", e);
    }
  };

  /**
   * Initiates Add Money flow
   * 1. Validate input
   * 2. Create on-ramp transaction
   * 3. Redirect token to bank webhook
   * 4. Refresh balance
   */
  const handleAddMoney = useCallback(async () => {
    const toastId = toast.loading("Initiating transaction...");

    // Input validation
    if (!amount || amount <= 0) {
      return toast.error("Please enter a valid amount.", { id: toastId });
    }

    if (!selectedProvider) {
      return toast.error("Invalid bank selection.", { id: toastId });
    }

    setIsLoading(true);

    try {
      // Step 1: Create transaction
      const result = await onRampTrans(amount, providerId);

      if (!result.token) {
        return toast.error("Failed to initiate transaction.", { id: toastId });
      }

      if (result.error) {
        return toast.error(result.error, { id: toastId });
      }

      // Step 2: Send token to bank webhook
      await axios.post(selectedProvider.redirectUrl, {
        token: result.token,
      });

      toast.success("Money added successfully!", { id: toastId });

      // Reset state and refresh balance
      setAmount(undefined);
      fetchBalance();
    } catch (error) {
      const axiosError = error as any;
      toast.error(
        axiosError?.response?.data?.error || "Something went wrong.",
        { id: toastId }
      );
    } finally {
      setIsLoading(false);
    }
  }, [amount, providerId, selectedProvider]);

  /**
   * Fetch balance on component mount
   */
  useEffect(() => {
    fetchBalance();
  }, []);

  return (
    <div className="min-h-screen w-full pb-40">
      <div className="mx-auto w-full max-w-4xl px-4 pt-20 md:px-8 lg:px-12">

        {/* Page Header */}
        <header
          ref={headerRef}
          className="mb-16 text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-black via-zinc-800 to-yellow-500 bg-clip-text text-transparent md:text-5xl">
            Top-up your wallet
          </h1>
          <p className="mx-auto max-w-2xl text-lg text-slate-700">
            Add Money securely using your preferred bank provider.
          </p>
        </header>

        {/* Main Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="rounded-3xl border bg-white shadow-xl overflow-hidden">

            <div className="p-6 sm:p-10 bg-gradient-to-br from-green-50 via-white to-pink-50">

              {/* Balance Display */}
              <div className="text-center mb-10">
                <p className="text-gray-600 font-medium">Current Balance</p>
                <p className="text-4xl font-extrabold text-emerald-600">
                  ₹{balance?.toFixed(2) ?? "--"}
                </p>

                {amount && amount > 0 && (
                  <p className="text-sm mt-1 text-gray-600">
                    Projected:
                    <span className="font-semibold text-green-700">
                      ₹{projectedBalance?.toFixed(2)}
                    </span>
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div className="flex gap-3 mb-6 justify-center">
                {[100, 500, 1000, 2000].map((val) => (
                  <button
                    key={val}
                    onClick={() => setAmount(val)}
                    className={`px-4 py-2 rounded-lg transition-all
                      ${
                        amount === val
                          ? "bg-black text-white scale-105"
                          : "border hover:bg-gray-100"
                      }`}
                  >
                    ₹{val}
                  </button>
                ))}
              </div>

              {/* Amount Input */}
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
              />

              {/* Bank Selector */}
              <DropDown
                title="Bank Provider"
                items={BANKS.map((b) => b.name)}
                onSelect={(name) =>
                  setProviderId(
                    BANKS.find((b) => b.name === name)?.id || ""
                  )
                }
              />

              {/* Submit Button */}
              <Button onClick={handleAddMoney} disabled={isLoading || !amount}>
                {isLoading ? (
                  <div className="flex gap-2 items-center">
                    <FiLoader className="animate-spin" />
                    Processing...
                  </div>
                ) : (
                  <div className="flex gap-2 items-center">
                    <FiPlusCircle />
                    Add ₹{amount || "0"}
                  </div>
                )}
              </Button>

              {/* Back Navigation */}
              <button
                onClick={() => router.push("/wallet")}
                className="mt-6 px-6 py-3 bg-black text-white rounded-lg"
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
