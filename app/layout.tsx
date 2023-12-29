import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Megu",
  description: "Market Evaluation Graph Utility",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <Script
          async
          src="https://nakiri.vercel.app/script.js"
          data-website-id="fd138a13-4ebc-4fae-a1bf-e20b9404bc92"
        />
      </head>
      <body className={inter.className}>{children}</body>
    </html>
  );
}
