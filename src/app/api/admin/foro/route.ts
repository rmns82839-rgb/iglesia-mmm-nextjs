import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { comentariosForo } from '@/db/schema'
import { eq, desc } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET() {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const comentarios = await db.select().from(comentariosForo)
    .orderBy(desc(comentariosForo.creadoEn))
  return NextResponse.json(comentarios)
}

export async function DELETE(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await db.delete(comentariosForo).where(eq(comentariosForo.id, id))
  return NextResponse.json({ ok: true })
}