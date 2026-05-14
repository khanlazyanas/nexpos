import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css"; // 🔥 Ye wo magic line hai jisse pura design wapas aayega!

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "NexPOS - Premium System",
  description: "Next-Gen Point of Sale and Inventory Management",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>{children}</body>
    </html>
  );
}