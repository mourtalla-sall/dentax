import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'


import { Hero } from '@/components/sections/Hero'
import { Engagements } from '@/components/sections/Engagements'

export default function HomePage() {
  return (
    <>
      <Hero />
      <Engagements />
    </>
  )
}
