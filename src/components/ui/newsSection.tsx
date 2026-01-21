'use server';
import { supabase } from "@/lib/supabase";
import Link from "next/link";

// Iniciar el cliente de Supabase
const supabaseClient = supabase;

export default async function NewsSection() {
  const {data: posts } = await supabaseClient
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false });
  return (
    <div className="flex flex-col text-left mt-10 ml-4 md:ml-[50px] w-[90%] md:w-auto">
      <h2 className="text-base md:text-xl">Últimas publicaciones de noticias:</h2>
      <div className="flex flex-row left-0 relative mt-4 ml-2 md:ml-6 overflow-x-auto">
        <ul className="flex flex-row gap-3 md:gap-4">
          {posts?.map((post) => (
            <li
              key={post.id}
              className="min-w-[280px] md:min-w-[300px] max-h-[100px] shrink-0 overflow-hidden border-2 border-neutral-600 rounded-lg px-3 md:px-4 py-2 bg-neutral-800 hover:bg-neutral-700/40 transition-all duration-200">
              <Link href={`/news/${post.slug}`} className="text-blue-500">
                <p className="text-base md:text-lg font-bold truncate">
                  {post.data.title}
                </p>
                <span className="text-sm md:text-md line-clamp-2 text-neutral-300">
                  {post.data.content}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}