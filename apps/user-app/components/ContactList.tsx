"use client";

import { useEffect, useState } from "react";
import getContacts from "../lib/getContacts";
import { Card } from "@repo/ui/card";
import { FaUserCircle } from "react-icons/fa";
import SendMoney from "../lib/sendMoney";
import { useRouter } from "next/navigation";

export default function ContactList() {
  const [contacts, setContacts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Modal states
  const [isOpen, setIsOpen] = useState(false);
  const [selectedContact, setSelectedContact] = useState<any | null>(null);
  const [amount, setAmount] = useState<number>(0);
  const [sending, setSending] = useState(false);

  async function handleSend() {
    if (!selectedContact) return;
    if (!amount || isNaN(amount) || amount < 1) {
      alert("⚠️ Enter a valid amount (min ₹1).");
      return;
    }

    setSending(true);
    try {
      const response = await SendMoney(selectedContact.mobile, amount * 100);
      alert(response);
      setIsOpen(false);
      setAmount(0);
      setSelectedContact(null);
      router.refresh();
    } catch (err) {
      console.error(err);
      alert("❌ Failed to send money.");
    } finally {
      setSending(false);
    }
  }

  useEffect(() => {
    async function fetchContacts() {
      const data = await getContacts();
      setContacts(data);
      setLoading(false);
    }
    fetchContacts();
  }, []);

  if (loading) {
    return (
      <div className="w-full flex justify-center text-gray-500">
        ⏳ Loading contacts...
      </div>
    );
  }

  if (contacts.length === 0) {
    return (
      <div className="w-full flex justify-center text-red-500">
        No contacts found.
      </div>
    );
  }

  return (
    <>
      <Card
        title="📇 Your Contacts"
        subtitle="List of users registered in the system"
        variant="outlined"
        className="w-full max-w-lg"
      >
        <ul className="divide-y divide-gray-200">
          {contacts.map((user) => (
            <li
              key={user.id}
              className="flex items-center justify-between py-3 px-2 hover:bg-gray-50 rounded-lg transition"
            >
              {/* Left side - icon + name */}
              <div className="flex items-center gap-3">
                <FaUserCircle className="text-blue-500 text-3xl" />
                <div>
                  <p className="text-sm font-semibold text-gray-800">
                    {user.name || "Unnamed User"}
                  </p>
                  <p className="text-xs text-gray-500">
                    📱 {user.mobile || "N/A"}
                  </p>
                </div>
              </div>

              {/* Right side - button */}
              <button
                onClick={() => {
                  setSelectedContact(user);
                  setIsOpen(true);
                }}
                className="px-3 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600 text-sm"
              >
                Send Money
              </button>
            </li>
          ))}
        </ul>
      </Card>

      {/* Modal */}
      {isOpen && selectedContact && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-2xl shadow-lg w-96 p-6 relative">
            {/* Close */}
            <button
              onClick={() => {
                setIsOpen(false);
                setAmount(0);
                setSelectedContact(null);
              }}
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
            >
              ✖
            </button>

            {/* Contact Info */}
            <div className="flex flex-col items-center gap-2 mb-4">
              <FaUserCircle className="text-blue-500 text-5xl" />
              <p className="font-semibold text-lg">{selectedContact.name}</p>
              <p className="text-gray-600 text-sm">
                📱 {selectedContact.mobile}
              </p>
            </div>

            {/* Amount Input */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Enter Amount (₹)
              </label>
              <input
                type="number"
                value={amount || ""}
                onChange={(e) => setAmount(Number(e.target.value))}
                className="w-full border rounded-md px-3 py-2 focus:ring focus:ring-blue-300"
                min={1}
              />
            </div>

            {/* Send Button */}
            <button
              onClick={handleSend}
              disabled={sending}
              className="w-full py-2 rounded-lg bg-green-500 text-white hover:bg-green-600 font-semibold disabled:bg-gray-400"
            >
              {sending ? "Sending..." : "Send Money"}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
