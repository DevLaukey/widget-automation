import type { Metadata } from "next";
import { Geist, Geist_Mono, Orbitron, Barlow_Condensed, Rajdhani } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const orbitron = Orbitron({
  weight: ["400", "500", "600", "700", "800", "900"],
  subsets: ["latin"],
  variable: "--font-orbitron",
});

const barlowCondensed = Barlow_Condensed({
  weight: ["900"],
  style: ["italic"],
  subsets: ["latin"],
  variable: "--font-barlow-condensed",
});

const rajdhani = Rajdhani({
  weight: ["600"],
  subsets: ["latin"],
  variable: "--font-rajdhani",
});

export const metadata: Metadata = {
  title: "Counter Widget Builder",
  description: "Create and customize animated counter card widgets",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${orbitron.variable} ${barlowCondensed.variable} ${rajdhani.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
