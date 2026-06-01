import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { ujieres } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET() {
  const lista = await db.select().from(ujieres)
    .where(eq(ujieres.activo, true))
    .orderBy(desc(ujieres.creadoEn))
  return NextResponse.json(lista)
}

export async function POST(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { nombre, whatsapp } = await req.json()
  if (!nombre?.trim() || !whatsapp?.trim()) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  // Limpia el número: deja solo dígitos, agrega 57 si no lo tiene
  let num = whatsapp.replace(/\D/g, '')
  if (!num.startsWith('57')) num = '57' + num
  const nuevo = await db.insert(ujieres).values({
    nombre: nombre.trim(),
    whatsapp: num,
  }).returning()
  return NextResponse.json(nuevo[0])
}

export async function DELETE(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await db.update(ujieres).set({ activo: false }).where(eq(ujieres.id, id))
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, nombre, whatsapp } = await req.json()
  if (!nombre?.trim() || !whatsapp?.trim()) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  let num = whatsapp.replace(/\D/g, '')
  if (!num.startsWith('57')) num = '57' + num
  await db.update(ujieres)
    .set({ nombre: nombre.trim(), whatsapp: num })
    .where(eq(ujieres.id, id))
  return NextResponse.json({ ok: true })
}