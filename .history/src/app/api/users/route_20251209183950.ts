import { NextResponse } from 'next/server';
import { clerkClient } from '@clerk/backend';

export async function GET() {
  try {
    const { users } = await clerkClient().users.getUserList();
    return NextResponse.json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    return NextResponse.json({ error: 'Error al obtener usuarios' }, { status: 500 });
  }
}
