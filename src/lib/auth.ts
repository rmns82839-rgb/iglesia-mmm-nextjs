import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { usuarios } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function getUsuarioActual() {
  const { userId } = await auth()
  if (!userId) return null

  const user = await db.select().from(usuarios)
    .where(eq(usuarios.clerkId, userId)).limit(1)

  return user.length > 0 ? user[0] : null
}

export async function esAdmin() {
  const usuario = await getUsuarioActual()
  return usuario?.rol === 'admin'
}