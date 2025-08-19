"use client";

import Link from "next/link";
import Image from "next/image";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";

export default function Dashboard() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center pt-28 pb-4">
      {/* Page Title */}
      <h1 className="text-4xl font-bold text-gray-800 mb-10">Dashboard</h1>

      {/* Advertisement Banner */}
      <Card
        title="🔥 Exclusive Offer"
        subtitle="Get 10% cashback on your first UPI transaction this month!"
        className="w-full max-w-5xl mb-12 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white relative overflow-hidden"
        variant="gradient"
        footer={
          <Link
            href="/offers"
            className="inline-block px-5 py-2 bg-white text-purple-600 font-semibold rounded-lg shadow hover:bg-gray-100 transition"
          >
            Claim Now
          </Link>
        }
      >
        <div className="hidden md:block absolute right-6 top-1/2 -translate-y-1/2">
          <Image
            src="https://images.unsplash.com/photo-1599050751795-6cdaafbc2319?q=80&w=3628&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Offer Banner"
            width={220}
            height={150}
            className="rounded-xl shadow-lg"
          />
        </div>
      </Card>
      {/* Action Banners */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full max-w-5xl mb-12">
        <Card
          title="💸 Send Money"
          subtitle="Send money instantly to anyone using phone number."
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white"
          variant="gradient"
          footer={<Link href="/sendmoney">Go →</Link>}
        />

        <Card
          title="💰 Add Money"
          subtitle="Add funds to your wallet securely using UPI or Card."
          className="bg-gradient-to-r from-green-500 to-green-600 text-white"
          variant="gradient"
          footer={<Link href="/transfer">Go →</Link>}
        />

        <Card
          title="📊 Wallet & History"
          subtitle="View wallet balance and check transaction history anytime."
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white"
          variant="gradient"
          footer={<Link href="/transactions">Go →</Link>}
        />
      </div>

      {/* Services Section */}
      <div className="w-full max-w-5xl mb-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          Popular Services
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {[
            { name: "📱 Mobile Recharge", href: "/recharge" },
            { name: "💡 Electricity Bill", href: "/electricity" },
            { name: "🚰 Water Bill", href: "/water" },
            { name: "🎟️ Movie Tickets", href: "/movies" },
            { name: "✈️ Flight Booking", href: "/flights" },
            { name: "🚖 Cab Booking", href: "/cabs" },
            { name: "🍔 Food Order", href: "/food" },
            { name: "📦 Shopping", href: "/shopping" },
          ].map((service, idx) => (
            <Card
              key={idx}
              title={service.name}
              className="p-4 hover:shadow-lg hover:scale-105 transition-transform text-center"
              variant="outlined"
              footer={
                <Link href={service.href} className="text-blue-600 text-sm">
                  Explore →
                </Link>
              }
            />
          ))}
        </div>
      </div>

      {/* Promotional Section */}
      <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8">
        <Card
          title="🏦 Personal Loan"
          subtitle="Get instant loan approval up to ₹1,00,000 with 0% processing fee."
          variant="outlined"
          footer={
            <Button onClick={() => alert("Apply for Loan")}>Apply Now</Button>
          }
        />

        <Card
          title="🛡️ Insurance"
          subtitle="Protect your family with health & life insurance plans."
          variant="outlined"
          footer={
            <Button onClick={() => alert("Explore Insurance")}>
              Explore Plans
            </Button>
          }
        />
      </div>
    </div>
  );
}
