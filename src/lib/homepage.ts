import { getPayload } from 'payload'
import config from '@payload-config'
import type { Homepage } from '@/payload-types'

export async function getHomepage(): Promise<Homepage> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'homepage', depth: 2 })
}