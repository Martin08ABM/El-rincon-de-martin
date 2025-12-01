"use client";

import Link from "next/link";

import Image from "next/image";
import { useState } from "react";
import { JetBrains_Mono } from "next/font/google";

import Nav from "@/components/styles/nav.module.css"
import Auth from "@/components/ui/auth"

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <header className="grid grid-cols-2 md:grid-cols-3 px-2 md:px-4 relative items-center mt-[-5px] md:mt-[-20px] focus:outline-0">
      {/* Columna 1: Logo */}
      <div className="col-span-1 px-2 md:px-8 py-1">
        <Link href="/">
          <Image src="/logo.png" width={200} height={200} className="w-[120px] md:w-[200px]" alt="El Rincón de Martin Logo" />
        </Link>
      </div>

      {/* Columna 2 (Desktop): Enlaces de interés (Centro) */}
      <div className="hidden md:flex col-span-1 justify-center">
        <div className={Nav.menu}>  
            <Link href="/blog">
              <p className={jetbrainsMono.className + "text-lg md:text-xl font-bold hover:text-gray-500 transition-colors"}>Blog</p>
          </Link>
          <Link href="/news">
            <p className={jetbrainsMono.className + "text-lg md:text-xl font-bold hover:text-gray-500 transition-colors"}>Noticias</p>
          </Link>
          <Link href="/about">
            <p className={jetbrainsMono.className + "text-lg md:text-xl font-bold hover:text-gray-500 transition-colors"}>Sobre mí</p>
          </Link>
          <Link href="/portfolio">
            <p className={jetbrainsMono.className + "text-lg md:text-xl font-bold hover:text-gray-500 transition-colors"}>Portafolio</p>
          </Link>
        </div>
      </div>

      {/* Columna 3 (Desktop): Inicio de sesión / Registro (Derecha) */}
      <div className="hidden md:flex col-span-1 justify-end px-8 gap-4">
        <Auth />
      </div>

      {/* Mobile: Botón de menú (Derecha) */}
      <div className="md:hidden flex justify-end px-4 col-span-1">
        <button 
          className="p-2 text-white"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="absolute top-full left-0 right-0 bg-neutral-900 backdrop-blur-sm border-t border-white md:hidden z-50 flex flex-col items-center py-6 space-y-6 shadow-xl">
          <Link href="/" onClick={() => setIsMenuOpen(false)}>
            <p className={jetbrainsMono.className + "text-2xl font-bold text-white"}>Inicio</p>
          </Link>
          <Link href="/about" onClick={() => setIsMenuOpen(false)}>
            <p className={jetbrainsMono.className + "text-2xl font-bold text-white"}>Sobre mí</p>
          </Link>
          <Link href="/contact" onClick={() => setIsMenuOpen(false)}>
            <p className={jetbrainsMono.className + "text-2xl font-bold text-white"}>Contacto</p>
          </Link>
          <hr className="w-1/2 border-gray-600" />
          <Auth />
        </div>
      )}
    </header>
  )
}