import type { Metadata } from "next";
import { JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const headingFont = Space_Grotesk({
  variable: "--font-heading",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const monoFont = JetBrains_Mono({
  variable: "--font-code",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://theaibazaar.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: "AI Bazaar",
  description:
    "India-first AI discovery marketplace for models, tools, benchmarks, and safe adoption guidance.",
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "AI Bazaar",
    description:
      "India-first AI discovery marketplace for models, tools, benchmarks, and safe adoption guidance.",
    url: siteUrl,
    siteName: "AI Bazaar",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Bazaar",
    description:
      "India-first AI discovery marketplace for models, tools, benchmarks, and safe adoption guidance.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${headingFont.variable} ${monoFont.variable} antialiased`}>{children}</body>
    </html>
  );
}
