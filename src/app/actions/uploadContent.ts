'use server'

import { supabase } from "@/lib/supabase"
import { auth } from '@clerk/nextjs/server'

interface UploadResult {
  success?: boolean
  error?: string
  message?: string
  data?: any
  imageUrl?: string
}

async function checkAdminAuth(): Promise<boolean> {
  const { userId } = await auth()
  const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean)

  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return false
  }

  return true
}

export async function uploadImage(formData: FormData): Promise<UploadResult> {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { error: "No tienes permisos para subir imágenes" }
    }

    const file = formData.get("image") as File

    if (!file) {
      return { error: "No se ha seleccionado ninguna imagen" }
    }

    const fileExt = file.name.split('.').pop()
    const fileName = `${Math.random().toString(36).substring(2)}-${Date.now()}.${fileExt}`
    const filePath = `content-images/${fileName}`

    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    const { data, error } = await supabase.storage
      .from('images')
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false
      })

    if (error) {
      console.error("Error al subir imagen:", error)
      return { error: `Error al subir la imagen: ${error.message}` }
    }

    const { data: { publicUrl } } = supabase.storage
      .from('images')
      .getPublicUrl(filePath)

    return {
      success: true,
      message: "Imagen subida exitosamente",
      imageUrl: publicUrl
    }

  } catch (error) {
    console.error("Error inesperado:", error)
    return { error: "Error al procesar la imagen" }
  }
}

export async function uploadContent(formData: FormData): Promise<UploadResult> {
  try {
    const isAdmin = await checkAdminAuth()
    if (!isAdmin) {
      return { error: "No tienes permisos para subir contenido" }
    }

    const whereGo = formData.get("whereGo") as string
    const title = formData.get("titleUpload") as string
    const content = formData.get("contentUpload") as string
    const imageUrl = formData.get("imageUrl") as string

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

    // Preparar el payload JSON con soporte para imágenes
    const jsonPayload = {
      title: title.trim(),
      content: content.trim(),
      ...(imageUrl && { imageUrl: imageUrl }),
      createdAt: new Date().toISOString(),
    }

    // Determinar la tabla correcta
    const tableName = whereGo === "blog" ? "blog_posts" : "news_posts"

    // Insertar en Supabase
    const { data, error } = await supabase
      .from(tableName)
      .insert([{ data: jsonPayload, slug: slug }])
      .select()

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
      data: data,
      imageUrl: imageUrl
    }

  } catch (error) {
    console.error("Error inesperado:", error)
    return {
      error: "Algo salió mal. Probablemente culpa de los gremlins 👹"
    }
  }
}