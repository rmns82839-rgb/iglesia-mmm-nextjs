'use client'
import { useEffect, useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { UserButton } from '@clerk/nextjs'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Heart, MessageCircle, Clock, CheckCircle,
  ArrowLeft, User, Send, BookOpen
} from 'lucide-react'
import Link from 'next/link'

type DashboardData = {
  usuario: { nombre: string; email: string; rol: string; creadoEn: string }
  peticiones: Array<{ id: string; peticion: string; estado: string; creadoEn: string; esAnonima: boolean }>
  comentarios: Array<{ id: string; contenido: string; creadoEn: string }>
  stats: { totalPeticiones: number; peticionesPendientes: number; totalComentarios: number }
}

function EstadoBadge({ estado }: { estado: string }) {
  const map: Record<string, { label: string; className: string }> = {
    pendiente: { label: 'Pendiente', className: 'bg-yellow-100 text-yellow-800 border-yellow-200' },
    orada: { label: 'Orada ✓', className: 'bg-green-100 text-green-800 border-green-200' },
    respondida: { label: 'Respondida', className: 'bg-blue-100 text-blue-800 border-blue-200' },
  }
  const s = map[estado] || map.pendiente
  return (
    <span className={`text-xs font-bold px-2 py-1 rounded-full border ${s.className}`}>
      {s.label}
    </span>
  )
}

export default function DashboardPage() {
  const { user, isLoaded } = useUser()
  const [data, setData] = useState<DashboardData | null>(null)
  const [cargando, setCargando] = useState(true)

  useEffect(() => {
    if (!isLoaded) return
    fetch('/api/usuario')
      .then(r => r.json())
      .then(d => { setData(d); setCargando(false) })
      .catch(() => setCargando(false))
  }, [isLoaded])

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
    })
  }

  if (!isLoaded || cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Heart className="w-10 h-10 text-blue-900 mx-auto mb-3 animate-pulse" />
          <p className="text-gray-500">Cargando tu panel...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-blue-900 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-14 h-14 bg-yellow-400/20 rounded-full flex items-center justify-center text-2xl font-black text-yellow-400">
                {user?.firstName?.charAt(0) || 'U'}
              </div>
              <div>
                <h1 className="text-2xl font-black">
                  Hola, {user?.firstName} 👋
                </h1>
                <p className="text-blue-200 text-sm">{data?.usuario.email}</p>
                <span className="text-xs bg-yellow-400/20 text-yellow-400 font-bold px-2 py-0.5 rounded-full capitalize">
                  {data?.usuario.rol || 'miembro'}
                </span>
              </div>
            </div>
            <UserButton />
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <Card className="p-5 text-center">
            <Heart className="w-8 h-8 text-red-400 mx-auto mb-2" />
            <p className="text-3xl font-black text-gray-900">{data?.stats.totalPeticiones || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Peticiones enviadas</p>
          </Card>
          <Card className="p-5 text-center">
            <Clock className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-gray-900">{data?.stats.peticionesPendientes || 0}</p>
            <p className="text-sm text-gray-500 mt-1">En oración</p>
          </Card>
          <Card className="p-5 text-center col-span-2 md:col-span-1">
            <MessageCircle className="w-8 h-8 text-blue-500 mx-auto mb-2" />
            <p className="text-3xl font-black text-gray-900">{data?.stats.totalComentarios || 0}</p>
            <p className="text-sm text-gray-500 mt-1">Mensajes en el foro</p>
          </Card>
        </div>

        {/* Accesos rápidos */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Accesos rápidos</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <Link href="/peticiones">
              <Card className="p-4 text-center hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group">
                <Send className="w-6 h-6 text-blue-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-gray-700">Nueva petición</p>
              </Card>
            </Link>
            <Link href="/foro">
              <Card className="p-4 text-center hover:border-green-300 hover:bg-green-50 transition cursor-pointer group">
                <MessageCircle className="w-6 h-6 text-green-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-gray-700">Ir al foro</p>
              </Card>
            </Link>
            <Link href="/#servicios">
              <Card className="p-4 text-center hover:border-yellow-300 hover:bg-yellow-50 transition cursor-pointer group">
                <Clock className="w-6 h-6 text-yellow-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-gray-700">Horarios</p>
              </Card>
            </Link>
            <Link href="/#ministerios">
              <Card className="p-4 text-center hover:border-purple-300 hover:bg-purple-50 transition cursor-pointer group">
                <BookOpen className="w-6 h-6 text-purple-600 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-bold text-gray-700">Ministerios</p>
              </Card>
            </Link>
          </div>
        </div>

        {/* Mis peticiones */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-black text-gray-900">Mis peticiones de oración</h2>
            <Link href="/peticiones">
              <Button size="sm" variant="outline" className="gap-1">
                <Send className="w-3 h-3" /> Nueva
              </Button>
            </Link>
          </div>
          {!data?.peticiones.length ? (
            <Card className="p-8 text-center text-gray-400">
              <Heart className="w-8 h-8 mx-auto mb-3" />
              <p>Aún no has enviado peticiones</p>
              <Link href="/peticiones">
                <Button className="mt-4 bg-blue-900 hover:bg-blue-800" size="sm">
                  Enviar mi primera petición
                </Button>
              </Link>
            </Card>
          ) : (
            <div className="space-y-3">
              {data.peticiones.map(p => (
                <Card key={p.id} className="p-5">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="text-gray-700 text-sm leading-relaxed line-clamp-2">
                        {p.esAnonima ? '🔒 Petición anónima' : p.peticion}
                      </p>
                      <p className="text-xs text-gray-400 mt-2">{formatFecha(p.creadoEn)}</p>
                    </div>
                    <EstadoBadge estado={p.estado} />
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Mis comentarios en el foro */}
        {data?.comentarios && data.comentarios.length > 0 && (
          <div>
            <h2 className="text-lg font-black text-gray-900 mb-4">Mis mensajes en el foro</h2>
            <div className="space-y-3">
              {data.comentarios.map(c => (
                <Card key={c.id} className="p-4">
                  <p className="text-gray-700 text-sm line-clamp-2">{c.contenido}</p>
                  <p className="text-xs text-gray-400 mt-2">{formatFecha(c.creadoEn)}</p>
                </Card>
              ))}
            </div>
          </div>
        )}

        {/* Miembro desde */}
        <Card className="p-5 bg-blue-50 border-blue-100">
          <div className="flex items-center gap-3">
            <User className="w-6 h-6 text-blue-600" />
            <div>
              <p className="font-bold text-gray-900 text-sm">Miembro de la comunidad digital</p>
              <p className="text-xs text-gray-500">
                Registrado el {data?.usuario.creadoEn ? formatFecha(data.usuario.creadoEn) : '—'}
              </p>
            </div>
            <CheckCircle className="w-5 h-5 text-green-500 ml-auto" />
          </div>
        </Card>

      </div>
    </div>
  )
}