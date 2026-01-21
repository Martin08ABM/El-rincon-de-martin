import type { Metadata } from "next";

import Auth from "@/components/ui/auth";
import Header from '@/components/Header'
import Footer from "@/components/Footer";
import NameLastname from "@/components/ui/nameLastname";
import BlogSection from "@/components/ui/blogSection";
import NewsSection from "@/components/ui/newsSection";

// Metadata con el título de la página
export const metadata: Metadata = {
  title: 'Inicio | El Rincón de Martin',
}

export default function Home() {
  return (
    <div>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <main className="flex flex-col text-center mt-4 mb-24 sm:mb-20">
        <section className="container mx-auto px-4 py-4 border-2 border-neutral-400 rounded-lg w-[95%] sm:w-auto md:max-w-[50%]">
          <h1 className="text-xl sm:text-2xl font-bold text-white drop-shadow-xl drop-shadow-neutral-400 mb-4">Bienvenido a El Rincón de Martin</h1>
          <p className="text-sm sm:text-md text-red-500">
            El espacio en el que publicaré un poco de todo: proyectos, tutoriales, opiniones y más
          </p>
        </section>
        <BlogSection />
        <NewsSection />
      </main>
      <Footer />
    </div>
  )
}
