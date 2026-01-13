"use client";

import Link from "next/link";
import Image from "next/image";
import { useEffect, useMemo, useRef, useState } from "react";
import { NotificationBell } from "./notifis";

interface AppbarProps {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
    mobile?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Topbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const greeting = useMemo(
    () => user?.name || user?.email || user?.mobile || "Login First",
    [user]
  );

  const menuItems = user
    ? [
        { label: "Profile", href: "/profile" },
        { label: "Update Profile", href: "/profile/update" },
        { label: "Logout", onClick: onSignout, className: "text-pink-600" },
      ]
    : [{ label: "Login", onClick: onSignin, className: "text-green-600" }];

  return (
    <div className="
      fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl
      bg-white/70 backdrop-blur-md shadow-lg border border-green-200
      rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between
      z-50
    ">
      {/* LOGO */}
      <Link
        href="/dashboard"
        className="text-3xl font-extrabold bg-yellow-900 bg-clip-text text-transparent"
      >
        DriftPro
      </Link>

      {/* RIGHT */}
      <div className="flex items-center gap-4 md:gap-6">

        {/* 🔔 Notifications */}
        <NotificationBell user={user} />

        {/* 👤 Profile */}
        <div ref={dropdownRef} className="relative">
          <button
            onClick={() => setMenuOpen((p) => !p)}
            className="w-10 h-10 border-2 rounded-full flex items-center justify-center bg-green-100 hover:scale-105 transition"
          >
            {!user?.image ? (
              <span className="text-xl">🌸</span>
            ) : (
              <Image
                src={user.image}
                alt="Avatar"
                width={40}
                height={40}
                className="rounded-full"
              />
            )}
          </button>

          <div
            className={`
              absolute top-14 right-0 w-56 bg-white/90 border border-green-200 
              shadow-xl rounded-xl py-2 transition
              ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
          >
            <div className="px-4 py-2 border-b text-sm text-gray-600">
              Signed in as <br />
              <span className="font-semibold">{greeting}</span>
            </div>

            {menuItems.map((item, i) =>
              item.href ? (
                <Link
                  key={i}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm hover:bg-green-50"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={i}
                  onClick={async () => {
                    setMenuOpen(false);
                    setLoadingAction(true);
                    if (item.onClick) {
                      await item.onClick();
                    }
                    setLoadingAction(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 ${item.className}`}
                >
                  {loadingAction ? "Processing..." : item.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* Greeting */}
        <div className="hidden sm:block text-sm text-gray-700">
          Hello, <span className="font-semibold">{greeting}</span>
        </div>
      </div>
    </div>
  );
};
