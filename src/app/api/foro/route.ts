import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { comentariosForo, usuarios } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'

export async function GET() {
  try {
    const comentarios = await db
      .select()
      .from(comentariosForo)
      .where(eq(comentariosForo.moderado, false))
      .orderBy(desc(comentariosForo.creadoEn))
      .limit(50)
    return NextResponse.json(comentarios)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const { contenido, nombreUsuario } = await req.json()

    if (!contenido?.trim() || contenido.length > 300) {
      return NextResponse.json({ error: 'Contenido inválido' }, { status: 400 })
    }

    if (!nombreUsuario?.trim() || nombreUsuario.length > 40) {
      return NextResponse.json({ error: 'Nombre inválido' }, { status: 400 })
    }

    let usuarioId = null
    if (userId) {
      const user = await db.select().from(usuarios)
        .where(eq(usuarios.clerkId, userId)).limit(1)
      if (user.length > 0) usuarioId = user[0].id
    }

    const nuevo = await db.insert(comentariosForo).values({
      usuarioId,
      nombreUsuario: nombreUsuario.trim(),
      contenido: contenido.trim(),
      moderado: false,
    }).returning()

    return NextResponse.json(nuevo[0])
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id } = await req.json()
    await db.delete(comentariosForo).where(eq(comentariosForo.id, id))
    return NextResponse.json({ ok: true })
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}