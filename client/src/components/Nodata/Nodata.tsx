import Image from 'next/image'
import Img from '@/src/app/assets/404_2.svg'
import { useTranslations } from 'next-intl'
const Nodata = () => {
  const t = useTranslations('nodata')
  return (
    <div className='flex flex-col justify-center items-center w-full h-4/5 text-center'>
      <div className='mb-8'>
        <Image src={Img.src} alt='No data' height={650} width={650} />
      </div>
      <h1 className='text-4xl font-bold'>{t('no_data_title')}</h1>
      <p className='mt-4 text-lg text-gray-600'>{t('no_data_description')}</p>
      <a href='/' className='mt-6 text-blue-500 hover:underline'>
        {t('go_home')}
      </a>
    </div>
  )
}
export default Nodata
