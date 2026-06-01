import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { peticiones } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET() {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const todas = await db.select().from(peticiones).orderBy(desc(peticiones.creadoEn))
  return NextResponse.json(todas)
}

export async function PATCH(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, estado } = await req.json()
  await db.update(peticiones).set({ estado }).where(eq(peticiones.id, id))
  return NextResponse.json({ ok: true })
}

export async function DELETE(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await db.delete(peticiones).where(eq(peticiones.id, id))
  return NextResponse.json({ ok: true })
}