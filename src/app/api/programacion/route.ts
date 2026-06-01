import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/db'
import { programacionUjieres } from '@/db/schema'
import { eq, gte, lte, and } from 'drizzle-orm'
import { esAdmin } from '@/lib/auth'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const mes = searchParams.get('mes') // formato: "2026-06"

  let lista
  if (mes) {
    const inicio = `${mes}-01`
    const finMes = new Date(parseInt(mes.split('-')[0]), parseInt(mes.split('-')[1]), 0).getDate()
    const fin = `${mes}-${String(finMes).padStart(2, '0')}`
    lista = await db.select().from(programacionUjieres)
      .where(and(
        gte(programacionUjieres.fecha, inicio),
        lte(programacionUjieres.fecha, fin)
      ))
      .orderBy(programacionUjieres.fecha)
  } else {
    lista = await db.select().from(programacionUjieres)
      .orderBy(programacionUjieres.fecha)
  }
  return NextResponse.json(lista)
}

export async function POST(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { fecha, diaSemana, tipoServicio, ujierIds, notas } = await req.json()
  if (!fecha || !ujierIds?.length) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  const nuevo = await db.insert(programacionUjieres).values({
    fecha,
    diaSemana,
    tipoServicio: tipoServicio || 'Servicio',
    ujierIds: Array.isArray(ujierIds) ? ujierIds.join(',') : ujierIds,
    notas: notas || null,
  }).returning()
  return NextResponse.json(nuevo[0])
}

export async function DELETE(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id } = await req.json()
  await db.delete(programacionUjieres).where(eq(programacionUjieres.id, id))
  return NextResponse.json({ ok: true })
}

export async function PATCH(req: NextRequest) {
  if (!(await esAdmin())) {
    return NextResponse.json({ error: 'No autorizado' }, { status: 403 })
  }
  const { id, fecha, diaSemana, tipoServicio, ujierIds, notas } = await req.json()
  if (!fecha || !ujierIds?.length) {
    return NextResponse.json({ error: 'Datos incompletos' }, { status: 400 })
  }
  await db.update(programacionUjieres)
    .set({
      fecha,
      diaSemana,
      tipoServicio: tipoServicio || 'Servicio',
      ujierIds: Array.isArray(ujierIds) ? ujierIds.join(',') : ujierIds,
      notas: notas || null,
    })
    .where(eq(programacionUjieres.id, id))
  return NextResponse.json({ ok: true })
}