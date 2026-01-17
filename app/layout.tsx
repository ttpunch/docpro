import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnalyticsTracker } from "@/components/analytics/AnalyticsTracker";
import { Footer } from "@/components/layout/Footer";
import { JsonLd } from "@/components/seo/JsonLd";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_BASE_URL || 'https://id-photo-generator.vercel.app'),
  title: {
    default: "docpro | standard-compliant photos",
    template: "%s | docpro"
  },
  description: "Generate compliant ID photos for UPSC, SSC, Visas, and Passports instantly in your browser. Privacy-first, no uploads required.",
  keywords: ["ID photo", "passport photo", "visa photo", "UPSC photo", "SSC signature", "photo editor", "image resizer", "compliant photos"],
  authors: [{ name: "docpro" }],
  creator: "docpro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    title: "docpro | standard-compliant photos",
    description: "Generate compliant ID photos for UPSC, SSC, Visas, and Passports instantly in your browser.",
    siteName: "docpro",
  },
  twitter: {
    card: "summary_large_image",
    title: "docpro | standard-compliant photos",
    description: "Generate compliant ID photos for UPSC, SSC, Visas, and Passports instantly in your browser.",
    creator: "@idphotogen",
  },
  icons: {
    icon: "/favicon.png",
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
      >
        <AnalyticsTracker />
        <JsonLd />
        {children}
        <Footer />
      </body>
    </html>
  );
}
