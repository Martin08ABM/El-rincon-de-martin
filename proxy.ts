import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';

// Rutas protegidas
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

// Array con los userId
const ADMIN_USER_ID = 'user_36EkDrBzUzwfrsMZp0erQWZRcFC'; // userId

export default clerkMiddleware(async (auth, req) => {
  // Obtenemos la información del usuario autenticado
  const { userId } = await auth();
  
  // Si es una ruta de admin
  if (isAdminRoute(req)) {
    // Si no hay usuario autenticado, redirige al sign-in
    if (!userId) {
      return NextResponse.redirect(new URL('/sign-in', req.url));
    }
    
    // Si el usuario NO es admin, lo redirigimos a la página principal
    if (userId !== ADMIN_USER_ID) {
      return NextResponse.redirect(new URL('/', req.url));
    }
    
    // Si se valida todo, me deja pasar
  }
});

export const config = {
  matcher: [
    // Excluye archivos estáticos y rutas internas de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta para rutas de API
    '/(api|trpc)(.*)',
  ],
};