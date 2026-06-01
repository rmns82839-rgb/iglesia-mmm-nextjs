import { redirect } from 'next/navigation'
import { esAdmin } from '@/lib/auth'

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const admin = await esAdmin()
  if (!admin) {
    redirect('/dashboard')
  }
  return <>{children}</>
}