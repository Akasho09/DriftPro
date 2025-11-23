import UpdateForm from "../../../../components/updateProfile";
import { getServerSession } from "next-auth";
import { authOptions } from "../../../../lib/auth";

export default async function UpdateProfilePage() {
  const session = await getServerSession(authOptions)
  const mobile = session?.user.mobile
  return (
    <div className="min-h-screen w-full flex items-center justify-center p-6 ">
      <div className="w-full max-w-2xl bg-gradient-to-br from-green-50 via-white to-pink-50 shadow-2xl rounded-3xl p-10 border border-green-200 backdrop-blur-md transition-all duration-300 hover:shadow-pink-200/50">
        <h1 className="
bg-gradient-to-r from-black via-zinc-800 to-yellow-500
 text-4xl font-extrabold text-center text-transparent bg-clip-text mb-8">
          Update Profile {!mobile ? "To Activate Your Wallet." : ""}
        </h1>
        <UpdateForm/>
      </div>
    </div>
  );
}
