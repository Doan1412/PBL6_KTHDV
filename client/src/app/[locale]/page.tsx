import type { Metadata } from 'next'
import Hero from '../../components/Hero/Hero'
import Services from '../../components/Services/Services'
import Banner from '../../components/Banner/Banner'
import Subscribe from '../../components/Subscribe/Subscribe'
import Banner2 from '../../components/Banner/Banner2'
import Footer from '../../components/Footer/Footer'
import ShowCourse from '@/src/components/ShowCourse/ShowCourse'

export const metadata: Metadata = {
  title: 'E-learning',
  description: 'App supports learning japan online'
}

export default function Index() {
  return (
    <main className='overflow-x-hidden'>
      <Hero />
      <Services />
      <ShowCourse />
      <Banner />
      <Subscribe />
      <Banner2 />
      <Footer />
    </main>
  )
}
