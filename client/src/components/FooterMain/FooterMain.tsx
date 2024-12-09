import React from 'react'
import Link from 'next/link'
import { useTranslations } from 'next-intl'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/src/components/ui/hover-card'
import { Avatar, AvatarFallback, AvatarImage } from '@/src/components/ui/avatar'
import { CalendarIcon } from '@radix-ui/react-icons'
import ImageContact from '@/src/app/assets/contact.png'

export default function FooterMain() {
  const t = useTranslations('footer')

  return (
    <div className='items-end'>
      <footer className='bg-white rounded-lg shadow m-2 dark:bg-gray-800'>
        <div className='w-full mx-auto max-w-screen-xl p-4 md:flex md:justify-between'>
          <span className='text-sm text-gray-500 sm:text-center dark:text-gray-400'>
            © 2024{' '}
            <Link href='/' className='hover:underline'>
              {t('return')}
            </Link>
            . {t('allRightsReserved')}
          </span>
          <ul className='flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0'>
            <li>
              <Link href='/' className='hover:underline me-4 md:me-6'>
                {t('home')}
              </Link>
            </li>
            <li>
              <Link href='#' className='hover:underline me-4 md:me-6'>
                {t('privacyPolicy')}
              </Link>
            </li>
            <li>
              <Link href='#' className='hover:underline me-4 md:me-6'>
                {t('licensing')}
              </Link>
            </li>
            <li>
              <HoverCard>
                <HoverCardTrigger>
                  <button className='hover:underline'>{t('contact')}</button>
                </HoverCardTrigger>
                <HoverCardContent>
                  <div className='flex justify-between space-x-4'>
                    <Avatar>
                      <AvatarImage src={ImageContact.src} />
                      <AvatarFallback>VC</AvatarFallback>
                    </Avatar>
                    <div className='space-y-1'>
                      <h4 className='text-sm font-semibold'>{t('japaneseLearningInfo')}</h4>
                      <p className='text-sm'>{t('learnJapaneseDescription')}</p>
                      <div className='flex-col items-center pt-2'>
                        <div className='flex'>
                          <CalendarIcon className='mr-2 h-4 w-4 opacity-70' />{' '}
                          <span className='text-xs text-muted-foreground'>{t('date_time')}</span>
                        </div>
                        <p className='text-xs mt-2 text-gray-500'>{t('credits')}</p>
                      </div>
                    </div>
                  </div>
                </HoverCardContent>
              </HoverCard>
            </li>
          </ul>
        </div>
      </footer>
    </div>
  )
}
