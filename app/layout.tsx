import type { Metadata } from "next";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["latin", "devanagari"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-mukta",
  display: "swap",
});

const description =
  "OM The Divine Soul of Devbhumi — spiritual accommodation near Kedarnath in Guptkashi, Uttarakhand. Book glass-view cottages, yoga & meditation retreats and a peaceful stay for your Kedarnath Yatra, facing the Panch Kedar peaks.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "OM The Divine Soul of Devbhumi | Kedarnath Hotel Booking & Spiritual Stay in Guptkashi",
    template: "%s | OM The Divine Soul of Devbhumi",
  },
  description,
  keywords: [
    "OM The Divine Soul of Devbhumi",
    "Om Divine Soul",
    "Kedarnath hotel booking",
    "hotel near Kedarnath",
    "stay near Kedarnath",
    "Guptkashi hotel",
    "hotels in Guptkashi",
    "spiritual accommodation",
    "spiritual retreat Uttarakhand",
    "Kedarnath Yatra stay",
    "Char Dham Yatra hotel",
    "Rudraprayag cottages",
    "yoga retreat Uttarakhand",
    "Panch Kedar",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "OM The Divine Soul of Devbhumi",
    title: "OM The Divine Soul of Devbhumi — Spiritual Stay near Kedarnath",
    description,
    images: ["/assets/hero/hero.jpg"],
    locale: "en_IN",
  },
  verification: { google: process.env.GOOGLE_SITE_VERIFICATION },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${cormorant.variable} ${mukta.variable}`}>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
