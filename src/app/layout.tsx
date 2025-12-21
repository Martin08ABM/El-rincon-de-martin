import type { Metadata } from "next";
import './globals.css';
import { ClerkProvider } from '@clerk/nextjs'
import { Geist, Geist_Mono } from 'next/font/google'
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

// Metadata con el título dinámico
export const metadata: Metadata = {
  title: {
    template: '%s | El Rincón de Martin', // %s es donde se inserta el título
    default: 'El Rincón de Martin',
  },
  description: "El Rincón de Martin, mi blog personal donde encontrarás muchas cosas relacionadas con el mundo tech",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <ClerkProvider>
      <Analytics />
      <html lang="es">
        <body className={`${geistSans.variable} ${geistMono.variable} antialiased px-4 py-2 bg-black w-screen h-screen`}>
          {children}
        </body>
      </html>
    </ClerkProvider>
  );
}
