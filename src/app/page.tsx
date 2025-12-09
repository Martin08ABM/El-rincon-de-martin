import type { Metadata } from "next";

import Auth from "@/components/ui/auth";
import Header from '@/components/Header'
import Footer from "@/components/Footer";
import NameLastname from "@/components/ui/nameLastname";

// Metadata con el título de la página
export const metadata: Metadata = {
  title: 'Inicio | El Rincón de Martin',
}

export default function Home() {
  return (
    <>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <Footer />
    </>
  )
}
