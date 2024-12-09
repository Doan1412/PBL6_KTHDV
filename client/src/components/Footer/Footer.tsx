'use client'
import React from 'react'
import { FaInstagram, FaWhatsapp, FaYoutube } from 'react-icons/fa'
import { TbWorldWww } from 'react-icons/tb'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const Footer: React.FC = () => {
  const t = useTranslations('footer_page')

  return (
    <footer className='py-28 bg-[#f7f7f7] dark:bg-dark dark:text-white'>
      <motion.div initial={{ opacity: 0, y: 50 }} whileInView={{ opacity: 1, y: 0 }} className='container'>
        <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-14 md:gap-4'>
          <div className='space-y-4 max-w-[300px]'>
            <h1 className='text-2xl font-bold'>{t('title')}</h1>
            <p className='text-dark2'>{t('description')}</p>
          </div>
          <div className='grid grid-cols-2 gap-10'>
            <div className='space-y-4'>
              <h1 className='text-2xl font-bold'>{t('coursesTitle')}</h1>
              <div className='text-dark2'>
                <ul className='space-y-2 text-lg'>
                  <li className='cursor-pointer hover:text-secondary duration-200'>{t('courses.eLearning')}</li>
                </ul>
              </div>
            </div>
            <div className='space-y-4'>
              <h1 className='text-2xl font-bold'>{t('linksTitle')}</h1>
              <div className='text-dark2'>
                <ul className='space-y-2 text-lg'>
                  <li className='cursor-pointer hover:text-secondary duration-200'>{t('links.home')}</li>
                  <li className='cursor-pointer hover:text-secondary duration-200'>{t('links.about')}</li>
                  <li className='cursor-pointer hover:text-secondary duration-200'>{t('links.contact')}</li>
                </ul>
              </div>
            </div>
          </div>
          <div className='space-y-4 max-w-[300px]'>
            <h1 className='text-2xl font-bold'>{t('getInTouchTitle')}</h1>
            <div className='flex items-center'>
              <input
                type='text'
                placeholder={t('emailPlaceholder')}
                className='p-3 rounded-s-xl bg-white w-full py-4 focus:ring-0 focus:outline-none placeholder:text-dark2'
              />
              <button className='inline-block bg-blue-500 text-white font-semibold py-4 px-6 rounded-e-xl'>
                {t('goButton')}
              </button>
            </div>
            {/* social icons */}
            <div className='flex space-x-6 py-3'>
              <a href='https://chat.whatsapp.com/FQSKgJ5f1eIAhlyF5sVym0'>
                <FaWhatsapp className='cursor-pointer hover:text-primary hover:scale-105 duration-200' />
              </a>
              <a href='https://www.instagram.com/the.coding.journey/'>
                <FaInstagram className='cursor-pointer hover:text-primary hover:scale-105 duration-200' />
              </a>
              <a href='https://thecodingjourney.com/'>
                <TbWorldWww className='cursor-pointer hover:text-primary hover:scale-105 duration-200' />
              </a>
              <a href='https://www.youtube.com/@TheCodingJourney'>
                <FaYoutube className='cursor-pointer hover:text-primary hover:scale-105 duration-200' />
              </a>
            </div>
          </div>
        </div>
      </motion.div>
    </footer>
  )
}

export default Footer
