"use client";

import Link from "next/link";
import Image from "next/image";
import { useState, useEffect, useRef, useMemo } from "react";

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
  const [open, setOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Memoized greeting
  const greeting = useMemo(
    () => user?.name || user?.email || user?.mobile || "Login First",
    [user]
  );

  // Menu items array for cleaner mapping
  const menuItems = user
    ? [
        { label: "Profile", href: "/profile" },
        { label: "Update Profile", href: "/profile/update" },
        { label: "Logout", onClick: onSignout, className: "text-pink-600" },
      ]
    : [{ label: "Login", onClick: onSignin, className: "text-green-600" }];

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl
                 bg-white/70 backdrop-blur-md shadow-lg border border-green-200
                 rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between
                 z-50 transition-all duration-300"
    >
      {/* Logo */}
      <Link
        href="/dashboard"
        className="text-2xl font-extrabold tracking-wide cursor-pointer
                   bg-gradient-to-r from-black via-pink-400 to-green-600 bg-clip-text
                   text-transparent  hover:opacity-90 transition"
      >
        DriftPro
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6 relative" ref={dropdownRef}>
        {/* Avatar */}
        <button
          aria-haspopup="true"
          aria-expanded={open}
          onClick={() => setOpen((prev) => !prev)}
          className="w-10 h-10 border-2 border-pink-200 rounded-full flex items-center justify-center overflow-hidden
                     bg-green-100 hover:scale-105 transition-transform"
        >
          {!user?.image ? (
            <span className="text-lg">🌸</span>
          ) : (
            <Image
              src={user.image || "/avatar.png"}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </button>

        {/* Dropdown */}
        <div
          className={`absolute top-14 right-0 w-56 min-w-[180px] max-w-[90vw]
                      bg-white/90 border border-green-200 shadow-xl rounded-xl py-2 z-50
                      transform transition-all duration-300
                      ${open ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}`}
        >
          <div className="px-4 py-2 border-b text-sm text-gray-600">
            Signed in as <br />
            <span className="font-semibold text-gray-900 truncate max-w-[200px]">{greeting}</span>
          </div>

          {menuItems.map((item, idx) =>
            item.href ? (
              <Link
                key={idx}
                href={item.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition-all rounded-md"
              >
                {item.label}
              </Link>
            ) : (
              <button
                key={idx}
                onClick={async () => {
                  setOpen(false);
                  setLoadingAction(true);
                  await item.onClick?.();
                  setLoadingAction(false);
                }}
                className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition-all rounded-md ${
                  item.className || "text-gray-700"
                }`}
                disabled={loadingAction}
              >
                {loadingAction ? "Processing..." : item.label}
              </button>
            )
          )}
        </div>

        {/* Greeting */}
        <div className="hidden sm:block">
          <h4 className="text-sm text-gray-700">
            Hello,{" "}
            <span className="font-semibold text-gray-900 truncate max-w-[120px]">
              {greeting}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};
