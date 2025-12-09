// app/api/admin/users/[id]/route.ts
import { NextResponse } from 'next/server';
import { auth } from '@clerk/nextjs/server';
import { clerkClient } from '@clerk/nextjs/server';

function checkAdmin(userId?: string | null) {
  const ADMIN_IDS = (process.env.ADMIN_USER_IDS || '').split(',').filter(Boolean);
  return userId && ADMIN_IDS.includes(userId);
}

// ELIMINAR usuario (¡Cuidado! Es como el botón rojo nuclear ☢️)
export async function DELETE(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!checkAdmin(userId)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id: targetId } = await params;
  
  try {
    const client = await clerkClient();
    await client.users.deleteUser(targetId);
    
    return new NextResponse(null, { status: 204 });
  } catch (err) {
    console.error('Error deleting user:', err);
    return new NextResponse('Error deleting user', { status: 500 });
  }
}

// BANEAR o DESBANEAR usuario
export async function POST(
  req: Request, 
  { params }: { params: Promise<{ id: string }> }
) {
  const { userId } = await auth();
  if (!checkAdmin(userId)) {
    return new NextResponse('Unauthorized', { status: 401 });
  }

  const { id: targetId } = await params;
  
  try {
    const { action } = await req.json();
    const client = await clerkClient();
    
    if (action === 'ban') {
      await client.users.banUser(targetId);
    } else if (action === 'unban') {
      await client.users.unbanUser(targetId);
    } else {
      return new NextResponse('Bad Request - action must be "ban" or "unban"', { 
        status: 400 
      });
    }
    
    return NextResponse.json({ 
      ok: true, 
      action,
      message: `User ${action === 'ban' ? 'banned' : 'unbanned'} successfully` 
    });
  } catch (err) {
    console.error('Error updating user ban status:', err);
    return new NextResponse('Error updating user', { status: 500 });
  }
}