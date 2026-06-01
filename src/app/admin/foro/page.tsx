'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { MessageCircle, Trash2, ArrowLeft } from 'lucide-react'
import Link from 'next/link'

type Comentario = {
  id: string
  nombreUsuario: string
  contenido: string
  creadoEn: string
}

export default function AdminForoPage() {
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    const res = await fetch('/api/foro')
    if (res.ok) {
      const data = await res.json()
      setComentarios(Array.isArray(data) ? data : [])
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar este mensaje?')) return
    await fetch('/api/foro', {
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>
          <div className="flex items-center gap-3">
            <MessageCircle className="w-8 h-8 text-green-400" />
            <div>
              <h1 className="text-2xl font-black">Moderar foro</h1>
              <p className="text-gray-400 text-sm">{comentarios.length} mensajes</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cargando ? (
          <div className="text-center py-12 text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <p>Cargando mensajes...</p>
          </div>
        ) : comentarios.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            <MessageCircle className="w-8 h-8 mx-auto mb-3" />
            <p>No hay mensajes en el foro</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {comentarios.map(c => (
              <Card key={c.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-black flex-shrink-0">
                    {c.nombreUsuario.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm">{c.nombreUsuario}</span>
                      <span className="text-xs text-gray-400">{formatFecha(c.creadoEn)}</span>
                    </div>
                    <p className="text-gray-700 text-sm">{c.contenido}</p>
                  </div>
                  <button
                    onClick={() => eliminar(c.id)}
                    className="text-red-400 hover:text-red-600 transition p-2 flex-shrink-0"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}