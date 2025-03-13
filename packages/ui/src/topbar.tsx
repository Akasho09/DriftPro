interface AppbarProps {
  user?: {
    name?: string | null;
    image?: string | null;
    email?: string | null;
  };
  onSignin: () => void;
  onSignout: () => void;
}

import Image from "next/image";

export const Topbar = ({ user, onSignin, onSignout }: AppbarProps) => {
  return (
    <div className="flex items-center justify-between px-6 py-3 bg-gray-800 text-white shadow-lg">
      <div className="text-xl font-bold tracking-wide text-blue-400">
        DriftPro
      </div>

      <div className="flex items-center gap-5">
        <div className="w-10 h-10 border-2 border-gray-400 rounded-full flex items-center justify-center overflow-hidden">
          {!user?.image ? (
            <span className="text-lg">🌸</span>
          ) : (
            <Image
              src={user.image}
              alt="User Avatar"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </div>

        <div>
          <h4 className="text-sm text-gray-300">
            Hello,{" "}
            <span className="font-semibold text-white">
              {user?.email || "Guest"}
            </span>
          </h4>
        </div>

        <button
          onClick={() => (user ? onSignout() : onSignin())}
          className="px-5 py-1.5 text-sm font-medium bg-blue-500 hover:bg-blue-600 transition-all rounded-lg text-white shadow-md"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};
