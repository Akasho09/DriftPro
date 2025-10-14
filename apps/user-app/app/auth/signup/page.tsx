"use client";

import { useState, useEffect, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";

export default function SignUpPage() {
  const { data: session } = useSession();
  const router = useRouter();

  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (session?.user) {
      router.push("/");
    }
  }, [session, router]);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone,
        password,
        action: "signup",
      });

      if (res?.error) {
        toast.error(res.error);
      } else {
        toast.success("Account created successfully!");
        router.push("/dashboard");
      }
    } catch (err) {
      console.error("Signup error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-pink-200">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Create an Account
        </h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-green-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9103597816"
              className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
              required
            />
          </div>

          <div>
            <label className="block text-green-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
              required
            />
            <p className="text-xs text-green-400 mt-1">
              Must be 8+ characters, include uppercase, lowercase, number, and symbol.
            </p>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-pink-400 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-green-200"></div>
          <span className="mx-3 text-green-400 text-sm">OR</span>
          <div className="flex-grow border-t border-green-200"></div>
        </div>

        <button
          onClick={() => {
            toast.loading("Redirecting to Google...");
            signIn("google", { callbackUrl: "/" });
          }}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-green-300 rounded-xl hover:bg-green-50 transition"
        >
          <Image
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
            width={400}
            height={400}
          />
          <span className="text-green-700">Continue with Google</span>
        </button>

        <button
          onClick={() => {
            toast.loading("Redirecting to GitHub...");
            signIn("github", { callbackUrl: "/" });
          }}
          className="w-full flex items-center justify-center gap-2 py-3 mt-3 bg-green-700 text-white rounded-xl hover:bg-pink-400 transition"
        >
          <Image
            src="https://www.svgrepo.com/show/475654/github-color.svg"
            alt="GitHub"
            className="w-5 h-5 bg-white rounded-full"
            width={400}
            height={400}
          />
          <span>Continue with GitHub</span>
        </button>

        <p className="mt-6 text-sm text-center text-green-600">
          Already have an account?{" "}
          <Link
            href="/auth/signin"
            className="text-pink-500 hover:underline font-medium"
          >
            Sign In
          </Link>
        </p>
      </div>
    </div>
  );
}
