// src/pages/api/auth/register.ts
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const contentType = request.headers.get("content-type")?.toLowerCase() || "";
  let email: string | null = null;
  let password: string | null = null;

  try {
    if (contentType.includes("application/json")) {
      // parsear JSON enviado desde fetch
      const body = await request.json();
      email = body.email?.toString() ?? null;
      password = body.password?.toString() ?? null;
    } else if (contentType.includes("application/x-www-form-urlencoded") || contentType.includes("multipart/form-data")) {
      // parsear formulario normal
      const formData = await request.formData();
      email = formData.get("email")?.toString() ?? null;
      password = formData.get("password")?.toString() ?? null;
    } else {
      return new Response("Tipo de contenido no soportado", { status: 400 });
    }
  } catch (err) {
    return new Response("No se pudo parsear el body", { status: 400 });
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // redirige a /signin después del registro
  return redirect("/signin");
};
