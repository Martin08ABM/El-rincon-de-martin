import { defineMiddleware } from 'astro/middleware';

const MI_TOKEN_SECRETO = import.meta.env.MI_TOKEN_SECRETO;

export const onRequest = defineMiddleware((context, next) => {
  const url = new URL(context.request.url);

  // Rutas que quieres proteger
  const rutasProtegidas = ['/createBlogPost', '/createProjectPost'];

  if (rutasProtegidas.includes(url.pathname)) {
    // Obtenemos el token de la URL
    const token = url.searchParams.get('key');

    if (token === MI_TOKEN_SECRETO) {
      // El token es correcto, permite la petición
      return next();
    } else {
      // El token no es correcto, niega el acceso
      return new Response('Acceso no autorizado', {
        status: 401,
      });
    }
  }

  // Para el resto de las rutas, sigue adelante
  return next();
});