'use client'
import Image from 'next/image'
import Link from 'next/link'
import home from '@/src/app/assets/home.png'
import teacher from '@/src/app/assets/teacher.png'
import student from '@/src/app/assets/student.png'
import lesson from '@/src/app/assets/levelMenu.png'
import profile from '@/src/app/assets/profile.png'
import setting from '@/src/app/assets/setting.png'
import logout from '@/src/app/assets/logout.png'
import calendar from '@/src/app/assets/calendar.png'
import { deleteCookie } from 'cookies-next'
import { useRouter } from 'next/navigation'
import { useTranslations } from 'next-intl'

const menuItems = [
  {
    title: 'MENU',
    items: [
      {
        icon: home,
        label: 'dashboard',
        href: '/teacher'
      },
      {
        icon: lesson,
        label: 'courses',
        href: '/teacher/courses'
      },
      {
        icon: student,
        label: 'lesson',
        href: '/teacher/users'
      },
      {
        icon: calendar,
        label: 'request',
        href: '/teacher/request'
      }
    ]
  },
  {
    title: 'OTHER',
    items: [
      {
        icon: teacher,
        label: 'profile',
        href: '/teacher/profile'
      },
      {
        icon: setting,
        label: 'settings',
        href: '/settings'
      },
      {
        icon: logout,
        label: 'logout',
        href: '/logout'
      }
    ]
  }
]

const Menu = () => {
  const router = useRouter()
  const t = useTranslations('menu_teacher')

  return (
    <div className='mt-4 text-sm dark:text-white'>
      {menuItems.map((section) => (
        <div className='flex flex-col gap-2' key={section.title}>
          <span className='hidden lg:block text-gray-400 font-light my-4'>{t(section.title)}</span>
          {section.items.map((item) => {
            const translatedLabel = t(item.label)

            if (item.label === 'logout') {
              return (
                <button
                  key={item.label}
                  className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight'
                  onClick={() => {
                    deleteCookie('authToken')
                    deleteCookie('role')
                    router.push('/login')
                  }}
                >
                  <Image src={item.icon} alt='' width={20} height={20} />
                  <span className='hidden lg:block'>{translatedLabel}</span>
                </button>
              )
            }

            return (
              <Link
                href={item.href}
                key={item.label}
                className='flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2 md:px-2 rounded-md hover:bg-lamaSkyLight'
              >
                <Image src={item.icon} alt='' width={20} height={20} />
                <span className='hidden lg:block'>{translatedLabel}</span>
              </Link>
            )
          })}
        </div>
      ))}
    </div>
  )
}

export default Menu
