"use client";
import Link from "next/link";
import { Card , Card2 } from "@repo/ui/card";
import { Button } from "@repo/ui/button";
import { Loader } from "@repo/ui/loader";
import { useState, useCallback, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

function useReveal(delay = 0){

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

  // Animated section refs
  const headerRef = useReveal();
  const offerRef = useReveal(100);
  const coreRef = useReveal(200);
  const servicesRef = useReveal(300);
  const bottomRef = useReveal(400);

  // Navigation handler with loading animation
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

      {/* HEADER */}
      <header
        ref={headerRef}
        className="text-center mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <h1 className="f text-5xl font-extrabold text-stone-800 mb-4 tracking-tight">
          Your <span className="text-yellow-600 ">Unified</span> Dashboard
        </h1>
        <p className="text-xl text-stone-500">
          Manage your essential services with clarity.
        </p>
      </header>
      {/* OFFER SECTION */}
      <div
        ref={offerRef}
        className="relative w-full max-w-5xl mb-16 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <Card
          title="🎉 Special Offer: Enjoy 10% Cashback!"
          subtitle="Get 10% cashback on your first UPI transaction this month (up to ₹500). Limited time only."
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

      {/* CORE ACTIONS */}
      <div
        ref={coreRef}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl mb-20 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        {/* SEND MONEY */}
        <Card
          title="💸 Send Money"
          subtitle="Send funds instantly using phone number or UPI ID."
          footer={
            <Button
              onClick={() => handleNavigation("/sendmoney")}
              disabled={loadingLink === "/sendmoney"}
            >
              {getButtonContent("/sendmoney")}
            </Button>
          }
        />

        {/* ADD MONEY */}
        <Card
          title="💳 Add Money"
          subtitle="Add funds securely with UPI, card, or netbanking."
          footer={
            <Button
              onClick={() => handleNavigation("/addmoney")}
              disabled={loadingLink === "/addmoney"}
            >
              {getButtonContent("/addmoney")}
            </Button>
          }
        />

        {/* TRANSACTIONS */}
        <Card
          title="📈 Wallet & History"
          subtitle="Check wallet balance and transaction logs."
          footer={
            <Button
              onClick={() => handleNavigation("/transactions")}
              disabled={loadingLink === "/transactions"}
            >
              {getButtonContent("/transactions")}
            </Button>
          }
        />
      </div>

      {/* SERVICES SECTION */}
      <section
        ref={servicesRef}
        className="w-full max-w-5xl mb-20 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <h2 className="text-3xl font-extrabold text-stone-800 mb-8 border-b-2 border-stone-300 pb-2 text-center md:text-left">
          Essential Services
          <span className="text-sm text-red-500 ml-2 font-normal">
            (Coming Soon)
          </span>
        </h2>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-6">
          {POPULAR_SERVICES.map((service, idx) => (
            <Card2
              key={idx}
              title={service.name}
              footer={
                <Link href={service.href}>
                  <Button >
                    Explore →
                  </Button>
                </Link>
              }
            />
          ))}
        </div>
      </section>

      {/* BOTTOM OFFERS */}
      <section
        ref={bottomRef}
        className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-2 gap-8 mb-12 opacity-0 translate-y-8 transition-all duration-700 ease-out"
      >
        <Card2
          title="🏦 Personal Loan Solutions"
          subtitle="Get instant loan approvals up to ₹1,00,000 with zero processing fees."
          footer={
            <Button
              onClick={() => alert("Apply for Loan")}
            >
              Apply Now
            </Button>
          }
        />

        <Card2
          title="🛡️ Comprehensive Insurance"
          subtitle="Find the best health, life, and travel insurance plans."
          footer={
            <Button
              onClick={() => alert("Explore Insurance")}
            >
              Explore Plans
            </Button>
          }
        />
      </section>
    </div>
  );
}
