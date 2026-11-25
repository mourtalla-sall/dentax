import { headers as getHeaders } from 'next/headers.js'
import Image from 'next/image'
import { getPayload } from 'payload'
import React from 'react'
import { fileURLToPath } from 'url'

import config from '@/payload.config'
import './styles.css'

import { Soins } from '@/components/sections/Soins'
import { Hero } from '@/components/sections/Hero'
import { Engagements } from '@/components/sections/Engagements'
import { Equipe } from '@/components/sections/Equipe'
export default function HomePage() {
  return (
    <>
      <Hero />
      <Engagements />
      <Equipe />
      <Soins />
    </>
  )
}
