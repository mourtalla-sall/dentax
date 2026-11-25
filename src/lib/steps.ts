import { getPayload } from 'payload'
import config from '@payload-config'
import type { Step } from '@/payload-types'

export async function getSteps(): Promise<Step[]> {
  const payload = await getPayload({ config })
  const res = await payload.find({
    collection: 'steps',
    sort: 'number',
    limit: 8,
    depth: 0,
  })
  return res.docs
}