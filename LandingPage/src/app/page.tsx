import Header from '@/components/Header'
import Hero from '@/components/Hero'
import HowItWorks from '@/components/HowItWorks'
import Benefits from '@/components/Benefits'
import ForPartners from '@/components/ForPartners'
import AppDownload from '@/components/AppDownload'
import Footer from '@/components/Footer'

export default function Home() {
  return (
    <main className="min-h-screen">
      <Header />
      <Hero />
      <HowItWorks />
      <Benefits />
      <ForPartners />
      <AppDownload />
      <Footer />
    </main>
  )
}

