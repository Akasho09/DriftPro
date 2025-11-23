"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";

export default function UpdateForm(){
  const router = useRouter();
  const [form, setForm] = useState({ name: "", mobile: "" });
  const [loading, setLoading] = useState(false);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload: Record<string, string> = {};
      if (form.name.trim() !== "") payload.name = form.name.trim();
      if (form.mobile.trim() !== "") payload.mobile = form.mobile.trim();

      if (Object.keys(payload).length === 0) {
        toast.error("⚠️ Please enter at least one field to update.");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/mobileVer", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      setLoading(false);

      if (res.ok) {
        toast.success("🌸 Profile updated successfully!");
        router.push("/profile");
      } else {
        toast.error(data.error || "❌ Failed to update profile.");
      }
    } catch (err) {
      console.error("Error updating profile:", err);
      toast.error("Something went wrong. Please try again later.");
      setLoading(false);
    }
  };

    return <div><form onSubmit={handleSubmit} className="space-y-6">
          {/* Name Input */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">
              Name (optional)
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Enter your name"
              className="px-5 py-3 rounded-2xl border border-pink-200 focus:border-green-400 focus:ring-2 focus:ring-green-100 outline-none transition shadow-sm text-gray-800"
            />
          </div>

          {/* Mobile Input */}
          <div className="flex flex-col">
            <label className="mb-2 font-semibold text-gray-700">Mobile</label>
            <input
              type="text"
              name="mobile"
              value={form.mobile}
              onChange={handleChange}
              placeholder="Enter your mobile number"
              className="px-5 py-3 rounded-2xl border border-pink-200 focus:border-pink-400 focus:ring-2 focus:ring-pink-100 outline-none transition shadow-sm text-gray-800"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-2xl text-white font-semibold transition-all duration-300 ${
              loading
                ? "bg-pink-300 cursor-not-allowed"
                : "bg-gradient-to-r from-black via-zinc-800 to-yellow-500 hover:shadow-lg hover:scale-[1.02]"
            }`}
          >
            {loading ? "Updating..." : "Update Profile"}
          </button>
        </form>
                <p className="mt-6 text-center text-gray-500 text-sm">
          💡 Ensure your mobile number is correct to receive verification codes.
        </p>

        {/* Back Button */}
        <button
          onClick={() => router.push("/")}
          className="block mt-6 w-full text-center py-2 rounded-xl text-pink-500 font-medium hover:underline"
        >
          ← Back to Dashboard
        </button>
    </div>
}