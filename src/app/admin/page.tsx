import HeaderAdmin from "./components/Header"
import NavAdmin from "./components/NavAdmin"

export default function Administrator() {
  return (
    <>
      <div className="flex flex-col">
        <HeaderAdmin />
        <NavAdmin />
      </div>
    </>
  )
}