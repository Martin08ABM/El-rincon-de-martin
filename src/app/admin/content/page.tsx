'use client'

import { useState } from "react"
import { uploadContent } from "@/app/actions/uploadContent"
import ReactMarkdown from "react-markdown"

interface UploadResult {
  success?: boolean
  error?: string
  message?: string
  data?: any
}

export default function ContentAdmin() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [section, setSection] = useState("blog")
  const [result, setResult] = useState<UploadResult | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async () => {
    // Validación básica del lado del cliente
    if (!title.trim() || !content.trim()) {
      setResult({ error: "Por favor rellena todos los campos" })
      return
    }

    setIsSubmitting(true)
    setResult(null)

    // Crear FormData
    const formData = new FormData()
    formData.append("whereGo", section)
    formData.append("titleUpload", title)
    formData.append("contentUpload", content)

    // Llamar a la Server Action
    const response = await uploadContent(formData)

    setResult(response)
    setIsSubmitting(false)

    // Si fue exitoso, limpiar el formulario
    if (response.success) {
      setTitle("")
      setContent("")
      
      // Opcional: cerrar mensaje de éxito después de 5 segundos
      setTimeout(() => {
        setResult(null)
      }, 5000)
    }
  }

  return (
    <div className="bg-black text-white p-6 min-h-screen">
      <h1 className="text-3xl font-black mt-4 text-center mb-8 uppercase">
        Panel de Administración de Contenido
      </h1>

      {/* Formulario */}
      <div className="flex flex-col gap-4 items-start border-2 border-gray-400 rounded-xl px-6 py-6 bg-neutral-800 w-full max-w-4xl mx-auto shadow-2xl">
        
        {/* Selector de sección */}
        <div className="w-full">
          <label htmlFor="whereGo" className="text-lg font-bold block mb-2">
            Sección de la publicación:
          </label>
          <select
            name="whereGo"
            id="whereGoTheUpload"
            value={section}
            onChange={(e) => setSection(e.target.value)}
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          >
            <option value="blog">Blog</option>
            <option value="news">Noticias</option>
          </select>
        </div>

        {/* Campo de título */}
        <div className="w-full">
          <label htmlFor="titleUpload" className="text-lg font-bold block mb-2">
            Título:
          </label>
          <input
            type="text"
            name="titleUpload"
            id="titleUpload"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Escribe un título épico aquí..."
            className="w-full border-2 border-gray-500 rounded-xl px-4 py-3 bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            maxLength={200}
          />
          <p className="text-sm text-neutral-400 mt-1">
            {title.length}/200 caracteres
          </p>
        </div>

        {/* Campo de contenido */}
        <div className="w-full">
          <label htmlFor="contentUpload" className="text-lg font-bold block mb-2">
            Contenido (soporta Markdown):
          </label>
          <textarea
            name="contentUpload"
            id="contentUpload"
            rows={12}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="## Escribe aquí tu contenido en Markdown...\n\nPuedes usar **negritas**, *cursivas*, listas, y más!"
            className="w-full border-2 border-gray-400 rounded-xl px-4 py-3 bg-neutral-600 focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm transition-all resize-y"
          />
          <p className="text-sm text-neutral-400 mt-1">
            {content.length} caracteres
          </p>
        </div>

        {/* Botón de envío */}
        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !title.trim() || !content.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-neutral-600 disabled:cursor-not-allowed text-white font-bold py-3 px-6 rounded-xl mt-4 transition-all transform hover:scale-[1.02] active:scale-[0.98]"
        >
          {isSubmitting ? (
            <span className="flex items-center justify-center gap-2">
              <span className="animate-spin">⏳</span> Subiendo contenido...
            </span>
          ) : (
            "Subir publicación"
          )}
        </button>

        {/* Mensajes de resultado */}
        {result && (
          <div
            className={`w-full p-4 rounded-xl mt-2 border-2 transition-all ${
              result.error
                ? "bg-red-900/50 border-red-500"
                : "bg-green-900/50 border-green-500"
            }`}
          >
            <p className="font-bold flex items-center gap-2">
              {result.error ? (
                <>
                  <span>❌</span>
                  <span>Error: {result.error}</span>
                </>
              ) : (
                <>
                  <span>✅</span>
                  <span>{result.message}</span>
                </>
              )}
            </p>
          </div>
        )}
      </div>

      {/* Vista previa */}
      <div className="w-full max-w-4xl mx-auto mt-10">
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>Vista previa en tiempo real:</span>
        </h2>
        <div className="border-2 border-neutral-600 p-8 rounded-xl bg-neutral-800 shadow-2xl min-h-[300px]">
          {title && (
            <h1 className="text-4xl font-bold mb-6 text-blue-400 border-b-2 border-blue-400 pb-4">
              {title}
            </h1>
          )}
          {content ? (
            <div className="prose prose-invert prose-lg max-w-none">
              <ReactMarkdown>{content}</ReactMarkdown>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center h-48 text-center">
              <p className="text-neutral-500 italic text-lg">
                Aquí aparecerá tu obra maestra... o al menos algo legible
              </p>
              <p className="text-neutral-600 text-sm mt-2">
                (Empieza a escribir arriba para ver la magia)
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Info útil */}
      <div className="w-full max-w-4xl mx-auto mt-8 p-4 bg-neutral-900 rounded-xl border border-neutral-700">
        <h3 className="font-bold mb-2">Tips de Markdown:</h3>
        <ul className="text-sm text-neutral-400 space-y-1">
          <li>• <code className="bg-neutral-800 px-1 rounded">**texto**</code> para negrita</li>
          <li>• <code className="bg-neutral-800 px-1 rounded">*texto*</code> para cursiva</li>
          <li>• <code className="bg-neutral-800 px-1 rounded"># Título</code> para títulos grandes</li>
          <li>• <code className="bg-neutral-800 px-1 rounded">## Subtítulo</code> para subtítulos</li>
          <li>• <code className="bg-neutral-800 px-1 rounded">- item</code> para listas</li>
        </ul>
      </div>
    </div>
  )
}