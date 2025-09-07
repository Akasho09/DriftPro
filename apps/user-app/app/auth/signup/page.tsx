"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";

export default function SignUpPage() {
  const router = useRouter();

  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  // const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    // if (password !== confirm) {
    //   setError("Passwords do not match");
    //   return;
    // }

    try {
      setLoading(true);
      // try signing in (if user doesn't exist, backend will create)
      const res = await signIn("credentials", {
        redirect: false,
        phone,
        password,
        action : "signup"
      });

      if (res?.error) {
        setError(res.error);
        alert(res?.error)
      } else {
        router.push("/dashboard");
      }
    } catch (err) {
      setError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex items-center justify-center min-h-screen pt-4">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8 ">
        <h1 className="text-3xl font-bold text-center text-blue-600 mb-6">
          Create an Account
        </h1>

        {error && (
          <div className="mb-4 p-3 text-sm text-red-700 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Phone Number */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Phone Number
            </label>
            <input
              type="text"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="9103597816"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-gray-700 font-medium mb-1">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Must be 8+ chars, include uppercase, lowercase, number, and symbol.
            </p>
          </div>

          {/* Confirm Password */}
          {/* <div>
            <label className="block text-gray-700 font-medium mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="********"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              required
            />
          </div> */}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-all"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        {/* Divider */}
        <div className="my-6 flex items-center">
          <div className="flex-grow border-t border-gray-300"></div>
          <span className="mx-3 text-gray-500 text-sm">OR</span>
          <div className="flex-grow border-t border-gray-300"></div>
        </div>

        {/* Google Sign In */}
        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          className="w-full flex items-center justify-center gap-2 py-3 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-all"
        >
          <img
            src="https://www.svgrepo.com/show/355037/google.svg"
            alt="Google"
            className="w-5 h-5"
          />
          <span className="text-gray-700">Continue with Google</span>
        </button>

        {/* GitHub Sign In */}
        <button
        onClick={() => signIn("github", { callbackUrl: "/dashboard" })}
        className="w-full flex items-center justify-center gap-2 py-3 bg-gray-800 text-white rounded-lg hover:bg-black transition-all mt-3"
        >
        <img
            src="https://www.svgrepo.com/show/475654/github-color.svg"
            alt="GitHub"
            className="w-5 h-5 bg-white rounded-full"
        />
        <span>Continue with GitHub</span>
        </button>

        {/* Already have account */}
        <p className="mt-6 text-sm text-center text-gray-600">
          Already have an account?{" "}
          <a
            href="/auth/signin"
            className="text-blue-600 hover:underline font-medium"
          >
            Sign In
          </a>
        </p>
      </div>
    </div>
  );
}
