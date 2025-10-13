"use client";
import { useEffect, useRef, useState } from "react";
import ContactList from "./ContactList";
import SendMoneyAction from "../lib/sendMoney";
import { FiSend, FiLoader } from "react-icons/fi";
import { toast } from "react-hot-toast";

function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              node.classList.add("opacity-100", "translate-y-0");
              node.classList.remove("opacity-0", "translate-y-8");
            }, delay);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

export function WalletClient() {
  const headerRef = useReveal();
  const cardRef = useReveal(100);

  const [receiver, setReceiver] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async () => {
    const amt = Number(amount);

    if (!receiver) {
      toast.error("⚠️ Please enter a valid mobile number or UPI ID.");
      return;
    }
    if (!amt || amt < 1) {
      toast.error("⚠️ Enter a valid amount (minimum ₹1).");
      return;
    }

    setLoading(true);
    const toastId = toast.loading("Processing your transaction...");
    try {
      const response = await SendMoneyAction(receiver, amt * 100);
      toast.success(`✅ ${response || "Money sent successfully!"}`, { id: toastId });
      setReceiver("");
      setAmount("");
    } catch (error: any) {
      console.error("Send money failed:", error);
      toast.error("❌ Failed to send money. Please try again later.", { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full pb-40">
      <div className="mx-auto w-full max-w-5xl px-4 pt-24 md:px-8 lg:px-12">

        {/* Header */}
        <header
          ref={headerRef}
          className="mb-16 text-center opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <h1 className="mb-3 text-4xl font-extrabold bg-gradient-to-r from-black via-pink-400 to-green-600 bg-clip-text text-transparent drop-shadow-sm md:text-5xl">
            Wallet Dashboard
          </h1>
          <p className="mx-auto max-w-2xl leading-relaxed text-lg text-slate-700">
            Send, receive, and manage your funds effortlessly — all in one place.
          </p>
        </header>

        {/* Send Money + Contacts Card */}
        <div
          ref={cardRef}
          className="opacity-0 translate-y-8 transition-all duration-700 ease-out"
        >
          <div className="rounded-3xl border border-slate-200 bg-white shadow-xl backdrop-blur-xl flex flex-col lg:flex-row overflow-hidden transition hover:shadow-2xl">

            {/* Left: Send Money Form */}
            <div className="lg:w-2/3 p-6 sm:p-10 bg-gradient-to-br from-green-50 via-white to-pink-50">
              <h2 className="text-2xl font-semibold text-black mb-3">💸 Send Money</h2>
              <p className="text-sm text-slate-600 mb-6">
                Transfer funds securely to your trusted contacts or enter a mobile number / UPI ID.
              </p>

              {/* Form */}
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Receiver’s Mobile / UPI ID
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210 or user@upi"
                    value={receiver}
                    onChange={(e) => setReceiver(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none transition"
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    placeholder="Enter amount"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    className="w-full rounded-lg border border-gray-200 bg-gray-50 px-4 py-3 text-gray-700 focus:ring-2 focus:ring-green-400 outline-none transition"
                  />
                </div>

                <button
                  onClick={handleSend}
                  disabled={loading}
                  className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition disabled:bg-gray-400"
                >
                  {loading ? (
                    <>
                      <FiLoader className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    <>
                      <FiSend />
                      Send ₹{amount || "0"}
                    </>
                  )}
                </button>

                {(receiver || amount) && (
                  <div className="mt-4 p-4 rounded-lg bg-pink-50 border border-pink-100 text-gray-700 text-sm">
                    <p className="font-semibold text-pink-600 mb-1">🧾 Transaction Preview:</p>
                    <p><span className="font-medium">To:</span> {receiver || "—"}</p>
                    <p><span className="font-medium">Amount:</span> ₹{amount || "—"}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right: Pay Contacts */}
            <div className="lg:w-1/3 border-l border-slate-200 bg-white/90 flex flex-col">
              <div className="p-6 sm:p-8 bg-gradient-to-b from-white to-pink-50">
                <h2 className="text-2xl font-semibold text-black">👥 Pay Contacts</h2>
                <p className="mt-1 text-sm text-slate-600">
                  Quickly select a frequent contact to auto-fill the form.
                </p>
              </div>
              <div className="flex-1 overflow-y-auto p-6 sm:p-8 bg-gradient-to-b from-white to-green-50">
                <ContactList />
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
