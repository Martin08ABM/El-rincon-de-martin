import Header from "@/components/Header"
import Auth from "@/components/ui/auth"
import NameLastname from "@/components/ui/nameLastname"


export default function PortfolioPage() {
  return (
    <div>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <div className="mx-auto mt-8 max-w-screen md:max-w-3xl">
        <h1 className="text-3xl font-black text-center">En camino...</h1>
      </div>
    </div>
  )
}