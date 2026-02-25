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
    images: [
      {
        url: "/brand/aibazaar-logo.png",
        alt: "AI Bazaar",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AI Bazaar",
    description:
      "India-first AI discovery marketplace for models, tools, benchmarks, and safe adoption guidance.",
    images: ["/brand/aibazaar-logo.png"],
  },
  icons: {
    icon: [
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-48x48.png", sizes: "48x48", type: "image/png" },
    ],
    apple: [{ url: "/apple-icon.png", sizes: "180x180", type: "image/png" }],
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
