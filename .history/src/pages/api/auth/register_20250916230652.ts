import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  const rawContentType = request.headers.get("content-type") || "";
  const contentType = rawContentType.split(";")[0].trim().toLowerCase(); // <--- quitar charset, etc.
  console.log("Content-Type detectado:", contentType);

  let email: string | null = null;
  let password: string | null = null;

  try {
    if (contentType === "application/json") {
      const body = await request.json();
      email = body.email?.toString() ?? null;
      password = body.password?.toString() ?? null;
    } else if (contentType === "application/x-www-form-urlencoded" || contentType === "multipart/form-data") {
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
    return new Response("Email and password son required", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/signin");
};
