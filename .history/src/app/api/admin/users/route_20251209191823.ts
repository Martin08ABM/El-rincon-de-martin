import { NextResponse } from "next/server";
import { getAuth, clerkClient, User } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  // Comprobación si el usuario está logueado y es admin
  const { userId } = await getAuth(Request); // <- Pásale el req
  
  // Recuperar los IDs de administradores desde las variables de entorno
  const ADMIN_USER_IDS = (process.env.ADMIN_USER_IDS || "").split(",").filter(Boolean);
  
  // Verificar si el usuario es un administrador y está logueado
  if (!userId || !ADMIN_USER_IDS.includes(userId)) {
    return new NextResponse(JSON.stringify({ error: 'Unauthorised' }), { status: 401 });
  }
  
  // Obtener la lista de los usuarios de Clerk mediante el SDK de Clerk
  try {
    const url = new URL(req.url);
    const page = url.searchParams.get('page') || '1';
    const limit = url.searchParams.get('limit') || '10';
    
    const res = await clerkClient.users.getUserList({
      limit: parseInt(limit),
      offset: (parseInt(page) - 1) * parseInt(limit),
      orderBy: 'created_at',
    });
    
    // Mapear los usuarios DESDE res
    const usersList = res.data.map((user) => ({
      id: user.id,
      email: user.emailAddresses?.[0]?.emailAddress ?? null,
      name: `${user.firstName ?? ''} ${user.lastName ?? ''}`.trim() || null,
      createdAt: user.createdAt,
      lastSignInAt: user.lastSignInAt ?? null,
      banned: user.banned ?? false,
    }));
    
    return NextResponse.json({ 
      users: usersList, 
      totalCount: res.totalCount 
    });
  } catch (error) {
    console.error('Error listing users', error);
    return new NextResponse(JSON.stringify({ error: 'Server error' }), { status: 500 });
  }
}