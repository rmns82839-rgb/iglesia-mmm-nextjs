'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Heart, Clock, CheckCircle, Trash2, ArrowLeft,
  Lock, User, Filter
} from 'lucide-react'
import Link from 'next/link'

type Peticion = {
  id: string
  nombreSolicitante: string
  peticion: string
  estado: string
  esAnonima: boolean
  creadoEn: string
}

export default function AdminPeticionesPage() {
  const [peticiones, setPeticiones] = useState<Peticion[]>([])
  const [cargando, setCargando] = useState(true)
  const [filtro, setFiltro] = useState<string>('todas')

  async function cargar() {
    const res = await fetch('/api/admin/peticiones')
    if (res.ok) {
      const data = await res.json()
      setPeticiones(Array.isArray(data) ? data : [])
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  async function cambiarEstado(id: string, estado: string) {
    await fetch('/api/admin/peticiones', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, estado }),
    })
    await cargar()
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta petición?')) return
    await fetch('/api/admin/peticiones', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await cargar()
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-CO', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  const filtradas = filtro === 'todas'
    ? peticiones
    : peticiones.filter(p => p.estado === filtro)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>
          <div className="flex items-center gap-3">
            <Heart className="w-8 h-8 text-red-400" />
            <div>
              <h1 className="text-2xl font-black">Peticiones de oración</h1>
              <p className="text-gray-400 text-sm">{peticiones.length} peticiones en total</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">

        {/* Filtros */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          <Filter className="w-4 h-4 text-gray-400" />
          {['todas', 'pendiente', 'orada', 'respondida'].map(f => (
            <button
              key={f}
              onClick={() => setFiltro(f)}
              className={`text-sm font-bold px-4 py-2 rounded-full capitalize transition
                ${filtro === f ? 'bg-blue-900 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}
            >
              {f}
            </button>
          ))}
        </div>

        {cargando ? (
          <div className="text-center py-12 text-gray-400">
            <Heart className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <p>Cargando peticiones...</p>
          </div>
        ) : filtradas.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            <Heart className="w-8 h-8 mx-auto mb-3" />
            <p>No hay peticiones {filtro !== 'todas' ? `con estado "${filtro}"` : ''}</p>
          </Card>
        ) : (
          <div className="space-y-4">
            {filtradas.map(p => (
              <Card key={p.id} className="p-5">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white flex-shrink-0">
                    {p.esAnonima ? <Lock className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm">
                        {p.esAnonima ? 'Anónimo' : p.nombreSolicitante}
                      </span>
                      <span className="text-xs text-gray-400">{formatFecha(p.creadoEn)}</span>
                    </div>
                    <p className="text-gray-700 text-sm leading-relaxed mb-3">{p.peticion}</p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Button
                        size="sm"
                        variant={p.estado === 'pendiente' ? 'default' : 'outline'}
                        onClick={() => cambiarEstado(p.id, 'pendiente')}
                        className={p.estado === 'pendiente' ? 'bg-yellow-500 hover:bg-yellow-600 h-8 text-xs' : 'h-8 text-xs'}
                      >
                        <Clock className="w-3 h-3 mr-1" /> Pendiente
                      </Button>
                      <Button
                        size="sm"
                        variant={p.estado === 'orada' ? 'default' : 'outline'}
                        onClick={() => cambiarEstado(p.id, 'orada')}
                        className={p.estado === 'orada' ? 'bg-green-600 hover:bg-green-700 h-8 text-xs' : 'h-8 text-xs'}
                      >
                        <CheckCircle className="w-3 h-3 mr-1" /> Orada
                      </Button>
                      <button
                        onClick={() => eliminar(p.id)}
                        className="ml-auto text-red-400 hover:text-red-600 transition p-2"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}