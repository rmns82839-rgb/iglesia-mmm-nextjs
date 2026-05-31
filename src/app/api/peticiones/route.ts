import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@clerk/nextjs/server'
import { db } from '@/db'
import { peticiones, usuarios } from '@/db/schema'
import { eq } from 'drizzle-orm'

export async function POST(req: NextRequest) {
  try {
    const { userId } = await auth()
    const { nombre, peticion, esAnonima } = await req.json()

    if (!peticion?.trim()) {
      return NextResponse.json({ error: 'La petición es requerida' }, { status: 400 })
    }

    // Buscar usuario en la DB si está logueado
    let usuarioId = null
    if (userId) {
      const user = await db.select().from(usuarios).where(eq(usuarios.clerkId, userId)).limit(1)
      if (user.length > 0) usuarioId = user[0].id
    }

    await db.insert(peticiones).values({
      usuarioId,
      nombreSolicitante: esAnonima ? 'Anónimo' : nombre?.trim() || 'Visitante',
      peticion: peticion.trim(),
      estado: 'pendiente',
      esAnonima: esAnonima || false,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('Error al guardar petición:', error)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

export async function GET() {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: 'No autorizado' }, { status: 401 })
    }

    const todas = await db.select().from(peticiones).orderBy(peticiones.creadoEn)
    return NextResponse.json(todas)
  } catch (error) {
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}