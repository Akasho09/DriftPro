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
  title: "D-Wallet",
  description: "Simple wallet app",
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
       <AppbarClient></AppbarClient>
        <div className="min-w-screen min-h-screen">
        <div className="mx-16">{children}</div>
        </div>
      </body>
      </Providers>
    </html>
  );
}