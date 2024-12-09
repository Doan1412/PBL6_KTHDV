'use client'
import FooterMain from '@/src/components/FooterMain/FooterMain'
import Navbar from '@/src/components/Navbar/Navbar'

export default function UserLayout({ children }: { children: React.ReactNode }) {
  return (
    <section>
      <div className='grid h-lvh grid-rows-[auto_1fr_auto]'>
        <Navbar />
        {children}
        <FooterMain />
      </div>
    </section>
  )
}
