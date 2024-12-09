import Announcements from '@/src/components/Announcements/Announcements'
import AttendanceChart from '@/src/components/AttendanceChart/AttendanceChart'
import CountChart from '@/src/components/CountChart/CountChart'
import EventCalendar from '@/src/components/EventCalendar/EventCalendar'
import FinanceChart from '@/src/components/FinanceChart/FinanceChart'
import UserCard from '@/src/components/UserCard/UserCard'
import React from 'react'

export default function AdminPage() {
  return (
    <div className='p-4 flex gap-4 flex-col md:flex-row dark:bg-dark dark:text-white'>
      <div className='w-full lg:w-2/3 flex flex-col gap-8'>
        <div className='flex gap-4 justify-between flex-wrap'>
          <UserCard type='student' />
          <UserCard type='teacher' />
          <UserCard type='parent' />
          <UserCard type='staff' />
        </div>
        <div className='flex gap-4 flex-col lg:flex-row'>
          <div className='w-full lg:w-1/3 h-[450px]'>
            <CountChart />
          </div>
          <div className='w-full lg:w-2/3 h-[450px]'>
            <AttendanceChart />
          </div>
        </div>
        <div className='w-full h-[500px]'>
          <FinanceChart />
        </div>
      </div>
      <div className='w-full lg:w-1/3 flex flex-col gap-8'>
        <EventCalendar />
        <Announcements />
      </div>
    </div>
  )
}
