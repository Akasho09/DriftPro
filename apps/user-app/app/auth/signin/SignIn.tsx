"use client";

import { useState, useEffect, FormEvent } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";

export default function SignInForm() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [phone, setPhone] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    if (status === "authenticated" && session?.user) {
      router.push("/");
    }
  }, [session, status, router]);

  // ✅ Handle form submit
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await signIn("credentials", {
        redirect: false,
        phone,
        password,
        callbackUrl,
        action: "signin",
      });

      if (res?.error) {
        setError(res.error);
      } else {
        router.push(callbackUrl);
      }
    } catch (err) {
      console.error("Sign-in error:", err);
      setError("Something went wrong. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="w-full max-w-md bg-white/90 backdrop-blur-sm rounded-3xl p-10 shadow-2xl border border-pink-200">
        <h1 className="text-3xl font-extrabold text-center text-green-700 mb-6">
          Sign In
        </h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-pink-700 bg-pink-100 rounded-lg text-center">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* 📱 Phone Number */}
          <div>
            <label className="block text-green-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9103597816"
              className="w-full px-4 py-2 border border-green-300 rounded-xl focus:ring-2 focus:ring-pink-300 focus:outline-none transition"
              required
            />
          </div>

          {/* 🔑 Password */}
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
          </div>

          {/* 🔘 Sign In Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-xl text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-green-300 cursor-not-allowed"
                : "bg-green-500 hover:bg-pink-400 shadow-md hover:shadow-lg"
            }`}
          >
            {loading ? "Signing in..." : "Sign In"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-green-200"></div>
          <span className="mx-3 text-green-400 text-sm">OR</span>
          <div className="flex-grow border-t border-green-200"></div>
        </div>

        {/* 🌐 Google Sign-In */}
        <button
          onClick={() => signIn("google", { callbackUrl })}
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

        {/* 💻 GitHub Sign-In */}
        <button
          onClick={() => signIn("github", { callbackUrl })}
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
          Don’t have an account?{" "}
          <Link
            href="/auth/signup"
            className="text-pink-500 hover:underline font-medium"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}
