import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Auth from "@/components/ui/auth";
import NameLastname from "@/components/ui/nameLastname";

export default function AboutPage() {
  return (
    <div>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <main className="flex flex-col mx-auto justify-center max-w-screen md:max-w-3xl p-4 gap-8">
        <h1 className="uppercase text-3xl text-red-700 font-black text-center mb-2">Sobre mí</h1>
        <section className="text-start mb-2">
          <h2 className="text-2xl text-blue-800 font-extrabold">Quién soy</h2>
          <p className="text-md">
            Me llamo Martín y soy desarrollador web. Me gusta construir cosas,
            entender cómo funcionan por dentro y mejorarlas poco a poco hasta
            que encajan como deben. Programar para mí no es solo escribir
            código, sino resolver problemas de forma creativa y práctica. Desde
            siempre me ha atraído la tecnología y todo lo que implica crear en
            el entorno digital. Con el tiempo, esa curiosidad se convirtió en
            una forma de pensar: analizar, probar, equivocarse, aprender y
            volver a intentarlo (normalmente con menos errores que la vez
            anterior).
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-blue-800 font-extrabold">Mi enfoque como desarrollador</h2>
          <p className="text-md">
            Me interesa el desarrollo web moderno, limpio y bien estructurado.
            Valoro mucho el código entendible, el diseño funcional y las
            soluciones que tienen sentido a largo plazo. No me obsesiona hacer
            algo “perfecto”, pero sí hacerlo bien y con intención. Me gusta
            aprender nuevas herramientas y tecnologías, pero siempre con un
            enfoque práctico: entender para qué sirven, cuándo usarlas y cuándo
            no. Prefiero soluciones sencillas que funcionen antes que
            complicaciones innecesarias que solo quedan bonitas en teoría.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-blue-800 font-extrabold">Sobre este blog</h2>
          <p className="text-md">
            Este blog es un espacio personal donde comparto mi proceso de
            aprendizaje como desarrollador. Aquí escribo sobre proyectos en los
            que trabajo, conceptos técnicos que voy descubriendo, problemas
            reales y las soluciones que encuentro por el camino. No es un manual
            definitivo ni una colección de verdades absolutas. Es más bien un
            cuaderno de bitácora: lo que aprendo, lo que pruebo y lo que creo
            que puede ser útil para otros que estén recorriendo un camino
            parecido.
          </p>
        </section>
        <section>
          <h2 className="text-2xl text-blue-800 font-extrabold">Qué puedes encontrar aquí</h2>
          <span className="text-md">
            En este blog suelo hablar de:
            <ul className="decoration-white decoration-2 list-disc list-inside my-2 ml-6">
              <li>Desarrollo web y programación</li>
              <li>Proyectos personales y experimentos</li>
              <li>Noticias sobre el mundo tecnológico</li>
              <li>
                Diseño, estructura y buenas prácticas (mientras voy aprendiendo)
              </li>
              <li>Reflexiones sobre tecnología y aprendizaje</li>
            </ul>
            La idea es compartir contenido honesto, útil y aplicable, tanto para
            quien empieza como para quien ya lleva un tiempo en esto.
          </span>
        </section>
        <section>
          <h2 className="text-2xl text-blue-800 font-extrabold">Mirando al futuro</h2>
          <p className="text-md">
            Mi objetivo es seguir creciendo como desarrollador, afrontar nuevos
            retos y crear proyectos cada vez más sólidos. Este blog forma parte
            de ese proceso: documentar el camino, mejorar con el tiempo y
            construir algo que tenga sentido más allá de una sola línea de
            código. Si algo de lo que lees aquí te sirve, te inspira o te ayuda
            a resolver un problema, ya habrá valido la pena. Gracias por pasarte
            por aquí y acompañarme en el viaje
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}
