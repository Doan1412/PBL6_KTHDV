'use client'
import { FaBell } from 'react-icons/fa'
import BgImage from '@/src/app/assets/bg.png'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

const bgStyle = {
  backgroundImage: `url(${BgImage.src})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  backgroundPosition: 'center'
}

const Subscribe = () => {
  const t = useTranslations('subscribe')
  return (
    <section className='bg-[#f7f7f7] dark:text-dark dark:bg-dark'>
      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        style={bgStyle}
        className='container py-24 md:py-48 dark:rounded-lg'
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, ease: 'easeInOut' }}
          className='flex flex-col justify-center'
        >
          <div className='text-center space-y-4 lg:max-w-[430px] mx-auto'>
            <h1 className='text-4xl font-bold !leading-snug'>{t('title')}</h1>
            <p>{t('description')}</p>
            <a href='' className='primary-btn !mt-8 inline-flex items-center gap-4 group'>
              {t('buttonText')}
              <FaBell className='group-hover:animate-bounce group-hover:text-lg duration-200' />
            </a>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}

export default Subscribe
