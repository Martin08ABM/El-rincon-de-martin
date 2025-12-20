export default function Filter() {
  return (
    <div className="flex flex-row-reverse right-0">
      <nav className="flex flex-row justify-between max-h-8 items-center">
        <label htmlFor="sortBy" className="font-bold text-sm">Filtros:</label>
        <select className="flex border-2 border-blue-800 px-1 py-1 rounded-xl ml-2 bg-neutral-700 outline-none">
          <option value="">Sin filtros</option>
          <option value="moreRecent">Más reciente</option>
          <option value="moreOld">Más antiguo</option>
          <option value="mostViewed">Más visto</option>
          <option value="mostCommented">Más comentado</option>
        </select>
      </nav>
    </div>
  )
}