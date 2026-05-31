'use client'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Heart, MapPin, Clock, Users, Music, Shield, Zap, Baby, Handshake, Cross } from 'lucide-react'
import Link from 'next/link'

const ministerios = [
  { nombre: 'Caballeros', icono: Shield, color: 'bg-blue-600', desc: 'Hombres de fe sirviendo a Dios' },
  { nombre: 'Damas', icono: Heart, color: 'bg-pink-500', desc: 'Mujeres unidas en fe y servicio' },
  { nombre: 'Jóvenes', icono: Zap, color: 'bg-green-500', desc: 'Una generación encendida para Dios' },
  { nombre: 'Niños', icono: Baby, color: 'bg-yellow-500', desc: 'Sembrando fe desde la infancia' },
  { nombre: 'Alabanza', icono: Music, color: 'bg-red-500', desc: 'Adoración con excelencia musical' },
  { nombre: 'Evangelismo', icono: Cross, color: 'bg-orange-500', desc: 'Llevando el evangelio a Suba' },
  { nombre: 'Ujieres', icono: Handshake, color: 'bg-purple-500', desc: 'Sirviendo con excelencia' },
]

export default function Home() {
  const { isSignedIn, user } = useUser()

  return (
    <main className="min-h-screen bg-white">

      {/* Navbar */}
      <nav className="sticky top-0 z-50 flex items-center justify-between px-6 py-4 bg-blue-900 shadow-xl">
        <div className="flex items-center gap-2">
          <Heart className="text-yellow-400 w-6 h-6 fill-yellow-400" />
          <span className="text-white font-black text-xl tracking-tight">MMM Suba Rincón</span>
        </div>
        <div className="hidden md:flex items-center gap-6 text-sm font-bold text-blue-200">
          <a href="#ministerios" className="hover:text-white transition">Ministerios</a>
          <a href="#servicios" className="hover:text-white transition">Servicios</a>
          <a href="#peticiones" className="hover:text-white transition">Peticiones</a>
          <Link href="/foro" className="hover:text-white transition">Foro</Link>
        </div>
        <div className="flex items-center gap-3">
          {!isSignedIn ? (
            <SignInButton>
              <Button size="sm" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black">
                Iniciar sesión
              </Button>
            </SignInButton>
          ) : (
            <>
              <span className="text-blue-200 text-sm hidden md:block">
                Hola, {user?.firstName}
              </span>
              <Link href="/dashboard">
                <Button size="sm" variant="outline" className="text-white border-white hover:bg-blue-800 font-bold">
                  Mi panel
                </Button>
              </Link>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      {/* Hero con foto real */}
      <section className="relative text-white py-28 px-4 overflow-hidden min-h-[600px] flex items-center">
        <div className="absolute inset-0">
          <img 
            src="/foto3.jpeg" 
            alt="Congregación" 
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-950/75" />
        </div>
        <div className="relative z-10 max-w-5xl mx-auto text-center w-full">
          <span className="inline-block bg-yellow-400/20 text-yellow-400 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full mb-6">
            Comunidad Cristiana en Bogotá
          </span>
          <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
            Iglesia MMM<br />
            <span className="text-yellow-400">Suba Rincón</span>
          </h1>
          <p className="text-blue-200 text-xl max-w-2xl mx-auto mb-10">
            Un lugar para encontrar esperanza, familia y el propósito de Dios para tu vida.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            {!isSignedIn ? (
              <SignInButton>
                <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
                  Únete a la comunidad
                </Button>
              </SignInButton>
            ) : (
              <Link href="/dashboard">
                <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
                  Ir a mi panel
                </Button>
              </Link>
            )}
            <a href="#servicios">
              <Button size="lg" variant="outline" className="text-white border-white/50 hover:bg-white/10 text-lg px-8">
                Ver horarios
              </Button>
            </a>
          </div>
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 px-4 bg-blue-50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Horarios</span>
            <h2 className="text-4xl font-black text-gray-900 mt-1">Cultos y servicios</h2>
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            {[
  { dia: 'Domingo', hora: '8:00 AM', tipo: 'Clases prebautismales', lugar: 'Salón de clases' },
  { dia: 'Domingo', hora: '9:00 AM', tipo: 'Escuela dominical', lugar: 'Templo Central' },
  { dia: 'Martes', hora: '7:00 PM', tipo: 'Culto de oración', lugar: 'Templo Central' },
  { dia: 'Jueves', hora: '7:00 PM', tipo: 'Enseñanza bíblica', lugar: 'Templo Central' },
  { dia: 'Sábado', hora: '7:00 PM', tipo: 'Culto de alabanza', lugar: 'Templo Central' },
].map((s) => (
              <div key={s.tipo} className="bg-white rounded-2xl p-6 shadow-sm border border-blue-100">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="text-blue-600 w-6 h-6" />
                </div>
                <p className="text-xs font-black uppercase text-blue-600 tracking-widest">{s.dia}</p>
                <h3 className="text-2xl font-black text-gray-900 mt-1">{s.hora}</h3>
                <p className="text-gray-600 font-medium">{s.tipo}</p>
                <div className="flex items-center gap-1 mt-3 text-gray-400 text-sm">
                  <MapPin className="w-4 h-4" />
                  <span>{s.lugar}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Ministerios */}
      <section id="ministerios" className="py-20 px-4 bg-white">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Comunidad</span>
            <h2 className="text-4xl font-black text-gray-900 mt-1">Nuestros ministerios</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {ministerios.map((m) => (
              <div key={m.nombre} className="group bg-gray-50 hover:bg-blue-50 rounded-2xl p-6 text-center border border-gray-100 hover:border-blue-200 transition-all cursor-pointer">
                <div className={`w-14 h-14 ${m.color} rounded-2xl flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                  <m.icono className="text-white w-7 h-7" />
                </div>
                <h3 className="font-black text-gray-900">{m.nombre}</h3>
                <p className="text-xs text-gray-500 mt-1">{m.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Peticiones CTA */}
      <section id="peticiones" className="py-20 px-4 bg-blue-900 text-white text-center">
        <div className="max-w-2xl mx-auto">
          <Heart className="w-12 h-12 text-yellow-400 mx-auto mb-4 fill-yellow-400" />
          <h2 className="text-4xl font-black mb-4">¿Necesitas oración?</h2>
          <p className="text-blue-200 text-lg mb-8">
            Envíanos tu petición. Nuestro equipo pastoral orará por ti.
            Puedes hacerlo de forma anónima.
          </p>
          {!isSignedIn ? (
            <SignInButton>
              <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
                Enviar petición de oración
              </Button>
            </SignInButton>
          ) : (
            <Link href="/peticiones">
              <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
                Enviar petición de oración
              </Button>
            </Link>
          )}
        </div>
      </section>

      {/* Galería de fotos */}
      <section className="py-20 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <span className="text-xs font-black uppercase tracking-widest text-blue-600">Nuestra comunidad</span>
            <h2 className="text-4xl font-black text-gray-900 mt-1">Momentos de fe</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="col-span-2 row-span-2 rounded-2xl overflow-hidden h-80">
              <img src="/foto1.jpeg" alt="Culto" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[152px]">
              <img src="/foto2.jpeg" alt="Adoración" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[152px]">
              <img src="/foto4.jpeg" alt="Comunidad" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[152px]">
              <img src="/foto5.jpeg" alt="Bautismo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="rounded-2xl overflow-hidden h-[152px]">
              <img src="/fortaleza.jpeg" alt="Predicación" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
            <div className="col-span-2 rounded-2xl overflow-hidden h-[152px]">
              <img src="/foto6.jpeg" alt="Liderazgo" className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto grid md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Heart className="text-yellow-400 w-5 h-5 fill-yellow-400" />
              <span className="font-black text-lg">MMM Suba Rincón</span>
            </div>
            <p className="text-gray-400 text-sm">Comunidad cristiana en el barrio Suba Rincón, Bogotá, Colombia.</p>
          </div>
          <div>
            <h4 className="font-black mb-4 text-yellow-400">Ubicación</h4>
            <div className="flex items-start gap-2 text-gray-400 text-sm">
              <MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" />
              <span>Barrio Suba Rincón, Bogotá D.C., Colombia</span>
            </div>
          </div>
          <div>
            <h4 className="font-black mb-4 text-yellow-400">Comunidad</h4>
            <div className="flex items-center gap-2 text-gray-400 text-sm">
              <Users className="w-4 h-4" />
              <span>+200 familias en comunidad</span>
            </div>
          </div>
        </div>
        <div className="max-w-5xl mx-auto border-t border-gray-800 mt-8 pt-8 text-center text-gray-500 text-sm">
          © 2025 Iglesia MMM Suba Rincón — Desarrollado con ❤️
        </div>
      </footer>

    </main>
  )
}