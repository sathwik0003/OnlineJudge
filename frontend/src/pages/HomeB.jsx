import React from 'react'
import Headerb from '@/components/Headerb'
import Footer from '@/components/Footer'
import HomePage from '@/components/HomePage'

const Homeb = () => {
  return (
    <div className="flex flex-col min-h-screen">
      <Headerb />
      <main className="flex-grow">
        <HomePage />
      </main>
      <Footer />
    </div>
  )
}

export default Homeb