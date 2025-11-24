"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/navigation";
import { FiLoader, FiSend, FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import { getContacts } from "../lib/getBal";
import SendMoney from "../lib/sendMoney";
import RequestMoney from "../lib/requestMoney";
import { Button } from "@repo/ui/button";
import Image from "next/image";

interface Contact {
  id: string;
  name?: string | null;
  mobile: string | null;
  email: string | null;
  Image: string | null;
}

const LoadingSkeleton = () => (
  <div className="space-y-4 p-4">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-gray-200 animate-pulse" />
        <div className="flex-1 space-y-2">
          <div className="h-4 bg-gray-200 rounded w-3/4 animate-pulse" />
          <div className="h-3 bg-gray-200 rounded w-1/2 animate-pulse" />
        </div>
        <div className="h-8 w-20 bg-gray-200 rounded-md animate-pulse" />
      </div>
    ))}
  </div>
);

export default function ContactList() {
  const router = useRouter();

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [isOpen, setIsOpen] = useState(false);
  const [isRequest, setIsRequest] = useState(false);
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);

  const [amount, setAmount] = useState("");
  const [sending, setSending] = useState(false);


  const closeModal = useCallback(() => {
    setIsOpen(false);
    setAmount("");
    setSelectedContact(null);
    setIsRequest(false);
    setSending(false);
  }, []);

  const handleSend = useCallback(async () => {
    if (sending) return;

    const parsedAmount = Number(amount);
    if (!selectedContact || !parsedAmount || parsedAmount < 1 || !/^\d+$/.test(amount)) {
      toast.error("⚠️ Enter a valid whole amount (min ₹1).");
      return;
    }

    const toastText = isRequest ? "Requesting" : "Processing";
    const toastId = toast.loading(`${toastText} ₹${parsedAmount}...`);
    setSending(true);

    try {
      const paise = parsedAmount * 100;

      const response = isRequest
        ? await RequestMoney(selectedContact.mobile || "", paise)
        : await SendMoney(selectedContact.mobile || "", paise);

      if (response.success) {
        toast.success(response.message, { id: toastId });

        toast.success(
          isRequest
            ? `📥 Request sent to ${selectedContact.name || "User"} for ₹${parsedAmount}`
            : `💸 Sent ₹${parsedAmount} to ${selectedContact.name || "User"}`
        );

        closeModal();
        router.refresh();
      } else {
        toast.error(`❌ ${response.message}`, { id: toastId });
      }
    } catch (err: any) {
      toast.error(`❌ ${err?.message || "Network error"}`, { id: toastId });
    } finally {
      setSending(false);
    }
  }, [amount, selectedContact, isRequest, sending, closeModal, router]);

  useEffect(() => {
    let mounted = true;

    async function fetchContacts() {
      try {
        const data = await getContacts();
        if (mounted) {
          setContacts(Array.isArray(data) ? data : []);
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
      <div className="max-h-[500px] overflow-y-auto pr-2">
        <ul className="divide-y divide-gray-200/50">
          {contacts.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-3 px-3 rounded-lg hover:bg-green-50/80 transition-all cursor-pointer"
            >
              {/* LEFT */}
              <div className="flex items-center gap-1">
                <div className="relative h-10 w-10 rounded-full border border-green-300 overflow-hidden bg-gray-100 flex items-center justify-center shadow-sm">
                  {user.Image ? (
                    <Image
                      src={user.Image}
                      alt="User"
                      width={40}
                      height={40}
                      className="object-cover"
                    />
                  ) : (
                    <FiUser className="text-gray-700 text-lg" />
                  )}
                </div>
                <div>
                  <p className="text-sm font-semibold text-black">
                    {user.name || user.email || "Unnamed User"}
                  </p>
                  <p className="text-xs text-green-700 font-mono">📱 {user.mobile}</p>
                </div>
              </div>

              {/* ACTION BUTTONS */}
              <div className="flex gap-2">
                <Button
                  onClick={() => {
                    setSelectedContact(user);
                    setIsRequest(false);
                    setIsOpen(true);
                  }}
                  size="xs"
                >
                  <FiSend className="h-3 w-3" />
                  Pay
                </Button>

                <Button
                  onClick={() => {
                    setSelectedContact(user);
                    setIsRequest(true);
                    setIsOpen(true);
                  }}
                  size="xs"
                  className="bg-black"
                >
                  <FiSend className="h-3 w-3" />
                  Request
                </Button>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* ------------------------------
          MODAL
      ---------------------------------*/}
      {isOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex justify-center items-center z-50 p-4 animate-fadeIn">
          <div className="bg-white/95 rounded-3xl shadow-2xl w-full max-w-sm p-8 relative border border-green-200 animate-scaleIn">
            
            {/* CLOSE */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition text-xl"
            >
              ✕
            </button>

            {/* CONTACT INFO */}
            <div className="flex flex-col items-center gap-2 mb-6 p-5 rounded-xl border border-green-200 bg-green-50/40">
              <FiUser className="text-4xl text-black" />
              <p className="font-bold text-lg text-black">
                {selectedContact.name || "User"}
              </p>
              <p className="text-green-700 text-sm font-mono">
                {selectedContact.mobile}
              </p>
            </div>

            {/* AMOUNT INPUT */}
            <div className="mb-6">
              <label className="block text-sm font-semibold text-black mb-2">
                {isRequest ? "Amount to Request (₹)" : "Amount to Send (₹)"}
              </label>
              <input
                type="number"
                placeholder="Minimum ₹1"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="w-full border border-green-300 rounded-xl px-4 py-3 text-lg text-black bg-white/90 focus:ring-2 focus:ring-green-400 outline-none transition"
                min={1}
              />
            </div>

            {/* ACTION BUTTON */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-black via-zinc-800 to-yellow-500 hover:from-yellow-500 hover:to-black text-white font-semibold text-lg transition disabled:bg-gray-400 flex items-center justify-center gap-2"
            >
              {sending ? (
                <>
                  <FiLoader className="animate-spin" />
                  {isRequest ? "Requesting..." : "Processing..."}
                </>
              ) : (
                <>
                  <FiSend />
                  {isRequest ? "Request" : "Send"} ₹{amount || "0"}
                </>
              )}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
