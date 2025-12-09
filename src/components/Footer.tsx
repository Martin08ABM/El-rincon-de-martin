import Image from "next/image";

export default function Footer() {
  return (
    <footer className="flex justify-center items-center align-middle bg-transparent px-2 py-4 fixed bottom-0 w-full h-20">
      <p className="text-xs md:text-md">&copy; {new Date().getFullYear()} Todos los derechos reservados</p>
      <div className="flex flex-row align-middle justify-center items-center ml-[10%] md:ml-[30%]">
        <p className="text-white text-xs md:text-md mr-4 hidden md:block">Redes sociales:</p>
        <div className="flex h-4 justify-between md:h-8">
          <ul className="flex flex-row decoration-none">
            <li className="mr-4">
              <Image src="/instagram.svg" width={4} height={4} alt="Instagram" className="w-4 h-4 md:w-8 md:h-8" />
            </li>
            <li>
              <Image src="/github.png" width={4} height={4} alt="Github" className="w-4 h-4 md:w-8 md:h-8 bg-white rounded-full border-none" />
            </li>
            <li className="ml-4 mr-4">
              <Image src="/youtube.png" width={4} height={4} alt="Youtube" className="w-4 h-4 md:w-8 md:h-8" />
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}