import Menu from '@/src/components/Menu/Menu'
import NavbarAdmin from '@/src/components/NavbarAdmin/NavbarAdmin'
import Image from 'next/image'
import Link from 'next/link'
import Logo from '@/src/app/assets/contact.png'

export default function DashboardLayout({
  children
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className='h-full flex'>
      <div className='w-[14%] md:w-[8%] lg:w-[16%] xl:w-[14%] p-4'>
        <Link href='/' className='flex items-center justify-center lg:justify-start gap-2'>
          <Image className='cursor-pointer' src={Logo} alt='logo' width={32} height={32} />
          <span className='hidden lg:block font-bold text-3xl cursor-pointer'>Return</span>
        </Link>
        <Menu />
      </div>
      <div className='w-[86%] md:w-[92%] lg:w-[84%] xl:w-[86%] flex flex-col'>
        <NavbarAdmin />
        {children}
      </div>
    </div>
  )
}
