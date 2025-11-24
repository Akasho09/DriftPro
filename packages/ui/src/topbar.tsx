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
  const [menuOpen, setMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [loadingAction, setLoadingAction] = useState(false);
  const [show , setshow] =useState(true)

  const dropdownRef = useRef<HTMLDivElement>(null);
  const notifRef = useRef<HTMLDivElement>(null);

  // Auto-close on outside click
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setMenuOpen(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target as Node)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const greeting = useMemo(
    () => user?.name || user?.email || user?.mobile || "Login First",
    [user]
  );


  const notifications = [
    { id: 1, title: "Money Requests Page", time: "1 min ago", type: "success" },
  ];

  // Menu Items
  const menuItems = user
    ? [
        { label: "Profile", href: "/profile" },
        { label: "Update Profile", href: "/profile/update" },
        { label: "Logout", onClick: onSignout, className: "text-pink-600" },
      ]
    : [{ label: "Login", onClick: onSignin, className: "text-green-600" }];

  return (
    <div
      className="
        fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl
        bg-white/70 backdrop-blur-md shadow-lg border border-green-200
        rounded-2xl px-4 md:px-6 py-3 md:py-4 flex items-center justify-between
        z-50 transition-all duration-300
      "
    >
      {/* LOGO */}
      <Link
        href="/dashboard"
        className="text-3xl font-extrabold cursor-pointer bg-yellow-900 bg-clip-text text-transparent hover:opacity-90 transition"
      >
        DriftPro
      </Link>

      {/* RIGHT SECTION */}
      <div className="flex items-center gap-4 md:gap-6 relative">
        <div ref={notifRef} className="relative">
          <button
          
            onClick={() => {
              setshow(false)
              setNotifOpen((prev) => !prev)}
            }
            className="relative w-10 h-10 flex items-center justify-center rounded-full border-2 bg-white hover:bg-gray-100 transition"
          >
            <span className="text-xl">🔔</span>

            {show && (
              <span className="absolute -top-1 -right-1 bg-red-500 text-white 
                text-xs font-bold w-5 h-5 flex items-center justify-center 
                rounded-full animate-pulse"
              >
                {1}
              </span>
            )}
          </button>

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
              <div className="text-center p-6 text-gray-500 text-sm">No notifications yet ✨</div>
            ) : (
              notifications.map((n) => (
                <Link
                  key={n.id}
                  href={"/requests"}
                  className="px-4 py-3 flex flex-col gap-1 hover:bg-gray-100/80 cursor-pointer transition rounded-md"
                >
                  <p className="font-medium text-gray-800">{n.title}</p>
                  <span className="text-xs text-gray-500">{n.time}</span>

                  <span
                    className={`
                      h-2 w-2 rounded-full
                      ${n.type === "success" ? "bg-green-500" : n.type === "info" ? "bg-blue-500" : "bg-gray-400"}
                    `}
                  ></span>
                </Link>
              ))
            )}
          </div>
        </div>

        <div ref={dropdownRef} className="relative">
          <button
            aria-haspopup="true"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-10 h-10 border-2 rounded-full flex items-center justify-center overflow-hidden bg-green-100 hover:scale-105 transition-transform"
          >
            {!user?.image ? (
              <span className="text-xl">🌸</span>
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

          {/* ACCOUNT DROPDOWN */}
          <div
            className={`
              absolute top-14 right-0 w-56 bg-white/90 border border-green-200 
              shadow-xl rounded-xl py-2 z-50 transform transition-all duration-300
              ${menuOpen ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"}
            `}
          >
            <div className="px-4 py-2 border-b text-sm text-gray-600">
              Signed in as <br />
              <span className="font-semibold text-gray-900 truncate">{greeting}</span>
            </div>

            {menuItems.map((item, idx) =>
              item.href ? (
                <Link
                  key={idx}
                  href={item.href}
                  onClick={() => setMenuOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-700 hover:bg-green-50 transition rounded-md"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={idx}
                  onClick={async () => {
                    setMenuOpen(false);
                    setLoadingAction(true);
                    await item.onClick?.();
                    setLoadingAction(false);
                  }}
                  className={`w-full text-left px-4 py-2 text-sm hover:bg-green-50 transition rounded-md ${
                    item.className || "text-gray-700"
                  }`}
                  disabled={loadingAction}
                >
                  {loadingAction ? "Processing..." : item.label}
                </button>
              )
            )}
          </div>
        </div>

        {/* GREETING */}
        <div className="hidden sm:block">
          <h4 className="text-sm text-gray-700">
            Hello,{" "}
            <span
              className="
                font-semibold bg-gradient-to-r
                from-black via-zinc-800 to-yellow-500
                bg-clip-text text-transparent
                truncate max-w-[120px]
              "
            >
              {greeting}
            </span>
          </h4>
        </div>
      </div>
    </div>
  );
};
