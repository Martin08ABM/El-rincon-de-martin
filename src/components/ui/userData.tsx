"use server";

import { clerkClient } from "@clerk/nextjs/server";
import { auth } from "@clerk/nextjs/server";

export default async function UserData() {
  const { userId } = await auth()

  if (!userId) return null

  const client = await clerkClient()
  const user = await client.users.getUser(userId)

  return (
    <p>{user.firstName} {user.lastName}</p>
  )
}