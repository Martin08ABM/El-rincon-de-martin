// With `output: 'static'` configured:
// export const prerender = false;
import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  let body: any = {};
  let raw: string;

  try {
    raw = await request.text();
    console.log("raw:", raw);
    if (raw) {
      body = JSON.parse(raw);
    }
  } catch (err) {
    return new Response("Error leyendo JSON: " + String(err), { status: 400 });
  }

  const email = body?.email;
  const password = body?.password;

  console.log("Email recibido:", email, "Password:", password);

  if (!email || !password) {
    return new Response("Email and password are required", { status: 400 });
  }

  const { error } = await supabase.auth.signUp({ email, password });
  if (error) {
    return new Response(error.message, { status: 500 });
  }

  return redirect("/signin");
};
