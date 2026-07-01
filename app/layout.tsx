import type { Metadata } from "next";
import { Cormorant_Garamond, Mukta } from "next/font/google";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { Analytics } from "@vercel/analytics/next";
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

export const metadata: Metadata = {
  title: "OM — The Divine Soul of Devbhumi | Spiritual Eco-Sanctuary",
  description:
    "A spiritual eco-sanctuary cradled in Devbhumi, Uttarakhand, with a front-row seat to the snow-capped Panch Kedar and the sacred peak of Nilkantha. Glass-view cottages, yoga & meditation retreats, and the Vashishtha Bhawan venue.",
  keywords: [
    "Devbhumi",
    "Uttarakhand",
    "spiritual retreat",
    "yoga retreat",
    "Panch Kedar",
    "Nilkantha",
    "eco tourism",
    "Char Dham",
  ],
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
        <Analytics />
      </body>
    </html>
  );
}
