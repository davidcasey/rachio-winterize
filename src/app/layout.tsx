import type { Metadata } from 'next';

import { WakeLockProvider } from 'app/providers/WakeLockProvider';

import { Geist, Geist_Mono } from 'next/font/google';
import 'app/globals.css';

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rachio Winterize",
  description: "Winterize your Rachio irrigation system with ease.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <WakeLockProvider />
        {children}
      </body>
    </html>
  );
}
