import { NextResponse } from "next/server";
import cler

export async function GET() {
  try {
    const { users } = await clerkClient().users.getUserList()
  }
}