import { NextResponse } from 'next/server'
import { db } from '@/db'
import { peticiones, comentariosForo, usuarios, miembros } from '@/db/schema'
import { eq } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET() {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }

  const todasPeticiones = await db.select().from(peticiones)
  const todosComentarios = await db.select().from(comentariosForo)
  const todosUsuarios = await db.select().from(usuarios)
  const todosMiembros = await db.select().from(miembros)

  return NextResponse.json({
    stats: {
      peticionesTotal: todasPeticiones.length,
      peticionesPendientes: todasPeticiones.filter(p => p.estado === 'pendiente').length,
      peticionesOradas: todasPeticiones.filter(p => p.estado === 'orada').length,
      comentariosTotal: todosComentarios.length,
      usuariosTotal: todosUsuarios.length,
      miembrosTotal: todosMiembros.length,
    }
  })
}