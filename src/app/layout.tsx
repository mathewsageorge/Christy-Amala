import type { Metadata, Viewport } from "next";
import "@fontsource/cormorant-garamond/latin-400.css";
import "@fontsource/cormorant-garamond/latin-400-italic.css";
import "@fontsource/cormorant-garamond/latin-500.css";
import "@fontsource/manrope/latin-400.css";
import "@fontsource/manrope/latin-500.css";
import "@fontsource/manrope/latin-600.css";
import "./globals.css";
import { wedding } from "@/config/wedding";

export const metadata: Metadata = {
  title: `${wedding.couple.names} | Our Wedding · ${wedding.dateShort}`,
  description: `${wedding.invitation} ${wedding.date}. ${wedding.place}.`,
  ...(wedding.siteUrl ? { metadataBase: new URL(wedding.siteUrl), alternates: { canonical: "/" } } : {}),
  openGraph: {
    type: "website", locale: "en_IN", title: `${wedding.couple.names} · We're getting married`,
    description: `${wedding.date} · ${wedding.place}. Join us in celebrating our wedding.`,
    ...(wedding.siteUrl ? { url: wedding.siteUrl, images: [{ url: `${wedding.siteUrl}/og.png`, width: 1200, height: 630, alt: `${wedding.couple.names} — ${wedding.date}` }] } : {}),
  },
  twitter: { card: "summary_large_image", title: `${wedding.couple.names} · Our Wedding`, description: `${wedding.date} · ${wedding.place}`, ...(wedding.siteUrl ? { images: [`${wedding.siteUrl}/og.png`] } : {}) },
  icons: { icon: "/icon.svg", apple: "/apple-touch-icon.png" },
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#f8f4ed", viewportFit: "cover" };

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>;
}
