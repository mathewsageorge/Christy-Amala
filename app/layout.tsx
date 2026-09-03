import type { Metadata } from 'next';
import { Cormorant_Garamond, DM_Sans } from 'next/font/google';
import './globals.css';

const serif = Cormorant_Garamond({ variable: '--font-serif', subsets: ['latin'], weight: ['400', '500', '600', '700'] });
const sans = DM_Sans({ variable: '--font-sans', subsets: ['latin'], weight: ['400', '500', '600'] });
const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : undefined);

export const metadata: Metadata = {
  ...(siteUrl ? { metadataBase: new URL(siteUrl) } : {}),
  title: 'Christy & Amala | Wedding Celebration',
  description: 'Join us to celebrate the wedding of Christy and Amala on 03 January 2027.',
  openGraph: {
    title: 'Christy & Amala | Wedding Celebration',
    description: 'Join us on 03 January 2027.',
    images: [{ url: '/og.png', width: 1792, height: 1024, alt: 'Christy and Amala wedding celebration' }],
  },
  twitter: { card: 'summary_large_image', title: 'Christy & Amala | Wedding Celebration', images: ['/og.png'] },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body className={`${serif.variable} ${sans.variable}`}>{children}</body></html>;
}
