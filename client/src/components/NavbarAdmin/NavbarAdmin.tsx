'use client'
import Image from 'next/image'
import search from '@/src/app/assets/search.png'
import avatar from '@/src/app/assets/avatar.png'
import ModeToggle from '../ModeToggle/ModeToggle'
import Link from 'next/link'
import { usePathname, useSearchParams } from 'next/navigation'
import { switchLanguage } from '@/src/app/utils/switchLanguage'
import Flag_EN from '@/src/app/assets/england.png'
import Flag_VI from '@/src/app/assets/vietnam.png'

const NavbarAdmin = () => {
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const queryString = searchParams.toString()

  return (
    <div className='flex items-center justify-between p-4 dark:bg-dark dark:text-white'>
      <div className='hidden md:flex items-center gap-2 text-xs rounded-full ring-[1.5px] ring-gray-300 px-2'>
        <Image src={search} alt='' width={14} height={14} />
        <input type='text' placeholder='Search...' className='w-[200px] p-2 bg-transparent outline-none' />
      </div>
      <div className='flex items-center gap-6 justify-end w-full'>
        <ModeToggle />
        <Link href={switchLanguage('en', pathname, queryString)}>
          <Image src={Flag_EN} alt='Flag EN' className='w-9 h-7' />
        </Link>
        <Link href={switchLanguage('vi', pathname, queryString)}>
          <Image src={Flag_VI} alt='Flag VI' className='w-9 h-7' />
        </Link>
        <div className='flex flex-col'>
          <span className='text-xs leading-3 font-medium'>John Doe</span>
          <span className='text-[10px] text-gray-500 text-right'>Admin</span>
        </div>
        <Image src={avatar} alt='' width={36} height={36} className='rounded-full' />
      </div>
    </div>
  )
}

export default NavbarAdmin
