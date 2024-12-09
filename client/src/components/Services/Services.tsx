'use client'
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'
import { useAppDispatch } from '@/src/app/hooks/store'
import intermediateJapanese from '@/src/app/assets/intermediateJapanese.png'
import advancedJapanese from '@/src/app/assets/advancedJapanese.png'
import jLPTPreparation from '@/src/app/assets/jLPTPreparation.png'
import japaneseCulture from '@/src/app/assets/japaneseCulture.png'
import languageBasics from '@/src/app/assets/languageBasics.png'
import japaneseForTravel from '@/src/app/assets/japaneseForTravel.png'
import Image from 'next/image'
import { useCategories } from '@/src/app/context/CategoriesContext'

const Services = () => {
  const t = useTranslations('services')
  const category = useCategories()
  const dispatch = useAppDispatch()

  const ServicesData = [
    {
      icon: languageBasics.src,
      delay: 0.2
    },
    {
      icon: intermediateJapanese.src,
      delay: 0.3
    },
    {
      icon: advancedJapanese.src,
      delay: 0.4
    },
    {
      icon: japaneseCulture.src,
      delay: 0.5
    },
    {
      icon: jLPTPreparation.src,
      delay: 0.6
    },
    {
      icon: japaneseForTravel.src,
      delay: 0.7
    }
  ]

  const SlideLeft = (delay: number) => {
    return {
      initial: {
        opacity: 0,
        x: 50
      },
      animate: {
        opacity: 1,
        x: 0,
        transition: {
          duration: 0.3,
          delay: delay,
          ease: 'easeInOut'
        }
      }
    }
  }

  return (
    <section className='bg-white dark:bg-dark dark:text-white'>
      <div className='container pb-14 pt-16'>
        <h1 className='text-4xl font-bold text-left pb-10'>{t('title')}</h1>
        <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-8'>
          {category?.map((category, index) => (
            <motion.div
              key={index}
              variants={SlideLeft(ServicesData[index].delay)}
              initial='initial'
              whileInView={'animate'}
              viewport={{ once: true }}
              className='bg-[#f4f4f4] rounded-2xl flex flex-col gap-4 items-center justify-center p-4 py-7 hover:bg-white hover:scale-110 duration-300 hover:shadow-2xl dark:bg-dark dark:text-white'
            >
              <div className='text-4xl mb-4'>
                <Image src={ServicesData[index].icon} width={50} height={50} alt='icon' />
              </div>
              <h1 className='text-lg font-semibold text-center px-3'>{category?.name}</h1>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default Services
