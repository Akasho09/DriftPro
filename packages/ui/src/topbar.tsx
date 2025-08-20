"use client";
import Link from "next/link";
import Image from "next/image";

interface AppbarProps {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

export const Topbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl 
      text-gray-900 shadow-lg border border-gray-300 rounded-2xl px-4 md:px-6 py-3 md:py-4 
      flex items-center justify-between z-50 
      bg-white/70 backdrop-blur-md transition-all duration-300">
      
      {/* Logo Link */}
      <Link href="/dashboard" className="text-2xl font-extrabold tracking-wide 
        cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-600 text-transparent bg-clip-text hover:opacity-90 transition">
        DriftPro
      </Link>

      {/* Right Section */}
      <div className="flex items-center gap-4 md:gap-6">
        {/* Avatar Link */}
        <Link
          href={user?.image ? user?.image : ""}
          className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 hover:scale-105 transition-transform"
        >
          {!user?.image ? (
            <span className="text-lg">🌸</span>
          ) : (
            <Image
              src={user.image || "/dashboard"}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </Link>

        {/* Greeting */}
        <div className="hidden sm:block">
          <h4 className="text-sm text-gray-700">
            Hello,{" "}
            <span className="font-semibold text-gray-900">
              { user?.email || "Beta User"}  
            </span>
          </h4>
        </div>

        {/* Auth Button */}
        <button
          onClick={() => (user ? onSignout() : onSignin())}
          className="px-4 py-1.5 text-sm font-medium 
            bg-gradient-to-r from-blue-500 to-indigo-600 
            text-white hover:from-blue-600 hover:to-indigo-700 
            transition-all rounded-lg shadow-md"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};
