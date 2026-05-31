'use client'
import { useUser, SignInButton, UserButton } from '@clerk/nextjs'
import { Button } from '@/components/ui/button'
import { Heart } from 'lucide-react'

export default function Home() {
  const { isSignedIn } = useUser()

  return (
    <main className="min-h-screen bg-blue-950">
      
      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 bg-blue-900">
        <div className="flex items-center gap-2">
          <Heart className="text-yellow-400 w-6 h-6" />
          <span className="text-white font-bold text-xl">Iglesia MMM Suba Rincón</span>
        </div>
        <div className="flex items-center gap-4">
          {!isSignedIn ? (
            <SignInButton>
              <Button variant="outline" className="text-white border-white hover:bg-blue-800">
                Iniciar sesión
              </Button>
            </SignInButton>
          ) : (
            <>
              <Button variant="outline" className="text-white border-white hover:bg-blue-800">
                Panel
              </Button>
              <UserButton />
            </>
          )}
        </div>
      </nav>

      {/* Hero */}
      <section className="flex flex-col items-center justify-center text-center py-32 px-4">
        <p className="text-yellow-400 text-sm font-bold uppercase tracking-widest mb-4">
          Bienvenido a nuestra comunidad
        </p>
        <h1 className="text-5xl md:text-7xl font-black text-white mb-6">
          Iglesia MMM<br />
          <span className="text-yellow-400">Suba Rincón</span>
        </h1>
        <p className="text-blue-200 text-xl max-w-2xl mb-10">
          Un lugar para encontrar esperanza, familia y el propósito de Dios para tu vida. 
          Ubicados en el barrio Suba Rincón, Bogotá.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          {!isSignedIn ? (
            <SignInButton>
              <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
                Únete a la comunidad
              </Button>
            </SignInButton>
          ) : (
            <Button size="lg" className="bg-yellow-400 text-blue-950 hover:bg-yellow-300 font-black text-lg px-8">
              Ver mi perfil
            </Button>
          )}
          <Button size="lg" variant="outline" className="text-white border-white hover:bg-blue-800 text-lg px-8">
            Conocer más
          </Button>
        </div>
      </section>

      {/* Stats */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto px-6 pb-20">
        {[
          { num: '10+', label: 'Ministerios activos' },
          { num: '200+', label: 'Familias en comunidad' },
          { num: 'Dom', label: 'Culto dominical 10am' },
          { num: '∞', label: 'Fe y esperanza' },
        ].map((stat) => (
          <div key={stat.label} className="bg-blue-900/50 rounded-2xl p-6 text-center border border-blue-800">
            <p className="text-yellow-400 text-3xl font-black">{stat.num}</p>
            <p className="text-blue-200 text-sm mt-1">{stat.label}</p>
          </div>
        ))}
      </section>

    </main>
  )
}