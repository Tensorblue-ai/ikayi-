import type { Metadata } from "next";
import { siteUrl } from "@/lib/seo";
import { NavigationShell } from "@/components/navigation/NavigationShell";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: "Ikayi | Modern Indian Restaurant",
  description:
    "Ikayi is a modern Indian restaurant built around warm hospitality, refined dining, and memorable table experiences.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <NavigationShell />
        {children}
      </body>
    </html>
  );
}
