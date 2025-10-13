import { getServerSession } from "next-auth";
import { authOptions } from "../../../lib/auth";
import { redirect } from "next/navigation";
import prisma from "@repo/db/client";
import Link from "next/link";

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

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-stone-50 backdrop-blur-sm rounded-3xl shadow-xl p-10 border border-pink-100 hover:shadow-pink-200/60 transition-all duration-300">
        <h1 className="text-4xl font-extrabold text-center bg-gradient-to-r from-black via-pink-400 to-green-600 text-transparent bg-clip-text mb-8">
          Profile
        </h1>

        <div className="space-y-5 text-gray-700">
          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="font-semibold text-gray-600">Name:</span>
            <span className="text-gray-800">{user.name || "N/A"}</span>
          </div>

          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="font-semibold text-gray-600">Email:</span>
            <span className="text-gray-800">{user.email || "N/A"}</span>
          </div>

          <div className="flex justify-between items-center border-b border-pink-100 pb-2">
            <span className="font-semibold text-gray-600">Mobile:</span>
            <span className="text-gray-800">
              {user.mobile || "— Add your mobile number —"}
            </span>
          </div>

          <div className="flex justify-between items-center">
            <span className="font-semibold text-gray-600">Provider:</span>
            <span className="text-gray-800">{user.provider || "local"}</span>
          </div>
        </div>

        <Link
          href="/profile/update"
          className="block mt-10 w-full text-center py-3 rounded-2xl bg-gradient-to-r from-green-400 via-pink-400 to-pink-500 text-white font-semibold text-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-lg"
        >
          ✏️ Update Profile
        </Link>

        <p className="mt-6 text-center text-gray-500 text-sm">
          🌷 Keep your details updated for a smoother experience.
        </p>
      </div>
    </div>
  );
}
