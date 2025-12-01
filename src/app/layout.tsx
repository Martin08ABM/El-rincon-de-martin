import type { Metadata } from "next";
import "./globals.css";

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
    <html lang="es">
      <body className="px-4 py-2 bg-black w-screen h-screen">
        {children}
      </body>
    </html>
  );
}
