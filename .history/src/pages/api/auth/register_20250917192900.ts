import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  let email: string | undefined;
  let password: string | undefined;

  try {
    const contentType = request.headers.get("content-type") || "";

    if (contentType.includes("application/json")) {
      // 👉 Caso 1: fetch con JSON
      const body = await request.json();
      email = body.email;
      password = body.password;
    } else if (
      contentType.includes("application/x-www-form-urlencoded") ||
      contentType.includes("multipart/form-data")
    ) {
      // 👉 Caso 2: formulario clásico
      const formData = await request.formData();
      email = formData.get("email")?.toString();
      password = formData.get("password")?.toString();
    }
  } catch (err) {
    return new Response("Bad request format", { status: 400 });
  }

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // ✅ Redirigir a login tras registrarse
  return redirect("/signin");
};