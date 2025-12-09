// app/api/admin/users/route.ts
import { NextResponse } from 'next/server';
import { getAuth, clerkClient } from '@clerk/nextjs/server';

export async function GET(req: Request) {
  // 1) Autorización: aquí usamos getAuth para asegurarnos de que quien llama está autenticado
  //    y luego deberías comprobar que es admin (ej: lista de adminIds, metadata, rol de org, etc).
  const { userId } = getAuth(); // si no hay usuario, userId será undefined

  // simple guard: control real en tu app (usa roles/metadata o una lista en env)
  const ADMIN_IDS = (process.env.ADMIN_IDS || '').split(',').filter(Boolean);
  if (!userId || !ADMIN_IDS.includes(userId)) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorized' }), { status: 401 });
  }

  // 2) Llamada al SDK backend de Clerk
  try {
    // Paginación: page, per_page desde querystring
    const url = new URL(req.url);
    const page = Number(url.searchParams.get('page') || 1);
    const limit = Number(url.searchParams.get('limit') || 50);

    const res = await clerkClient.users.getUserList({
      page,
      per_page: limit,
      // opcional: order, filter, include_deleted, etc según tu caso
    });

    // mapear a campos que te interesen
    const users = (res.data || []).map(u => ({
      id: u.id,
      email: u.emailAddresses?.[0]?.emailAddress ?? null,
      name: `${u.firstName ?? ''} ${u.lastName ?? ''}`.trim() || null,
      imageUrl: u.imageUrl ?? null,
      createdAt: u.createdAt,
      lastSignInAt: u.lastSignInAt ?? null,
      banned: u.banned ?? false,
    }));

    return NextResponse.json({ users, totalCount: res.totalCount });
  } catch (err) {
    console.error('Error listing users', err);
    return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}
