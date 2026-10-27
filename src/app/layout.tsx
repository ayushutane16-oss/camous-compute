import type { Metadata, Viewport } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Campus Ride — Smart Student Carpooling',
  description: 'Peer-to-peer cost-sharing carpool platform for university students. Find or offer rides between campus and metro stations.',
  keywords: ['campus carpool', 'student rides', 'cost sharing', 'university transport'],
  authors: [{ name: 'Campus Ride' }],
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Campus Ride',
  },
};

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#10b981',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <link rel="apple-touch-icon" href="/icons/icon-192.png" />
      </head>
      <body className={`${inter.variable} font-sans bg-zinc-950 text-zinc-50 antialiased`}>
        {children}
      </body>
    </html>
  );
}
