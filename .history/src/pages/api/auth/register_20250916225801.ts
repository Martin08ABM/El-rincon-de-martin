// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  console.log("headers:", request.headers.get("content-type"));
  const raw = await request.text();
  console.log("raw body:", raw);

  let body: any;
  try {
    body = JSON.parse(raw);
  } catch (err) {
    return new Response("No se pudo parsear el body como JSON", { status: 400 });
  }

  const email = body?.email;
  const password = body?.password;

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({ email, password });

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/signin");
};
