import type { APIRoute } from "astro";
import { supabase } from "../../../lib/supabase";

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return new Response("Email and password are required", { status: 400 });
    }

    const { error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return new Response(error.message, { status: 500 });
    }

    return redirect("/signin"); // 👈 funciona igual que antes
  } catch (err) {
    return new Response("Invalid JSON", { status: 400 });
  }
};