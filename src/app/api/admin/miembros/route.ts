import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { usuarios } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET() {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const todos = await db.select().from(usuarios).orderBy(desc(usuarios.creadoEn))
  return NextResponse.json(todos)
}

export async function PATCH(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, rol } = await req.json()
  await db.update(usuarios).set({ rol }).where(eq(usuarios.id, id))
  return NextResponse.json({ ok: true })
}