"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiSend, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { getContacts } from "../lib/getBal";
import SendMoney from "../lib/sendMoney";

interface Contact {
  id: string;
  name?: string | null;
  mobile: string;
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-full bg-gray-200 animate-pulse"></div>
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"></div>
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse"></div>
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse"></div>
      </div>
    ))}
  </div>
);

export default function ContactList() {
  const router = useRouter();
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState<string>("");
  const [sending, setSending] = useState<boolean>(false);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setAmount("");
    setSelectedContact(null);
  }, []);

const handleSend = useCallback(async () => {
  if (sending) return;

  const parsedAmount = Number(amount);
  if (
    !selectedContact ||
    !parsedAmount ||
    parsedAmount < 1 ||
    !/^\d+$/.test(amount)
  ) {
    toast.error("⚠️ Enter a valid whole amount (min ₹1).");
    return;
  }

  setSending(true);
  const toastId = toast.loading(`Processing ₹${parsedAmount}...`);

  try {
    const response = await SendMoney(selectedContact.mobile, parsedAmount * 100);
    
    if (response.success) {
      toast.success(`✅ ${response.message}`, { id: toastId });
      toast.success(`💸 Sent ₹${parsedAmount} to ${selectedContact.name || "User"}`);
      closeModal();
      router.refresh();
    } else {
      toast.error(`❌ ${response.message}`, { id: toastId });
    }
  } catch (err: unknown) {
    console.error("Transfer error:", err);
    const message = err instanceof Error ? err.message : "Check your network.";
    toast.error(`❌ Failed: ${message}`, { id: toastId });
  } finally {
    setSending(false);
  }
}, [amount, selectedContact, router, sending, closeModal]);


  /* ---------- Fetch Contacts ---------- */
  useEffect(() => {
    let mounted = true;
    async function fetchContacts() {
      try {
        const data = await getContacts();
        if (mounted) {
          setContacts(data as Contact[]);
          setError(null);
        }
      } catch {
        if (mounted) setError("Failed to fetch contacts.");
      } finally {
        if (mounted) setLoading(false);
      }
    }

    fetchContacts();
    return () => {
      mounted = false;
    };
  }, []);

  /* ---------- UI ---------- */
  if (loading) return <LoadingSkeleton />;

  if (error)
    return (
      <div className="w-full text-center p-4 text-red-600 bg-red-50 rounded-xl border border-red-200/50">
        ⚠️ {error}
      </div>
    );

  if (contacts.length === 0)
    return (
      <div className="w-full text-center p-4 text-gray-500 italic">
        No registered contacts found.
      </div>
    );

  return (
    <>
      {/* Contact List */}
      <div className="max-h-[500px] overflow-y-auto pr-2">
        <ul className="divide-y divide-gray-200/50">
          {contacts.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-green-50 transition-all"
            >
              {/* Left Side */}
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 items-center justify-center rounded-full bg-green-100 border border-green-200">
                  <FiUser className="text-green-700 text-lg" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-green-700">📱 {user.mobile}</p>
                </div>
              </div>

              {/* Pay Button */}
              <button
                onClick={() => {
                  setSelectedContact(user);
                  setIsOpen(true);
                }}
                className="flex items-center gap-1 px-3 py-1.5 rounded-full bg-green-500 text-white hover:bg-green-600 text-xs font-medium transition"
              >
                <FiSend className="h-3 w-3" />
                Pay
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Modal */}
      {isOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-start z-50 p-4">
          <div className="bg-white/95 rounded-3xl shadow-xl w-full max-w-sm p-8 relative border border-green-200 animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition"
            >
              ✕
            </button>

            {/* Contact Info */}
            <div className="flex flex-col items-center gap-2 mb-6 p-4 bg-green-50 rounded-xl border border-green-200">
              <FiUser className="text-green-700 text-4xl" />
              <p className="font-bold text-lg text-black">{selectedContact.name || "User"}</p>
              <p className="text-green-700 text-sm font-mono">{selectedContact.mobile}</p>
            </div>

            {/* Amount Input */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                Amount to Send (₹)
              </label>
              <input
                type="number"
                placeholder="Minimum ₹1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-green-200 bg-green-50 rounded-lg px-4 py-3 text-lg text-black focus:ring-2 focus:ring-green-400 outline-none transition"
                min={1}
                required
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-lg transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {sending ? (
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
          </div>
        </div>
      )}
    </>
  );
}

