"use client";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

interface Notification {
  id: string;
  amount: number;
  fromMsg?: string | null;
}

interface NotificationBellProps {
  user?: any;
}

export const NotificationBell = ({ user }: NotificationBellProps) => {
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [notifCount, setNotifCount] = useState(0);

  const notifRef = useRef<HTMLDivElement>(null);

  // Fetch notifications
  useEffect(() => {
    if (!user) return;

    const fetchNotifications = async () => {
      const res = await fetch("/api/notifications");
      const data = await res.json();

      setNotifications(data.notifications);
      setNotifCount(data.count);
    };

    fetchNotifications();
  }, [user]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (notifRef.current && !notifRef.current.contains(e.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={notifRef} className="relative">
      <button
        onClick={() => {
          setNotifOpen((prev) => !prev);
          setNotifCount(0); // mark as seen (UI-level)
        }}
        className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white hover:bg-gray-100 transition"
      >
        <span className="text-xl">🔔</span>

        {notifCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white 
            text-xs font-bold w-5 h-5 flex items-center justify-center 
            rounded-full animate-pulse"
          >
            {notifCount}
          </span>
        )}
      </button>

      {/* DROPDOWN */}
      <div
        className={`
          absolute top-14 right-0 w-80 max-w-[90vw]
          bg-white/95 backdrop-blur-md border border-gray-200 shadow-2xl 
          rounded-xl py-2 z-50
          transform transition-all duration-300
          ${notifOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
        `}
      >
        <div className="px-4 py-2 border-b text-sm font-semibold text-gray-700">
          Notifications
        </div>

        {notifications.length === 0 ? (
          <div className="text-center p-6 text-gray-500 text-sm">
            No notifications yet ✨
          </div>
        ) : (
          notifications.map((n) => (
            <Link
              key={n.id}
              href="/requests"
              className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-100/80 transition rounded-md"
            >
              <p className="font-medium text-gray-800">
                💰 Money request of ₹{n.amount}
              </p>

              {n.fromMsg && (
                <span className="text-xs text-gray-600 italic">
                  “{n.fromMsg}”
                </span>
              )}

              <span className="text-xs text-gray-500">
                Just now
              </span>
            </Link>
          ))
        )}
      </div>
    </div>
  );
};
