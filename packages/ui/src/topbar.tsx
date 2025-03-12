interface AppbarProps {
  user?: {
      name?: string | null,
      image?: string | null,
      email? : string  | null
  },
  onSignin: ()=> void,
  onSignout: ()=> void
}
import Image from "next/image"

export const Topbar = ( { user,onSignin,onSignout } : AppbarProps ) => {
  return (
<div className="flex items-center justify-between p-4 bg-gray-900 text-white shadow-md">
      <div className="text-lg font-semibold tracking-wide">DriftPro</div>

      <div className="flex items-center gap-4 justify-end">
        <div className="w-6 h-6 border border-gray-300 rounded-full flex items-center justify-center overflow-hidden">
          {!user?.image ? (
            <h6 className="text-lg">🌸</h6>
          ) : (
            <Image
              src={user.image}
              alt="User Image"
              width={40}
              height={40}
              className="rounded-full object-cover"
            />
          )}
        </div>
        <h4 className="text-sm text-gray-300 font">Hello , <span className="font-semibold">{user?.email || "Guest"}</span></h4>
        <button
          onClick={() => (user ? onSignout() : onSignin())}
          className="px-4 py-1 text-sm bg-slate-200 hover:bg-blue-500 transition-all rounded-lg text-black"
        >
          {user ? "Logout" : "Login"}
        </button>
      </div>
    </div>
  );
};