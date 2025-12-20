import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';
import { NextResponse } from 'next/server';
import dotenv from 'dotenv';

dotenv.config();

// Leer lista de administradores desde el env
const ADMIN_USER = process.env.ADMIN_USER_IDS?.split(',') ?? [];

// Rutas que solo el admin puede visitar
const isAdminRoute = createRouteMatcher(['/admin(.*)']);

export default clerkMiddleware(async (auth, req) => {
  const { userId } = await auth();

  // Si es ruta de admin
  if (isAdminRoute(req)) {
    // Nadie sin iniciar sesión puede entrar
    if (!userId) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Si el usuario NO está en la lista de ADMIN_USER → prohibido
    if (!ADMIN_USER.includes(userId)) {
      return NextResponse.redirect(new URL('/', req.url));
    }

    // Todo ok → pasa
    return NextResponse.next();
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    '/(api|trpc)(.*)',
  ],
};
