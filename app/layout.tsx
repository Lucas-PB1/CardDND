import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/AuthContext";
import { Header } from "@/components/Header";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  themeColor: "#0f172a",
};

export const metadata: Metadata = {
  title: {
    template: "%s | CardND",
    default: "CardND",
  },
  description: "The Ultimate D&D Companion for Dungeon Masters and Players. Manage campaigns, roll dice, and track adventures offline and online.",
  applicationName: "CardND",
  keywords: ["D&D", "Dungeons and Dragons", "RPG", "Tabletop", "Campaign Manager", "Dice Roller", "Offline", "5e"],
  authors: [{ name: "CardND Team" }],
  openGraph: {
    title: "CardND - The Ultimate D&D Companion",
    description: "Manage your campaigns, roll dice, and track your adventures with a system built for Dungeon Masters and Players alike.",
    siteName: "CardND",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "CardND - The Ultimate D&D Companion",
    description: "Manage your campaigns, roll dice, and track your adventures with a system built for Dungeon Masters and Players alike.",
    creator: "@cardnd", 
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        suppressHydrationWarning
      >
        <AuthProvider>
            <Header />
            <main className="pt-16 min-h-screen">
                {children}
            </main>
        </AuthProvider>
      </body>
    </html>
  );
}
