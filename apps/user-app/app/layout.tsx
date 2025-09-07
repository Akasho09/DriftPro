import type { Metadata } from "next";
import localFont from "next/font/local";
import { Providers } from "./provider";
import "./globals.css";
import { AppbarClient } from "../components/appbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
});


export const metadata: Metadata = {
  title: "D Coins",
  description: "Simple wallet app",
  openGraph: {
    title: "D-Wallet",
    description: "Well its Faster then the one you use.",
    url: "https://driftpro.vercel.app", // replace with your site URL
    images: [
      {
        url: "/openG.png", // path to your OG image in public folder
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
      <body className={`${geistSans.variable} ${geistMono.variable} bg-[#ebe6e6]`}>
       <AppbarClient/>
        <div className="min-w-screen min-h-screen">
        <div className="mx-16">{children}</div>
        </div>
      </body>
      </Providers>
    </html>
  );
}