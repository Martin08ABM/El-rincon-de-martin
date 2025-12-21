'use server';
import Header from '@/components/Header';
import Auth from '@/components/ui/auth';
import NameLastname from '@/components/ui/nameLastname';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';

// Esta página ahora es dinámica, como un camaleón que cambia de color según el árbol
export default async function Page({ params }: { params: { slug: string } }) {
  const {slug} = await params;

  // Buscamos el post por su slug
  const { data: post, error } = await supabase
    .from('news_posts')
    .select('*')
    .eq('slug', slug)
    .single();

  // Si no existe, mandamos al usuario a la dimensión desconocida (404)
  if (error || !post) {
    notFound();
  }

  return (
    <div className='flex flex-col md:-mt-4'>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <div className="max-w-4xl mx-auto px-4 py-4 text-center1">
        <article className="mt-2">
          <h1 className="text-4xl font-bold mb-6 text-center">
            {post.data.title}
          </h1>

          <div className="prose prose-invert prose-lg max-w-none text-left mx-auto">
            <ReactMarkdown>
              {post.data.content}
            </ReactMarkdown>
          </div>

          <div className="text-gray-500 mt-10 text-center">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>
        </article>
      </div>
    </div>
  );
}

// Esto genera las páginas estáticas en build time (Next.js es como un chef que prepara todo antes de que lleguen los clientes)
export async function generateStaticParams() {
  const { data: posts } = await supabase
    .from('news_posts')
    .select('slug');

  return posts?.map((post) => ({
    slug: post.slug,
  })) || [];
}