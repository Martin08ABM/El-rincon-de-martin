import { supabase } from '@/lib/supabase';
import { Metadata } from 'next';
import Link from 'next/link';

// Importación de los componentes
import Header from '@/components/Header';
import Auth from '@/components/ui/auth';
import NameLastname from '@/components/ui/nameLastname';
import Filter from './components/Filter';

// Metadata para la página del blog
export const metadata: Metadata = {
  title: 'Blog',
  description: 'Este es mi blog personal donde comparto artículos sobre desarrollo web y tecnología',
};

// Iniciar el cliente de Supabase
const supabaseClient = supabase;

// Componente de la página del blog
export default async function BlogPage() {
  const {data: posts } = await supabaseClient
    .from('news_posts')
    .select('*')
    .order('created_at', { ascending: false });
  
  return (
    <div>
      <Header userData={<NameLastname />} auth={<Auth />} />
      <div className='flex flex-row align-middle items-center justify-between mt-2 md:mt-4'>
        <h2 className="text-3xl font-bold mb-4 left-0">Noticias</h2>
        <Filter />
      </div>
      <main className='flex flex-col relative py-2 -mt-4'>
        <div className='flex mt-8 mb-16 gap-8'>
          <ul className='grid grid-cols-4 gap-4 px-6 py-4 justify-center'>
            {posts?.map((post) => (
              <li key={post.id} className='px-4 py-2 ml-4 mr-4 border-2 border-blue-700 rounded-xl bg-blue-600/40 hover:bg-blue-600/30 hover:scale-105 transition-all duration-200 shadow-xl shadow-blue-700/60'>
                <Link href={`/news/${post.slug}`}>
                  <h2 className='text-2xl font-black'>{post.data.title}</h2>
                  <p className='text-lg font-normal'>{post.data.content}</p>
                  <span className='text-[12px]'>{post.data.created_at}</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  )
}
