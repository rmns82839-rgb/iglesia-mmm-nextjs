'use client'
import { useEffect, useState, useRef } from 'react'
import { toPng } from 'html-to-image'
import { Button } from '@/components/ui/button'
import {
  Calendar, ArrowLeft, Download, MessageCircle,
  ChevronLeft, ChevronRight, Users
} from 'lucide-react'
import Link from 'next/link'

type Ujier = { id: string; nombre: string; whatsapp: string }
type Programacion = {
  id: string
  fecha: string
  diaSemana: string
  tipoServicio: string
  ujierIds: string
}

const MESES = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

// Color por tipo de servicio
function colorServicio(tipo: string) {
  if (tipo.includes('oración')) return 'bg-blue-100 border-blue-300 text-blue-900'
  if (tipo.includes('Enseñanza')) return 'bg-purple-100 border-purple-300 text-purple-900'
  if (tipo.includes('alabanza')) return 'bg-amber-100 border-amber-300 text-amber-900'
  if (tipo.includes('dominical')) return 'bg-green-100 border-green-300 text-green-900'
  return 'bg-gray-100 border-gray-300 text-gray-900'
}

export default function UjieresPublicoPage() {
  const [ujieres, setUjieres] = useState<Ujier[]>([])
  const [programacion, setProgramacion] = useState<Programacion[]>([])
  const [cargando, setCargando] = useState(true)
  const [mesActual, setMesActual] = useState(() => {
    const hoy = new Date()
    return { anio: hoy.getFullYear(), mes: hoy.getMonth() }
  })
  const calendarioRef = useRef<HTMLDivElement>(null)

  async function cargar() {
    try {
      const [resU, resP] = await Promise.all([
        fetch('/api/ujieres'),
        fetch('/api/programacion'),
      ])
      setUjieres(await resU.json())
      setProgramacion(await resP.json())
    } catch (e) {
      console.error(e)
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  function nombresUjieres(ids: string) {
    return ids.split(',').map(id => ujieres.find(u => u.id === id)?.nombre || '?')
  }

  // Filtra programación del mes actual
  const programacionMes = programacion.filter(p => {
    const d = new Date(p.fecha + 'T00:00:00')
    return d.getFullYear() === mesActual.anio && d.getMonth() === mesActual.mes
  }).sort((a, b) => a.fecha.localeCompare(b.fecha))

  function cambiarMes(delta: number) {
    setMesActual(prev => {
      let nuevoMes = prev.mes + delta
      let nuevoAnio = prev.anio
      if (nuevoMes > 11) { nuevoMes = 0; nuevoAnio++ }
      if (nuevoMes < 0) { nuevoMes = 11; nuevoAnio-- }
      return { anio: nuevoAnio, mes: nuevoMes }
    })
  }

  async function descargarImagen() {
    if (!calendarioRef.current) return
    try {
      const dataUrl = await toPng(calendarioRef.current, {
        quality: 1,
        pixelRatio: 2,
        backgroundColor: '#ffffff',
      })
      const link = document.createElement('a')
      link.download = `ujieres-${MESES[mesActual.mes]}-${mesActual.anio}.png`
      link.href = dataUrl
      link.click()
    } catch (e) {
      alert('Error al generar la imagen')
    }
  }

  function notificarWhatsapp(p: Programacion) {
    const fecha = new Date(p.fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
    const ids = p.ujierIds.split(',')
    ids.forEach(id => {
      const ujier = ujieres.find(u => u.id === id)
      if (!ujier) return
      const mensaje = encodeURIComponent(
        `¡Bendiciones ${ujier.nombre}! 🙏\n\nTe recordamos tu servicio de ujier:\n📅 ${fecha}\n⛪ ${p.tipoServicio}\n\n"Servid a Jehová con alegría" — Salmo 100:2`
      )
      window.open(`https://wa.me/${ujier.whatsapp}?text=${mensaje}`, '_blank')
    })
  }

  function formatFecha(fecha: string) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric'
    })
  }

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Calendar className="w-10 h-10 text-amber-500 animate-pulse" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-800 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-amber-400/20 rounded-xl flex items-center justify-center">
              <Users className="w-6 h-6 text-amber-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Servicio de Ujieres</h1>
              <p className="text-blue-200 text-sm">Programación de servicios mensuales</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Controles */}
        <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
          <div className="flex items-center gap-2">
            <Button onClick={() => cambiarMes(-1)} size="sm" variant="outline" className="gap-1">
              <ChevronLeft className="w-4 h-4" />
            </Button>
            <span className="font-black text-lg text-gray-900 min-w-[160px] text-center">
              {MESES[mesActual.mes]} {mesActual.anio}
            </span>
            <Button onClick={() => cambiarMes(1)} size="sm" variant="outline" className="gap-1">
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
          <Button onClick={descargarImagen} className="bg-green-600 hover:bg-green-700 gap-2">
            <Download className="w-4 h-4" /> Descargar imagen
          </Button>
        </div>

        {/* Calendario (esto es lo que se descarga) */}
        <div ref={calendarioRef} className="bg-white rounded-3xl p-8 shadow-lg">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-black text-gray-900 uppercase tracking-tight">Servicio de Ujieres</h2>
            <p className="text-amber-600 font-black text-lg mt-1">{MESES[mesActual.mes]} {mesActual.anio}</p>
            <p className="text-gray-400 text-sm italic mt-2">"Servid a Jehová con alegría" — Salmo 100:2</p>
          </div>

          {programacionMes.length === 0 ? (
            <p className="text-gray-400 text-center py-12">No hay servicios programados para este mes</p>
          ) : (
            <div className="grid sm:grid-cols-2 gap-4">
              {programacionMes.map(p => (
                <div key={p.id} className={`rounded-2xl border-2 p-5 ${colorServicio(p.tipoServicio)}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-black text-2xl">
                      {new Date(p.fecha + 'T00:00:00').getDate()}
                    </span>
                    <span className="text-xs font-black uppercase tracking-wider opacity-70">
                      {p.diaSemana}
                    </span>
                  </div>
                  <p className="font-black text-sm mb-3">{p.tipoServicio}</p>
                  <div className="space-y-1">
                    {nombresUjieres(p.ujierIds).map((nombre, i) => (
                      <p key={i} className="text-sm font-medium">• {nombre}</p>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Líder */}
          <div className="text-center mt-8 pt-6 border-t border-gray-100">
            <p className="text-xs font-black uppercase tracking-widest text-gray-400">Líder de Ujieres</p>
            <p className="font-black text-xl text-gray-900 mt-1">Dina García</p>
          </div>
        </div>

        {/* Lista con botones de notificación */}
        <div className="mt-8">
          <h3 className="font-black text-gray-900 mb-4 flex items-center gap-2">
            <MessageCircle className="w-5 h-5 text-green-600" /> Notificar por WhatsApp
          </h3>
          <div className="space-y-2">
            {programacionMes.map(p => (
              <div key={p.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-gray-100">
                <div className="min-w-0">
                  <p className="font-bold text-gray-900 text-sm capitalize">{formatFecha(p.fecha)} — {p.tipoServicio}</p>
                  <p className="text-xs text-gray-500 mt-0.5">{nombresUjieres(p.ujierIds).join(', ')}</p>
                </div>
                <Button onClick={() => notificarWhatsapp(p)} size="sm" className="bg-green-600 hover:bg-green-700 gap-1 flex-shrink-0">
                  <MessageCircle className="w-4 h-4" /> Avisar
                </Button>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  )
}