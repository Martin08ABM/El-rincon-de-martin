import type { Metadata } from "next";

import Header from '@/components/Header'
import Footer from "@/components/Footer";

// Metadata con el título de la página
export const metadata: Metadata = {
  title: 'Inicio | El Rincón de Martin',
}

export default function Home() {
  return (
    <>
      <Header />
      <Footer />
    </>
  )
}
