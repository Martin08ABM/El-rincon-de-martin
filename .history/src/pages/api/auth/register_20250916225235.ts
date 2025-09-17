// src/pages/api/auth/register.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request }) => {
  const contentType = (request.headers.get("content-type") || "").toLowerCase();
  console.log("Content-Type recibida:", contentType);

  let email: string | null = null;
  let password: string | null = null;

  try {
    if (contentType.includes("application/json")) {
      // JSON desde fetch()
      const body = await request.json().catch(() => null);
      if (!body) return new Response("JSON inválido o vacío", { status: 400 });
      email = body.email?.toString() ?? null;
      password = body.password?.toString() ?? null;

    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      // Form clásico/subida de archivos
      const form = await request.formData();
      email = form.get("email")?.toString() ?? null;
      password = form.get("password")?.toString() ?? null;

    } else {
      // Fallback: leer texto -> intentar JSON -> intentar urlencoded (ej. adaptadores raros)
      const text = await request.text();
      if (!text) return new Response("Cuerpo vacío", { status: 400 });

      try {
        const parsed = JSON.parse(text);
        email = parsed.email?.toString() ?? null;
        password = parsed.password?.toString() ?? null;
      } catch {
        // posiblement urlencoded (a=b&c=d)
        const params = new URLSearchParams(text);
        email = params.get("email");
        password = params.get("password");
      }
    }
  } catch (err) {
    return new Response("Error parseando body: " + String(err), { status: 400 });
  }

  if (!email || !password) {
    return new Response("Email y password son obligatorios", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) return new Response(error.message, { status: 500 });

  // Redirigir al signin (usamos 303 para POST->GET)
  return new Response(null, { status: 303, headers: { Location: "/signin" } });
};
