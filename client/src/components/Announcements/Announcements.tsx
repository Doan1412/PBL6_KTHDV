import { useTranslations } from 'next-intl'

const Announcements = () => {
  const t = useTranslations('announcements')

  return (
    <div className='bg-white p-4 rounded-md dark:bg-slate-800 dark:text-white dark:shadow-2xl'>
      <div className='flex items-center justify-between'>
        <h1 className='text-xl font-semibold'>{t('title')}</h1>
        <span className='text-xs text-gray-400'>{t('viewAll')}</span>
      </div>
      <div className='flex flex-col gap-4 mt-4'>
        <div className='bg-lamaSkyLight rounded-md p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>{t('announcementTitle')}</h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>2025-01-01</span>
          </div>
          <p className='text-sm text-gray-400 mt-1'>{t('announcementDescription')}</p>
        </div>
        <div className='bg-lamaPurpleLight rounded-md p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>{t('announcementTitle')}</h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>2025-01-01</span>
          </div>
          <p className='text-sm text-gray-400 mt-1'>{t('announcementDescription')}</p>
        </div>
        <div className='bg-lamaYellowLight rounded-md p-4'>
          <div className='flex items-center justify-between'>
            <h2 className='font-medium'>{t('announcementTitle')}</h2>
            <span className='text-xs text-gray-400 bg-white rounded-md px-1 py-1'>2025-01-01</span>
          </div>
          <p className='text-sm text-gray-400 mt-1'>{t('announcementDescription')}</p>
        </div>
      </div>
    </div>
  )
}

export default Announcements
