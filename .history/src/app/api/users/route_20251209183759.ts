import { NextResponse } from "next/server";
import { clerkClient } from "@/lib/users/";

export async function GET() {
  try {
    const { users } = await clerkClient().users.getUserList()
  }
}