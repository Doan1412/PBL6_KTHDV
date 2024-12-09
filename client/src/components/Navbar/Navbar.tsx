'use client'
import { IoMdMenu } from 'react-icons/io'
import { motion } from 'framer-motion'
import { Button } from '../ui/button'
import { ModeToggle } from '../ModeToggle/ModeToggle'
import Link from 'next/link'
import Flag_EN from '@/src/app/assets/england.png'
import Flag_VI from '@/src/app/assets/vietnam.png'
import Image from 'next/image'
import { useRouter, useSearchParams } from 'next/navigation'
import { usePathname } from 'next/navigation'
import { useTranslations } from 'next-intl'
import { switchLanguage } from '@/src/app/utils/switchLanguage'
import { useEffect, useState } from 'react'
import { CookieValueTypes, deleteCookie, getCookie, hasCookie } from 'cookies-next'
import { Profile } from '@/src/app/types/profile.type'
import { useAppDispatch } from '@/src/app/hooks/store'
import { failPopUp } from '@/src/app/hooks/features/popup.slice'
import http from '@/src/app/utils/http'
import { Avatar, AvatarImage } from '../ui/avatar'
import avtDefault from '@/src/app/assets/avtDefault.png'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '../ui/dropdown-menu'
import { Input } from '../ui/input'
import { FaSearch } from 'react-icons/fa'
import { useCategories } from '@/src/app/context/CategoriesContext'
const NavbarMenu = [
  {
    id: 1,
    key: 'home',
    path: '/'
  },
  {
    id: 2,
    key: 'translate',
    path: '/user/translate'
  },
  {
    id: 3,
    key: 'check_grammar',
    path: '/user/grammar'
  },
  {
    id: 4,
    key: 'category',
    path: '#'
  }
]
const Navbar = () => {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const t = useTranslations('navbar')
  const category = useCategories()
  const [token, setToken] = useState<CookieValueTypes>()
  const [profile, setProfile] = useState<Profile>()
  const [isOpen, setIsOpen] = useState<boolean>(false)
  const [searchTerm, setSearchTerm] = useState('')
  const dispatch = useAppDispatch()

  const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      if (searchTerm.trim() === '') return
      router.push(`/user/courses?query=${searchTerm}`)
    }
  }
  useEffect(() => {
    if (hasCookie('authToken')) {
      setToken(getCookie('authToken'))
      return
    }
  }, [])

  const handleNavigation = (href: string) => {
    router.push(href)
    setIsOpen(false)
  }

  useEffect(() => {
    if (token) {
      const fetchProfile = async () => {
        try {
          const res: { data: { message: Profile } } = await http.get(`users/profile`)
          setProfile(res.data.message)
        } catch (error: any) {
          const message = error?.response?.data?.error || error.message || t('error')
          dispatch(failPopUp(message))
        }
      }
      fetchProfile()
    }
  }, [dispatch, t, token])

  const queryString = searchParams.toString()

  return (
    <nav className='relative z-20'>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className='container pt-10 flex justify-between items-center'
      >
        <div className='flex'>
          <Link href='/' className='font-bold text-4xl cursor-pointer'>
            {t('logo')}
          </Link>
        </div>
        <div className='relative'>
          <Input
            type='search'
            placeholder={t('search_placeholder')}
            className='w-80 rounded-full mr-10 px-5 pl-10'
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <span className='absolute inset-y-0 left-0 flex items-center pl-3'>
            <FaSearch className='text-gray-500' />
          </span>
        </div>
        <div className='hidden lg:block'>
          <ul className='flex items-center gap-3'>
            {NavbarMenu?.map((menu) => (
              <li key={menu.id}>
                {menu.key === 'category' ? (
                  <div>
                    <div className='group relative cursor-pointer'>
                      <div className='inline-block py-2 px-3 hover:text-secondary relative group dark:text-dark'>
                        <div className='w-2 h-2 bg-secondary absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden cursor-pointer'></div>
                        {t('category')}
                      </div>
                      <div className='invisible absolute z-50 flex flex-col w-60 bg-white py-1 px-4 text-gray-800 shadow-xl group-hover:visible rounded-lg'>
                        {category?.map((categories, index) => (
                          <Link
                            className='my-2 block border-b border-gray-100 py-1 font-semibold text-gray-500 hover:text-primary md:mx-2'
                            key={index}
                            href={`/en/user/category/${categories.id}`}
                          >
                            {categories?.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <Link
                    href={`${menu.path}`}
                    className='inline-block py-2 px-3 hover:text-secondary relative group dark:text-dark'
                  >
                    <div className='w-2 h-2 bg-secondary absolute mt-4 rounded-full left-1/2 -translate-x-1/2 top-1/2 bottom-0 group-hover:block hidden cursor-pointer'></div>
                    {t(menu.key)}
                  </Link>
                )}
              </li>
            ))}
            <ModeToggle />
            <Link href={switchLanguage('en', pathname, queryString)}>
              <Image src={Flag_EN} alt='Flag EN' className='w-9 h-7' />
            </Link>
            <Link href={switchLanguage('vi', pathname, queryString)}>
              <Image src={Flag_VI} alt='Flag VI' className='w-9 h-7' />
            </Link>
            {token ? (
              <Avatar>
                <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
                  <DropdownMenuTrigger>
                    <AvatarImage src={profile?.profile?.image_url ? profile?.profile?.image_url : avtDefault.src} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuLabel>{t('my_account')}</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => handleNavigation('/user/profile')}>
                      {t('profile')}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => handleNavigation('/user/mycourses')}>
                      {t('my_course')}
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onClick={() => {
                        deleteCookie('authToken')
                        deleteCookie('role')
                        router.push('/login')
                      }}
                    >
                      {t('logout')}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </Avatar>
            ) : (
              <Button
                variant='outline'
                onClick={() => {
                  router.push(`/login`)
                }}
              >
                {t('button_sign_in')}
              </Button>
            )}
          </ul>
        </div>
        <div className='lg:hidden'>
          <IoMdMenu className='text-4xl' />
        </div>
      </motion.div>
    </nav>
  )
}
export default Navbar
