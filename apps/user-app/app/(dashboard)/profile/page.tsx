import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import Link from "next/link";
import Image from "next/image";

export default async function ProfilePage() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
  });

  if (!user) {
    return (
      <p className="text-center text-pink-500 mt-20 text-lg font-medium">
        ⚠️ User not found
      </p>
    );
  }

  const initials = user.name
    ? user.name
        .split(" ")
        .map((n : string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <div className="w-full flex items-center justify-center pt-20 bg-gradient-to-tr">
      <div className="w-full max-w-2xl bg-gradient-to-br from-green-50 via-white to-pink-50 backdrop-blur-md rounded-3xl shadow-2xl border border-green-200 hover:shadow-pink-200/40 transition-all duration-300 p-10">
        {/* Header */}

        <div className="flex flex-col items-center mb-8">
          {session.user.picture ? (
            <Image
              src={session.user.picture}
              alt="Profile picture"
              width={96}
              height={96}
              className="rounded-full mb-4 border-4 shadow-md"
            />
          ) : (
            <div className="w-24 h-24 rounded-full bg-green-200 flex items-center justify-center text-3xl font-bold text-white mb-4">
              {initials}
            </div>
          )}

          <h1 className="text-4xl font-bold
           bg-gradient-to-r from-black via-zinc-800 to-yellow-500
           text-transparent bg-clip-text">
            Profile
          </h1>
        </div>
        
        {/* Info Sections */}
        <div className="space-y-6 text-gray-700">
          {/* Personal Info */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-600">Personal Info</h2>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Name:</span>
              <span className="text-gray-800">{user.name || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Email:</span>
              <span className="text-gray-800">{user.email || "N/A"}</span>
            </div>
            <div className="flex justify-between border-b border-gray-200 pb-2">
              <span className="text-gray-500">Mobile:</span>
              <span className="text-gray-800">
                {user.mobile || "— Add your mobile number —"}
              </span>
            </div>
          </div>

          {/* Account Info */}
          <div className="space-y-3">
            <h2 className="text-lg font-semibold text-gray-600">Account Info</h2>
            <div className="flex justify-between">
              <span className="text-gray-500">Provider:</span>
              <span className="text-gray-800">{user.provider || "local"}</span>
            </div>
          </div>
        </div>

        {/* Update Button */}
        <Link
          href="/profile/update"
          className="mt-10 w-full block text-center py-3 rounded-2xl bg-gradient-to-r from-black via-zinc-800 to-yellow-500 text-white font-semibold text-lg shadow-md hover:scale-[1.03] hover:shadow-lg transition-all duration-300"
        >
          ✏️ Update Profile
        </Link>

        {/* Footer Note */}
        <p className="mt-6 text-center text-gray-500 text-sm">
          🌷 Keep your details updated for a smoother experience.
        </p>
      </div>
    </div>
  );
}
