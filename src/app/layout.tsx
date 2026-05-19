import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import AuthProvider from "@/components/providers/AuthProvider"; // Clear structural separation

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexPOS Pro - Smart Retail Management",
  description: "Next-Gen Point of Sale & Inventory System",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/* 🛠️ FIX: Wrap content with AuthProvider so useSession hooks work everywhere */}
        <AuthProvider>
          {children}
        </AuthProvider>
      </body>
    </html>
  );
}