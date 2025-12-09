import styles from "../styles/styles.module.css"

export default function HeaderAdmin() {
  return (
    <header className={styles.headerAdmin}>
      <h1 className="text-xl md:text-2xl">Administración del blog</h1>
      {/* <p>Aquí es donde controlo todo el contenido del blog, noticias y portafolio. Además de el baneo y desbaneo de usuarios.</p> */}
      <hr className="w-full border-2 border-[#4D0707]" />
    </header>
  )
}