import { getPayload } from 'payload'
import config from '@payload-config'
import type { Service } from '@/payload-types'

export async function getServices(): Promise<Service[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'services',
    sort: 'order',
    limit: 20,
    depth: 0,
  })
  return res.docs
}