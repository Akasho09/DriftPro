"use client";
import Link from "next/link";
import { Card } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Loader } from "@repo/ui/loader";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

// Hook for fade-up reveal
function useReveal(delay = 0) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              node.classList.add("opacity-100", "translate-y-0");
              node.classList.remove("opacity-0", "translate-y-8");
            }, delay);
          }
        });
      },
      { threshold: 0.15 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [delay]);

  return ref;
}

const POPULAR_SERVICES = [
  { name: "📱 Mobile Recharge", href: "/recharge" },
  { name: "⚡ Electricity Bill", href: "/electricity" },
  { name: "💧 Water Bill", href: "/water" },
  { name: "🎟️ Movie Tickets", href: "/movies" },
  { name: "✈️ Flight Booking", href: "/flights" },
  { name: "🚕 Cab Booking", href: "/cabs" },
  { name: "🍔 Food Order", href: "/food" },
  { name: "🛍️ Shopping", href: "/shopping" },
];

export default function Dashboard() {
  const [loadingLink, setLoadingLink] = useState<string | null>(null);
  const router = useRouter();

  const headerRef = useReveal();
  const offerRef = useReveal(100);
  const coreRef = useReveal(200);
  const servicesRef = useReveal(300);
  const bottomRef = useReveal(400);

  const handleNavigation = useCallback(
    (href: string) => {
      setLoadingLink(href);
      setTimeout(() => router.push(href), 400);
    },
    [router]
  );

  const getButtonContent = (href: string) =>
    loadingLink === href ? <Loader size="sm" /> : "Go →";

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-start pt-24 pb-16 px-4 sm:px-8">
      
      {/* Header */}
      <header
        ref={headerRef}
        className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <h1 className="text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
          Your <span className="text-emerald-600">Unified</span> Dashboard
        </h1>
        <p className="text-xl text-stone-500">
          Manage your essential services with clarity.
        </p>
      </header>

      {/* Offer Banner */}
      <div
        ref={offerRef}
        className="relative w-full max-w-5xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <Card
          title="🎉 Special Offer: Enjoy 10% Cashback!"
          subtitle="Get 10% cashback on your first UPI transaction this month (up to ₹500). Limited time only."
          className="bg-gradient-to-br from-emerald-500 to-indigo-500 text-white shadow-lg rounded-2xl p-8"
          variant="gradient"
          footer={
            <Link
              href="/offers"
              className="inline-block px-6 py-3 bg-stone-700 text-stone-100 font-bold rounded-full text-lg shadow-md hover:bg-emerald-600 transition transform hover:scale-[1.02] active:scale-95 duration-200"
            >
              Claim Your Cashback Now
            </Link>
          }
        />
      </div>

      {/* Core Actions */}
      <div
        ref={coreRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-20 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <Card
          title="💸 Send Money"
          subtitle="Send funds instantly to anyone using their phone number or UPI ID securely."
          className="bg-gradient-to-br from-blue-400 to-indigo-400 text-stone-800 shadow-md hover:shadow-lg transition duration-300 rounded-xl"
          variant="gradient"
          footer={
            <Button
              onClick={() => handleNavigation("/sendmoney")}
              disabled={loadingLink === "/sendmoney"}
              className="bg-stone-700 hover:bg-emerald-600 text-stone-100"
            >
              {getButtonContent("/sendmoney")}
            </Button>
          }
        />

        <Card
          title="💳 Add Money"
          subtitle="Replenish your wallet securely using UPI, Card, or Netbanking options."
          className="bg-gradient-to-br from-emerald-400 to-teal-400 text-stone-800 shadow-md hover:shadow-lg transition duration-300 rounded-xl"
          variant="gradient"
          footer={
            <Button
              onClick={() => handleNavigation("/addmoney")}
              disabled={loadingLink === "/addmoney"}
              className="bg-stone-700 hover:bg-emerald-600 text-stone-100"
            >
              {getButtonContent("/addmoney")}
            </Button>
          }
        />

        <Card
          title="📈 Wallet & History"
          subtitle="Access your current wallet balance and comprehensive transaction records easily."
          className="bg-gradient-to-br from-purple-400 to-pink-400 text-stone-800 shadow-md hover:shadow-lg transition duration-300 rounded-xl"
          variant="gradient"
          footer={
            <Button
              onClick={() => handleNavigation("/transactions")}
              disabled={loadingLink === "/transactions"}
              className="bg-stone-700 hover:bg-emerald-600 text-stone-100"
            >
              {getButtonContent("/transactions")}
            </Button>
          }
        />
      </div>

      {/* Essential Services */}
      <section
        ref={servicesRef}
        className="w-full max-w-5xl mb-20 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <h2 className="text-3xl font-extrabold text-stone-800 mb-8 border-b-2 border-stone-300 pb-2 text-center md:text-left">
          Essential Services
          <span className="text-sm text-red-500 ml-2 font-normal">(Coming Soon)</span>
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {POPULAR_SERVICES.map((service, idx) => (
            <Card
              key={idx}
              title={service.name}
              className="p-6 bg-stone-200 border border-stone-300 rounded-xl text-center shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-300 text-stone-700"
              variant="outlined"
              footer={
                <Link href={service.href}>
                  <Button className="w-full bg-stone-700 hover:bg-emerald-600 text-stone-100">
                    Explore →
                  </Button>
                </Link>
              }
            />
          ))}
        </div>
      </section>

      {/* Bottom Offers */}
      <section
        ref={bottomRef}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <Card
          title="🏦 Personal Loan Solutions"
          subtitle="Access instant loan approvals up to ₹1,00,000 with zero processing fees. Apply now!"
          variant="outlined"
          className="bg-stone-200 border-l-4 border-indigo-400 shadow-md p-6 text-stone-700"
          footer={
            <Button
              className="w-full bg-stone-700 hover:bg-emerald-600 text-stone-100"
              onClick={() => alert('Apply for Loan')}
            >
              Apply Now
            </Button>
          }
        />

        <Card
          title="🛡️ Comprehensive Insurance"
          subtitle="Secure your future with tailored health, life, and travel insurance plans from leading providers."
          variant="outlined"
          className="bg-stone-200 border-l-4 border-teal-400 shadow-md p-6 text-stone-700"
          footer={
            <Button
              className="w-full bg-stone-700 hover:bg-emerald-600 text-stone-100"
              onClick={() => alert('Explore Insurance')}
            >
              Explore Plans
            </Button>
          }
        />
      </section>
    </div>
  );
}
