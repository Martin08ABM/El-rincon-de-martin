import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

const { ADMIN_USER_IDS } = process.env;

// Rutas protegidas
const isAdminRoute = createRouteMatcher(['/admin(.*)']);


// Array con los userId
const ADMIN_USER =  ADMIN_USER_IDS?.split(',') ?? []; // userId

export default clerkMiddleware(async (auth, req) => {
  // // Obtenemos la información del usuario autenticado
  // const { userId } = await auth();
  
  // // Si es una ruta de admin
  // if (isAdminRoute(req)) {
  //   // Si no hay usuario autorizado, redirige al sign-in
  //   if (!userId) {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
    
  //   // Si el usuario NO es admin, lo redirigimos a la página principal
  //   if (!ADMIN_USER.includes(userId)) {
  //     return NextResponse.redirect(new URL('/', req.url));
  //   }
    
  //   // Si se valida todo, me deja pasar
  // }
});

export const config = {
  matcher: [
    // Excluye archivos estáticos y rutas internas de Next.js
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Siempre ejecuta para rutas de API
    '/(api|trpc)(.*)',
  ],
};  