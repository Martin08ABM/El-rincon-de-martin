import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 right-0 flex flex-col sm:flex-row justify-center items-center align-middle bg-transparent px-2 py-3 md:py-4 w-full min-h-[80px] sm:h-20 z-10 gap-2 sm:gap-0">
      <p className="text-xs md:text-md text-center">&copy; {new Date().getFullYear()} Todos los derechos reservados</p>
      <div className="flex flex-row align-middle justify-center items-center sm:ml-[10%] md:ml-[30%]">
        <p className="text-white text-xs md:text-md mr-2 md:mr-4 hidden sm:block">Redes sociales:</p>
        <div className="flex h-4 justify-between md:h-8">
          <ul className="flex flex-row decoration-none">
            <li>
              <Link href="https://github.com/Martin08ABM" target="_blank"><Image src="/github.png" width={4} height={4} alt="Github" className="w-4 h-4 md:w-8 md:h-8 bg-white rounded-full border-none" /></Link>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}