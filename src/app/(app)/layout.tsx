import TopBar from '@/components/layout/TopBar'
import BottomNav from '@/components/layout/BottomNav'
import { Toaster } from 'react-hot-toast'

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      <TopBar />
      <main className="pt-14 pb-20 max-w-5xl mx-auto">{children}</main>
      <BottomNav />
      <Toaster position="top-center" />
    </div>
  )
}
