import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ variable: '--font-serif', subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500', '600'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'https://christy-amala.vercel.app';
const socialImage = '/og.png?v=wa-20260903';

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: 'You’re invited — Christy & Amala',
  description: 'Tap to open our wedding invitation · 03 January 2027.',
  openGraph: {
    title: 'You’re invited — Christy & Amala',
    description: 'Tap to open our wedding invitation · 03 January 2027.',
    type: 'website',
    siteName: 'Christy & Amala',
    url: '/',
    images: [{ url: socialImage, width: 1792, height: 1024, alt: 'Christy and Amala wedding celebration' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'You’re invited — Christy & Amala',
    description: 'Tap to open our wedding invitation · 03 January 2027.',
    images: [socialImage],
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
