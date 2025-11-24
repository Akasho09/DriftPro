import type { Metadata } from "next";
import { Providers } from "./provider";
import "./globals.css";
import { AppbarClient } from "../components/appbar";
import { Toaster } from "react-hot-toast";
import { Outfit,} from "next/font/google";

const outfit = Outfit({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "D Coins",
  description: "Simple wallet app",
  openGraph: {
    title: "D-Wallet",
    description: "Well it's faster than the one you use.",
    url: "https://driftpro.vercel.app",
    images: [
      {
        url: "/openG.png",
        width: 1200,
        height: 630,
        alt: "D-Wallet App Preview",
      },
    ],
    siteName: "D-Wallet",
  },
  twitter: {
    card: "summary_large_image",
    title: "D-Wallet",
    description: "Simple wallet app",
    images: ["openG.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <Providers>
        <body
          className={`${outfit.className} ${outfit.variable} -[#ebe6e6] min-h-screen`}
        >
          <AppbarClient />
          <Toaster position="top-center" />
          <main className="font-outfit max-w-6xl mx-auto pt-12 px-4 w-full">
            {children}
          </main>
        </body>
      </Providers>
    </html>
  );
}
