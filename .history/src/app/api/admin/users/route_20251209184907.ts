import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function GET(req: Request) {
  const { userId } = getAuth();

  const ADMIN_USER_IDS = (process.env.A)
}