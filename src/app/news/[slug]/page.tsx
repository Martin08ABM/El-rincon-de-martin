'use server';
import Header from '@/components/Header';
import Auth from '@/components/ui/auth';
import NameLastname from '@/components/ui/nameLastname';
import { supabase } from '@/lib/supabase';
import { notFound } from 'next/navigation';

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
    <div className='flex flex-col'>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <div className="max-w-4xl mx-auto px-4 py-8 text-center1">
        <article className='mx-auto'>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
          <p>{post.data.content}</p>
          
          {/* Metadatos del post (porque todos merecemos crédito, hasta los gatos blogueros) */}
          <div className="text-gray-600 mb-6">
            <time dateTime={post.created_at}>
              {new Date(post.created_at).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </time>
          </div>

          {/* El contenido del post */}
          <div className="prose prose-lg max-w-none">
            {post.content}
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