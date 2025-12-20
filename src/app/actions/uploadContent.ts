'use server'

import { supabase } from "@/lib/supabase"

interface UploadResult {
  success?: boolean
  error?: string
  message?: string
  data?: any
}

export async function uploadContent(formData: FormData): Promise<UploadResult> {
  try {
    const whereGo = formData.get("whereGo") as string
    const title = formData.get("titleUpload") as string
    const content = formData.get("contentUpload") as string

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

    // Validaciones básicas
    if (!title || !content) {
      return { error: "El título y el contenido son obligatorios" }
    }

    if (!title.trim() || !content.trim()) {
      return { error: "No puedes subir contenido vacío (aunque la tentación sea grande 😅)" }
    }

    // Validar sección
    if (!["blog", "news"].includes(whereGo)) {
      return { error: "Sección desconocida. ¿Intentas hackearme? 🕵️" }
    }

    // Preparar el payload JSON
    const jsonPayload = {
      title: title.trim(),
      content: content.trim(),
    }

    // Determinar la tabla correcta
    const tableName = whereGo === "blog" ? "blog_posts" : "news_posts"

    // Insertar en Supabase
    const { data, error } = await supabase
      .from(tableName)
      .insert([{ data: jsonPayload, slug: slug }])
      .select() // Para obtener el registro insertado

    if (error) {
      console.error("Error de Supabase:", error)
      return { 
        error: `Error al subir a ${whereGo}: ${error.message}` 
      }
    }

    // Éxito total
    return {
      success: true,
      message: `¡Contenido subido exitosamente a ${whereGo === "blog" ? "Blog" : "Noticias"}! 🎉`,
      data: data
    }

  } catch (error) {
    console.error("Error inesperado:", error)
    return {
      error: "Algo salió mal. Probablemente culpa de los gremlins 👹"
    }
  }
}