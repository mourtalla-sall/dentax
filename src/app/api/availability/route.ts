import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import {
  addDays,
  generateDaySlots,
  isPastSlot,
  isValidDate,
  mondayOf,
  nowInParis,
} from '@/lib/slots'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const now = nowInParis()
  const param = req.nextUrl.searchParams.get('week')

  if (param && !isValidDate(param)) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const monday = mondayOf(param ?? now.date)
  const minMonday = mondayOf(now.date)
  const maxMonday = addDays(minMonday, 7 * 12)
  if (monday < minMonday || monday > maxMonday) {
    return NextResponse.json({ error: 'Semaine hors limites.' }, { status: 400 })
  }
  const sunday = addDays(monday, 6)

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  const booked = await payload.find({
    collection: 'appointments',
    where: {
      and: [
        { date: { greater_than_equal: monday } },
        { date: { less_than_equal: sunday } },
        { status: { not_equals: 'cancelled' } },
      ],
    },
    pagination: false,
    depth: 0,
    overrideAccess: true,
  })
  const taken = new Set(booked.docs.map((a) => `${a.date}T${a.time}`))

  const days = Array.from({ length: 7 }, (_, i) => {
    const date = addDays(monday, i)
    const slots = generateDaySlots(settings, date).map((time) => ({
      time,
      available: !taken.has(`${date}T${time}`) && !isPastSlot(date, time, now),
    }))
    return { date, open: slots.length > 0, slots }
  })

  return NextResponse.json(
    { week: monday, today: now.date, days },
    { headers: { 'Cache-Control': 'no-store' } },
  )
}