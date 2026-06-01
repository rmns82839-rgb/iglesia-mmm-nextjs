'use client'
import { useEffect, useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Users, ArrowLeft, Plus, Trash2, Calendar,
  UserPlus, Phone, Check, Pencil, X
} from 'lucide-react'
import Link from 'next/link'

type Ujier = { id: string; nombre: string; whatsapp: string }
type Programacion = {
  id: string
  fecha: string
  diaSemana: string
  tipoServicio: string
  ujierIds: string
  notas: string | null
}

const DIAS = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado']

export default function AdminUjieresPage() {
  const [ujieres, setUjieres] = useState<Ujier[]>([])
  const [programacion, setProgramacion] = useState<Programacion[]>([])
  const [cargando, setCargando] = useState(true)

  // Form nuevo ujier
  const [nuevoNombre, setNuevoNombre] = useState('')
  const [nuevoWhatsapp, setNuevoWhatsapp] = useState('')
  // Edición de ujier
  const [editandoId, setEditandoId] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [editWhatsapp, setEditWhatsapp] = useState('')

  // Form nueva programación
  const [fecha, setFecha] = useState('')
  const [tipoServicio, setTipoServicio] = useState('Culto de alabanza')
  const [seleccionados, setSeleccionados] = useState<string[]>([])
  const [editandoProgId, setEditandoProgId] = useState<string | null>(null)

  async function cargar() {
    try {
      const resU = await fetch('/api/ujieres')
      const dataU = await resU.json()
      setUjieres(Array.isArray(dataU) ? dataU : [])
    } catch (e) {
      console.error('Error cargando ujieres', e)
    }
    try {
      const resP = await fetch('/api/programacion')
      const dataP = await resP.json()
      setProgramacion(Array.isArray(dataP) ? dataP : [])
    } catch (e) {
      console.error('Error cargando programación', e)
    }
    setCargando(false)
  }

  useEffect(() => { cargar() }, [])

  async function agregarUjier() {
    if (!nuevoNombre.trim() || !nuevoWhatsapp.trim()) return
    await fetch('/api/ujieres', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nombre: nuevoNombre, whatsapp: nuevoWhatsapp }),
    })
    setNuevoNombre('')
    setNuevoWhatsapp('')
    await cargar()
  }

  async function eliminarUjier(id: string) {
    if (!confirm('¿Quitar este ujier?')) return
    await fetch('/api/ujieres', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await cargar()
  }

  function iniciarEdicion(u: Ujier) {
    setEditandoId(u.id)
    setEditNombre(u.nombre)
    setEditWhatsapp(u.whatsapp)
  }

  async function guardarEdicion() {
    if (!editNombre.trim() || !editWhatsapp.trim()) return
    await fetch('/api/ujieres', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: editandoId, nombre: editNombre, whatsapp: editWhatsapp }),
    })
    setEditandoId(null)
    await cargar()
  }

  function toggleSeleccion(id: string) {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }

  // Auto-selecciona el tipo de servicio según el día de la fecha elegida
  useEffect(() => {
    if (!fecha) return
    const d = new Date(fecha + 'T00:00:00').getDay()
    const tipoPorDia: Record<number, string> = {
      0: 'Escuela dominical',  // Domingo
      2: 'Culto de oración',    // Martes
      4: 'Enseñanza bíblica',   // Jueves
      6: 'Culto de alabanza',   // Sábado
    }
    if (tipoPorDia[d]) setTipoServicio(tipoPorDia[d])
  }, [fecha])

  async function crearProgramacion() {
    if (!fecha || seleccionados.length === 0) {
      alert('Selecciona una fecha y al menos un ujier')
      return
    }
    const d = new Date(fecha + 'T00:00:00')
    const diaSemana = DIAS[d.getDay()]

    if (editandoProgId) {
      // Editar existente
      await fetch('/api/programacion', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: editandoProgId, fecha, diaSemana, tipoServicio, ujierIds: seleccionados }),
      })
    } else {
      // Crear nuevo
      await fetch('/api/programacion', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fecha, diaSemana, tipoServicio, ujierIds: seleccionados }),
      })
    }
    setFecha('')
    setSeleccionados([])
    setEditandoProgId(null)
    await cargar()
  }

  function iniciarEdicionProg(p: Programacion) {
    setEditandoProgId(p.id)
    setFecha(p.fecha)
    setTipoServicio(p.tipoServicio)
    setSeleccionados(p.ujierIds.split(','))
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  async function eliminarProgramacion(id: string) {
    if (!confirm('¿Eliminar esta asignación?')) return
    await fetch('/api/programacion', {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id }),
    })
    await cargar()
  }

  function nombresUjieres(ids: string) {
    return ids.split(',').map(id => ujieres.find(u => u.id === id)?.nombre || '?').join(', ')
  }

  function formatFecha(fecha: string) {
    return new Date(fecha + 'T00:00:00').toLocaleDateString('es-CO', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-900 text-white px-4 py-6">
        <div className="max-w-5xl mx-auto">
          <Link href="/admin" className="flex items-center gap-2 text-gray-400 hover:text-white mb-4 transition text-sm">
            <ArrowLeft className="w-4 h-4" /> Volver al panel
          </Link>
          <div className="flex items-center gap-3">
            <Calendar className="w-8 h-8 text-amber-400" />
            <div>
              <h1 className="text-2xl font-black">Programación de Ujieres</h1>
              <p className="text-gray-400 text-sm">{ujieres.length} ujieres · {programacion.length} servicios programados</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">

        {/* Columna izquierda: gestión */}
        <div className="space-y-8">

          {/* Agregar ujier */}
          <Card className="p-6">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" /> Agregar ujier
            </h2>
            <div className="space-y-3">
              <input
                value={nuevoNombre}
                onChange={e => setNuevoNombre(e.target.value)}
                placeholder="Nombre completo"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none"
              />
              <input
                value={nuevoWhatsapp}
                onChange={e => setNuevoWhatsapp(e.target.value)}
                placeholder="WhatsApp (ej: 3201234567)"
                className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none"
              />
              <Button onClick={agregarUjier} className="w-full bg-blue-900 hover:bg-blue-800 gap-2">
                <Plus className="w-4 h-4" /> Agregar
              </Button>
            </div>
          </Card>

          {/* Lista de ujieres */}
          <Card className="p-6">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" /> Ujieres ({ujieres.length})
            </h2>
            <div className="space-y-2">
              {ujieres.map(u => (
                editandoId === u.id ? (
                  <div key={u.id} className="p-3 bg-blue-50 rounded-xl border-2 border-blue-200 space-y-2">
                    <input
                      value={editNombre}
                      onChange={e => setEditNombre(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm"
                      placeholder="Nombre"
                    />
                    <input
                      value={editWhatsapp}
                      onChange={e => setEditWhatsapp(e.target.value)}
                      className="w-full px-3 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-900 focus:outline-none text-sm"
                      placeholder="WhatsApp"
                    />
                    <div className="flex gap-2">
                      <Button onClick={guardarEdicion} size="sm" className="flex-1 bg-green-600 hover:bg-green-700 gap-1 h-8 text-xs">
                        <Check className="w-3 h-3" /> Guardar
                      </Button>
                      <Button onClick={() => setEditandoId(null)} size="sm" variant="outline" className="flex-1 gap-1 h-8 text-xs">
                        <X className="w-3 h-3" /> Cancelar
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div key={u.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-full bg-blue-900 flex items-center justify-center text-white font-black text-sm flex-shrink-0">
                        {u.nombre.charAt(0)}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm truncate">{u.nombre}</p>
                        <p className="text-gray-400 text-xs flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {u.whatsapp}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 flex-shrink-0">
                      <button onClick={() => iniciarEdicion(u)} className="text-blue-400 hover:text-blue-600 p-1">
                        <Pencil className="w-4 h-4" />
                      </button>
                      <button onClick={() => eliminarUjier(u.id)} className="text-red-400 hover:text-red-600 p-1">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </Card>
        </div>

        {/* Columna derecha: programar */}
        <div className="space-y-8">

          {/* Crear programación */}
          <Card className="p-6">
            <h2 className="font-black text-gray-900 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-amber-600" /> Programar servicio
            </h2>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-black text-gray-600 uppercase">Fecha</label>
                <input
                  type="date"
                  value={fecha}
                  onChange={e => setFecha(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none mt-1"
                />
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase">Tipo de servicio</label>
                <select
                  value={tipoServicio}
                  onChange={e => setTipoServicio(e.target.value)}
                  className="w-full px-4 py-2.5 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none mt-1"
                >
                  <option>Culto de oración</option>
                  <option>Enseñanza bíblica</option>
                  <option>Culto de alabanza</option>
                  <option>Escuela dominical</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-gray-600 uppercase mb-2 block">
                  Ujieres asignados ({seleccionados.length})
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {ujieres.map(u => (
                    <button
                      key={u.id}
                      onClick={() => toggleSeleccion(u.id)}
                      className={`flex items-center gap-2 p-2.5 rounded-xl border-2 text-sm font-bold transition text-left
                        ${seleccionados.includes(u.id)
                          ? 'border-blue-900 bg-blue-50 text-blue-900'
                          : 'border-gray-200 text-gray-600 hover:border-gray-300'}`}
                    >
                      <div className={`w-4 h-4 rounded border-2 flex items-center justify-center flex-shrink-0
                        ${seleccionados.includes(u.id) ? 'bg-blue-900 border-blue-900' : 'border-gray-300'}`}>
                        {seleccionados.includes(u.id) && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="truncate">{u.nombre}</span>
                    </button>
                  ))}
                </div>
              </div>
              <Button onClick={crearProgramacion} className="w-full bg-amber-500 hover:bg-amber-600 gap-2">
                {editandoProgId ? (
                  <><Check className="w-4 h-4" /> Guardar cambios</>
                ) : (
                  <><Plus className="w-4 h-4" /> Programar servicio</>
                )}
              </Button>
              {editandoProgId && (
                <Button onClick={() => { setEditandoProgId(null); setFecha(''); setSeleccionados([]) }} variant="outline" className="w-full gap-2 mt-2">
                  <X className="w-4 h-4" /> Cancelar edición
                </Button>
              )}
            </div>
          </Card>

          {/* Servicios programados */}
          <Card className="p-6">
            <h2 className="font-black text-gray-900 mb-4">Servicios programados</h2>
            {programacion.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-4">Aún no hay servicios programados</p>
            ) : (
              <div className="space-y-2">
                {programacion.map(p => (
                  <div key={p.id} className="p-3 bg-gray-50 rounded-xl">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0">
                        <p className="font-bold text-gray-900 text-sm capitalize">{formatFecha(p.fecha)}</p>
                        <p className="text-xs text-amber-600 font-bold">{p.tipoServicio}</p>
                        <p className="text-xs text-gray-500 mt-1">{nombresUjieres(p.ujierIds)}</p>
                      </div>
                      <div className="flex items-center gap-1 flex-shrink-0">
                        <button onClick={() => iniciarEdicionProg(p)} className="text-blue-400 hover:text-blue-600 p-1">
                          <Pencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => eliminarProgramacion(p.id)} className="text-red-400 hover:text-red-600 p-1">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </Card>
        </div>
      </div>
    </div>
  )
}