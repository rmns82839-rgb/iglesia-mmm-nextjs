'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Heart, MessageCircle, Users, Clock, CheckCircle,
  ArrowLeft, Shield, AlertCircle, TrendingUp
} from 'lucide-react'
import Link from 'next/link'

type Stats = {
  peticionesTotal: number
  peticionesPendientes: number
  peticionesOradas: number
  comentariosTotal: number
  usuariosTotal: number
  miembrosTotal: number
}

export default function AdminPage() {
  const [stats, setStats] = useState<Stats | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    fetch('/api/admin')
      .then(r => {
        if (r.status === 403) { setError(true); return null }
        return r.json()
      })
      .then(d => { if (d) setStats(d.stats); setCargando(false) })
      .catch(() => { setError(true); setCargando(false) })
  }, [])

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Shield className="w-10 h-10 text-blue-900 animate-pulse" />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-black text-gray-900 mb-2">Acceso restringido</h2>
          <p className="text-gray-600 mb-6">Solo los administradores pueden acceder a este panel.</p>
          <Link href="/dashboard">
            <Button className="bg-blue-900 hover:bg-blue-800">Volver a mi panel</Button>
          </Link>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">

      {/* Header */}
      <div className="bg-gray-900 text-white px-4 py-6">
        <div className="max-w-6xl mx-auto">
          <Link href="/" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al inicio
          </Link>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-yellow-400/20 rounded-xl flex items-center justify-center">
              <Shield className="w-6 h-6 text-yellow-400" />
            </div>
            <div>
              <h1 className="text-2xl font-black">Panel de Administración</h1>
              <p className="text-gray-400 text-sm">Iglesia MMM Suba Rincón</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          <Card className="p-4 text-center">
            <Heart className="w-6 h-6 text-red-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{stats?.peticionesTotal || 0}</p>
            <p className="text-xs text-gray-500">Peticiones</p>
          </Card>
          <Card className="p-4 text-center border-yellow-200 bg-yellow-50">
            <Clock className="w-6 h-6 text-yellow-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-yellow-700">{stats?.peticionesPendientes || 0}</p>
            <p className="text-xs text-gray-500">Pendientes</p>
          </Card>
          <Card className="p-4 text-center border-green-200 bg-green-50">
            <CheckCircle className="w-6 h-6 text-green-500 mx-auto mb-2" />
            <p className="text-2xl font-black text-green-700">{stats?.peticionesOradas || 0}</p>
            <p className="text-xs text-gray-500">Oradas</p>
          </Card>
          <Card className="p-4 text-center">
            <MessageCircle className="w-6 h-6 text-blue-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{stats?.comentariosTotal || 0}</p>
            <p className="text-xs text-gray-500">Foro</p>
          </Card>
          <Card className="p-4 text-center">
            <Users className="w-6 h-6 text-purple-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{stats?.usuariosTotal || 0}</p>
            <p className="text-xs text-gray-500">Usuarios</p>
          </Card>
          <Card className="p-4 text-center">
            <TrendingUp className="w-6 h-6 text-teal-400 mx-auto mb-2" />
            <p className="text-2xl font-black">{stats?.miembrosTotal || 0}</p>
            <p className="text-xs text-gray-500">Miembros</p>
          </Card>
        </div>

        {/* Secciones de gestión */}
        <div>
          <h2 className="text-lg font-black text-gray-900 mb-4">Gestión</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <Link href="/admin/peticiones">
              <Card className="p-6 hover:border-blue-300 hover:bg-blue-50 transition cursor-pointer group">
                <div className="flex items-center justify-between mb-3">
                  <Heart className="w-8 h-8 text-red-500 group-hover:scale-110 transition-transform" />
                  {stats && stats.peticionesPendientes > 0 && (
                    <span className="bg-yellow-400 text-yellow-900 text-xs font-black px-2 py-1 rounded-full">
                      {stats.peticionesPendientes} nuevas
                    </span>
                  )}
                </div>
                <h3 className="font-black text-gray-900">Peticiones de oración</h3>
                <p className="text-sm text-gray-500 mt-1">Ver y gestionar todas las peticiones</p>
              </Card>
            </Link>

            <Link href="/admin/foro">
              <Card className="p-6 hover:border-green-300 hover:bg-green-50 transition cursor-pointer group">
                <MessageCircle className="w-8 h-8 text-green-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-gray-900">Moderar foro</h3>
                <p className="text-sm text-gray-500 mt-1">Revisar y eliminar mensajes</p>
              </Card>
            </Link>

            <Link href="/admin/miembros">
              <Card className="p-6 hover:border-purple-300 hover:bg-purple-50 transition cursor-pointer group">
                <Users className="w-8 h-8 text-purple-500 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="font-black text-gray-900">Miembros</h3>
                <p className="text-sm text-gray-500 mt-1">Gestionar usuarios y roles</p>
              </Card>
            </Link>
          </div>
        </div>

      </div>
    </div>
  )
}