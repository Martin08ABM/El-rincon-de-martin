import Link from "next/link";

export default function NavAdmin() {
  return (
    <>
      <nav className="px-6 py-2">
        <ul className="flex flex-row gap-4 justify-around border-2 border-[#7c7979] rounded-lg px-2 py-2">
          <li><Link href="/admin/users" className="text-[1rem] font-bold hover:text-[#7c7979]">Usuarios</Link></li>
          <li><Link href="/admin/content" className="text-[1rem] font-bold hover:text-[#7c7979]">Contenido</Link></li>
          <li><Link href="/admin/config" className="text-[1rem] font-bold hover:text-[#7c7979]">Configuración</Link></li>
        </ul>
      </nav>
    </>
  )
}