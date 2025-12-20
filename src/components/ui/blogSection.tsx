'use server';
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Iniciar el cliente de Supabase
const supabaseClient = supabase;

export default async function BlogSection() {
  const {data: posts } = await supabaseClient
    .from('blog_posts')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="flex flex-col text-left mt-10 ml-4 md:ml-[50px] w-[80%]">
      <h2 className="text-md md:text-xl">Últimas publicaciones de mi blog:</h2>
      <div className="flex flex-row left-0 relative mt-4 ml-6 overflow-x-auto">
        <ul className="flex flex-row gap-4">
          {posts?.map((post) => (
            <li key={post.id} className="border-2 border-neutral-600 rounded-lg px-4 py-2 bg-neutral-800 hover:bg-neutral-700/40 transition-all duration-200 min-w-[300px] max-h-[100px] flex-shrink-0">
              <Link href={`blog/${post.slug}`} className="text-blue-500 hover:underline-none">
                <p className="text-lg font-bold">{post.data.title}</p>
                <span className="text-md">{post.data.content}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}