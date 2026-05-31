import { NextResponse } from 'next/server'
import { auth, currentUser } from '@clerk/nextjs/server'
import { db } from '@/db'
import { usuarios, peticiones, comentariosForo } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const clerkUser = await currentUser()

    // Buscar o crear usuario en la DB
    let dbUser = await db.select().from(usuarios)
      .where(eq(usuarios.clerkId, userId)).limit(1)

    if (dbUser.length === 0) {
      const nuevo = await db.insert(usuarios).values({
        clerkId: userId,
        email: clerkUser?.emailAddresses[0]?.emailAddress || '',
        nombre: `${clerkUser?.firstName || ''} ${clerkUser?.lastName || ''}`.trim(),
        rol: 'miembro',
      }).returning()
      dbUser = nuevo
    }

    const usuario = dbUser[0]

    // Peticiones del usuario
    const misPeticiones = await db.select().from(peticiones)
      .where(eq(peticiones.usuarioId, usuario.id))
      .orderBy(desc(peticiones.creadoEn))
      .limit(10)

    // Comentarios del foro
    const misComentarios = await db.select().from(comentariosForo)
      .where(eq(comentariosForo.usuarioId, usuario.id))
      .orderBy(desc(comentariosForo.creadoEn))
      .limit(5)

    return NextResponse.json({
      usuario,
      peticiones: misPeticiones,
      comentarios: misComentarios,
      stats: {
        totalPeticiones: misPeticiones.length,
        peticionesPendientes: misPeticiones.filter(p => p.estado === 'pendiente').length,
        totalComentarios: misComentarios.length,
      }
    })
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}