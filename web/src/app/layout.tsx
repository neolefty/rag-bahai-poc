import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/app/navbar"

export const metadata: Metadata = {
  title: "Semantic Search",
  description: "Search documents by their meaning",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
    <head>
        <link rel="icon" href="/book-magnifying-glass.png" />
    </head>
      <body>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
