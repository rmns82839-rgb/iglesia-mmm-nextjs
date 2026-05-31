'use client'
import { useState } from 'react'
import { useUser } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Heart, ArrowLeft, Lock } from 'lucide-react'
import Link from 'next/link'

export default function PeticionesPage() {
  const { user } = useUser()
  const [nombre, setNombre] = useState(user?.firstName || '')
  const [peticion, setPeticion] = useState('')
  const [anonima, setAnonima] = useState(false)
  const [enviando, setEnviando] = useState(false)
  const [enviado, setEnviado] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!peticion.trim() || (!anonima && !nombre.trim())) return
    setEnviando(true)
    try {
      const res = await fetch('/api/peticiones', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nombre: anonima ? 'Anónimo' : nombre,
          peticion,
          esAnonima: anonima,
        }),
      })
      if (res.ok) {
        setEnviado(true)
        setPeticion('')
        setNombre('')
      }
    } finally {
      setEnviando(false)
    }
  }

  if (enviado) {
    return (
      <div className="min-h-screen bg-blue-950 flex items-center justify-center px-4">
        <Card className="max-w-md w-full p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <Heart className="w-10 h-10 text-green-600 fill-green-600" />
          </div>
          <h2 className="text-2xl font-black text-gray-900 mb-3">¡Petición enviada!</h2>
          <p className="text-gray-600 mb-6">
            Nuestro equipo pastoral orará por ti. Dios escucha cada oración.
          </p>
          <div className="flex gap-3 justify-center">
            <Button onClick={() => setEnviado(false)} variant="outline">
              Enviar otra
            </Button>
            <Link href="/">
              <Button className="bg-blue-900 hover:bg-blue-800">
                Volver al inicio
              </Button>
            </Link>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-blue-950 py-16 px-4">
      <div className="max-w-2xl mx-auto">

        <Link href="/" className="flex items-center gap-2 text-blue-300 hover:text-white mb-8 transition">
          <ArrowLeft className="w-4 h-4" />
          Volver al inicio
        </Link>

        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-yellow-400/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <Heart className="w-8 h-8 text-yellow-400 fill-yellow-400" />
          </div>
          <h1 className="text-4xl font-black text-white mb-3">Peticiones de oración</h1>
          <p className="text-blue-200 text-lg">
            Cuéntanos cómo podemos orar por ti. Tu petición llegará al equipo pastoral.
          </p>
        </div>

        <Card className="p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Opción anónima */}
            <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-xl border border-gray-200 cursor-pointer"
              onClick={() => setAnonima(!anonima)}>
              <div className={`w-5 h-5 rounded border-2 flex items-center justify-center transition
                ${anonima ? 'bg-blue-900 border-blue-900' : 'border-gray-400'}`}>
                {anonima && <span className="text-white text-xs font-black">✓</span>}
              </div>
              <Lock className="w-4 h-4 text-gray-500" />
              <div>
                <p className="font-bold text-gray-900 text-sm">Enviar de forma anónima</p>
                <p className="text-gray-500 text-xs">Tu nombre no será visible para nadie excepto el pastor</p>
              </div>
            </div>

            {/* Nombre */}
            {!anonima && (
              <div className="space-y-2">
                <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                  Tu nombre
                </label>
                <input
                  type="text"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="¿Cómo te llamas?"
                  maxLength={100}
                  required={!anonima}
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none font-medium"
                />
              </div>
            )}

            {/* Petición */}
            <div className="space-y-2">
              <label className="text-sm font-black text-gray-700 uppercase tracking-wider">
                Tu petición
              </label>
              <textarea
                value={peticion}
                onChange={e => setPeticion(e.target.value)}
                placeholder="Cuéntanos cómo podemos orar por ti..."
                rows={6}
                maxLength={1000}
                required
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-900 focus:outline-none font-medium resize-none"
              />
              <div className="flex justify-end">
                <span className="text-xs text-gray-400">{peticion.length} / 1000</span>
              </div>
            </div>

            <Button
              type="submit"
              disabled={enviando || !peticion.trim() || (!anonima && !nombre.trim())}
              className="w-full bg-blue-900 hover:bg-blue-800 text-white font-black text-lg py-6"
            >
              {enviando ? 'Enviando...' : '🙏 Enviar petición de oración'}
            </Button>

          </form>
        </Card>

        <p className="text-center text-blue-300/60 text-sm mt-6">
          "El Señor está cerca de todos los que le invocan." — Salmo 145:18
        </p>
      </div>
    </div>
  )
}