'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Users, ArrowLeft, Shield, User } from 'lucide-react'
import Link from 'next/link'

type Usuario = {
  id: string
  nombre: string | null
  email: string
  rol: string
  creadoEn: string
}

export default function AdminMiembrosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [cargando, setCargando] = useState(true)

  async function cargar() {
    const res = await fetch('/api/admin/miembros')
    if (res.ok) {
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  async function cambiarRol(id: string, rol: string) {
    await fetch('/api/admin/miembros', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, rol }),
    })
    await cargar()
  }

  function formatFecha(fecha: string) {
    return new Date(fecha).toLocaleDateString('es-CO', {
      year: 'numeric', month: 'short', day: 'numeric'
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
            <Users className="w-8 h-8 text-purple-400" />
            <div>
              <h1 className="text-2xl font-black">Miembros</h1>
              <p className="text-gray-400 text-sm">{usuarios.length} usuarios registrados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {cargando ? (
          <div className="text-center py-12 text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-3 animate-pulse" />
            <p>Cargando usuarios...</p>
          </div>
        ) : usuarios.length === 0 ? (
          <Card className="p-8 text-center text-gray-400">
            <Users className="w-8 h-8 mx-auto mb-3" />
            <p>No hay usuarios registrados</p>
          </Card>
        ) : (
          <div className="space-y-3">
            {usuarios.map(u => (
              <Card key={u.id} className="p-5">
                <div className="flex items-center gap-4">
                  <div className={`w-11 h-11 rounded-full flex items-center justify-center text-white font-black flex-shrink-0
                    ${u.rol === 'admin' ? 'bg-yellow-500' : 'bg-blue-900'}`}>
                    {u.rol === 'admin' ? <Shield className="w-5 h-5" /> : <User className="w-5 h-5" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-black text-gray-900 text-sm">{u.nombre || 'Sin nombre'}</p>
                    <p className="text-gray-500 text-xs truncate">{u.email}</p>
                    <p className="text-gray-400 text-xs mt-0.5">Registrado el {formatFecha(u.creadoEn)}</p>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full capitalize
                      ${u.rol === 'admin' ? 'bg-yellow-100 text-yellow-800' : 'bg-gray-100 text-gray-600'}`}>
                      {u.rol}
                    </span>
                    {u.rol === 'admin' ? (
                      <Button size="sm" variant="outline" className="h-8 text-xs"
                        onClick={() => cambiarRol(u.id, 'miembro')}>
                        Quitar admin
                      </Button>
                    ) : (
                      <Button size="sm" className="h-8 text-xs bg-yellow-500 hover:bg-yellow-600"
                        onClick={() => cambiarRol(u.id, 'admin')}>
                        Hacer admin
                      </Button>
                    )}
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