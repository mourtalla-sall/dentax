import { getPayload } from 'payload'
import config from '@payload-config'
import type { Practitioner } from '@/payload-types'

export async function getPractitioners(): Promise<Practitioner[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'practitioners',
    sort: 'order',
    limit: 12,
    depth: 1, // charge la photo (media)
  })
  return res.docs
}