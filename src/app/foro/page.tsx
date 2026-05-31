'use client'
import { useState, useEffect, useRef } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, ArrowLeft, Send, Trash2, MessageCircle } from 'lucide-react'
import Link from 'next/link'

type Comentario = {
  id: string
  nombreUsuario: string
  contenido: string
  creadoEn: string
  usuarioId: string | null
}

function procesarTexto(texto: string) {
  return texto.replace(/@(\w+)/g, '<span class="text-blue-600 font-bold bg-blue-50 px-1 rounded">@$1</span>')
}

export default function ForoPage() {
  const { user, isSignedIn } = useUser()
  const [comentarios, setComentarios] = useState<Comentario[]>([])
  const [nombre, setNombre] = useState('')
  const [mensaje, setMensaje] = useState('')
  const [cargando, setCargando] = useState(true)
  const [enviando, setEnviando] = useState(false)
  const [ultimoEnvio, setUltimoEnvio] = useState(0)
  const contenedorRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (user?.firstName) setNombre(user.firstName)
  }, [user])

  async function cargarComentarios() {
    try {
      const res = await fetch('/api/foro')
      const data = await res.json()
      setComentarios(Array.isArray(data) ? data : [])
    } catch {
      setComentarios([])
    } finally {
      setCargando(false)
    }
  }

  useEffect(() => {
    cargarComentarios()
    const interval = setInterval(cargarComentarios, 30000)
    return () => clearInterval(interval)
  }, [])

  async function handleEnviar(e: React.FormEvent) {
    e.preventDefault()
    if (!mensaje.trim() || !nombre.trim()) return

    const ahora = Date.now()
    if (ahora - ultimoEnvio < 15000) {
      alert(`Espera ${Math.ceil((15000 - (ahora - ultimoEnvio)) / 1000)} segundos antes de publicar de nuevo.`)
      return
    }

    setEnviando(true)
    try {
      const res = await fetch('/api/foro', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contenido: mensaje, nombreUsuario: nombre }),
      })
      if (res.ok) {
        setMensaje('')
        setUltimoEnvio(Date.now())
        await cargarComentarios()
        contenedorRef.current?.scrollTo({ top: 0, behavior: 'smooth' })
      }
    } finally {
      setEnviando(false)
    }
  }

  async function handleEliminar(id: string) {
    if (!confirm('¿Borrar mensaje?')) return
    await fetch('/api/foro', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await cargarComentarios()
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-CO', {
      month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-6">
        <div className="max-w-3xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-yellow-400/20 rounded-full flex items-center justify-center">
              <MessageCircle className="w-5 h-5 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Foro de la comunidad</h1>
              <p className="text-blue-200 text-sm">Comparte bendiciones y menciona a alguien con @</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

        {/* Formulario */}
        <Card className="p-6">
          <form onSubmit={handleEnviar} className="space-y-4">
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Tu nombre..."
              maxLength={40}
              required
              className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none font-medium"
            />
            <div className="relative">
              <textarea
                value={mensaje}
                onChange={e => setMensaje(e.target.value)}
                placeholder="Escribe una bendición o menciona a alguien con @..."
                rows={3}
                maxLength={300}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none font-medium resize-none"
              />
              <span className="absolute bottom-3 right-3 text-xs text-gray-400">
                {mensaje.length} / 300
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-xs text-gray-400 italic">Usa @ para mencionar personas</span>
              <Button
                type="submit"
                disabled={enviando || !mensaje.trim() || !nombre.trim()}
                className="bg-blue-900 hover:bg-blue-800 gap-2"
              >
                <Send className="w-4 h-4" />
                {enviando ? 'Publicando...' : 'Publicar'}
              </Button>
            </div>
          </form>
        </Card>

        {/* Lista de comentarios */}
        <div ref={contenedorRef} className="space-y-4">
          {cargando ? (
            <div className="text-center py-12 text-gray-400">
              <MessageCircle className="w-8 h-8 mx-auto mb-3 animate-pulse" />
              <p>Cargando mensajes...</p>
            </div>
          ) : comentarios.length === 0 ? (
            <div className="text-center py-12 text-gray-400">
              <Heart className="w-8 h-8 mx-auto mb-3" />
              <p>Sé el primero en compartir una bendición</p>
            </div>
          ) : (
            comentarios.map(c => (
              <Card key={c.id} className="p-5">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-full bg-blue-900 flex items-center justify-center text-white font-black flex-shrink-0">
                    {c.nombreUsuario.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="font-black text-gray-900 text-sm">{c.nombreUsuario}</span>
                      <span className="text-xs text-gray-400 flex-shrink-0">{formatFecha(c.creadoEn)}</span>
                    </div>
                    <p
                      className="text-gray-700 text-sm leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: procesarTexto(c.contenido) }}
                    />
                    {isSignedIn && (
                      <button
                        onClick={() => handleEliminar(c.id)}
                        className="mt-2 text-xs text-red-400 hover:text-red-600 flex items-center gap-1 transition"
                      >
                        <Trash2 className="w-3 h-3" /> Borrar
                      </button>
                    )}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  )
}