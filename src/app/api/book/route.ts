import { NextRequest, NextResponse } from 'next/server'
import { getPayload } from 'payload'
import config from '@payload-config'
import { z } from 'zod'
import { generateDaySlots, isPastSlot, isValidDate, nowInParis } from '@/lib/slots'
import { rateLimit } from '@/lib/rate-limit'

export const dynamic = 'force-dynamic'

const schema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z.string().trim().regex(/^[0-9 .+()-]{8,20}$/),
  reason: z.enum(['first', 'checkup', 'urgent', 'other']),
  date: z.string(),
  time: z.string().regex(/^\d{2}:\d{2}$/),
  consent: z.literal(true),
  website: z.string().optional(), // champ piège (honeypot), invisible pour un humain
})

export async function POST(req: NextRequest) {
  const ip = req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? 'unknown'
  if (!rateLimit(ip)) {
    return NextResponse.json(
      { error: 'Trop de tentatives. Réessayez dans quelques minutes.' },
      { status: 429 },
    )
  }

  let body: unknown
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Requête invalide.' }, { status: 400 })
  }

  const parsed = schema.safeParse(body)
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Merci de vérifier vos informations et de cocher le consentement.' },
      { status: 400 },
    )
  }
  const d = parsed.data

  // Un robot remplit le champ piège : on répond "ok" sans rien enregistrer.
  if (d.website) return NextResponse.json({ ok: true })

  if (!isValidDate(d.date)) {
    return NextResponse.json({ error: 'Date invalide.' }, { status: 400 })
  }

  const payload = await getPayload({ config })
  const settings = await payload.findGlobal({ slug: 'site-settings' })

  // Le créneau doit exister dans les horaires et ne pas être trop proche.
  const valid = generateDaySlots(settings, d.date)
  if (!valid.includes(d.time) || isPastSlot(d.date, d.time, nowInParis())) {
    return NextResponse.json({ error: "Ce créneau n'est pas disponible." }, { status: 400 })
  }

  const slotKey = `${d.date}T${d.time}`
  const conflict = { error: "Ce créneau vient d'être réservé. Merci d'en choisir un autre." }

  const existing = await payload.find({
    collection: 'appointments',
    where: { slotKey: { equals: slotKey } },
    limit: 1,
    depth: 0,
    overrideAccess: true,
  })
  if (existing.totalDocs > 0) return NextResponse.json(conflict, { status: 409 })

  try {
    await payload.create({
      collection: 'appointments',
      data: {
        fullName: d.fullName,
        phone: d.phone,
        reason: d.reason,
        date: d.date,
        time: d.time,
        consent: true,
        status: 'requested',
      },
      overrideAccess: true,
    })
  } catch (err) {
    // Deux demandes simultanées : l'index unique en base refuse la seconde.
    if (err instanceof Error && err.name === 'ValidationError') {
      return NextResponse.json(conflict, { status: 409 })
    }
    console.error('Erreur lors de la création du rendez-vous :', err instanceof Error ? err.name : 'inconnue')
    return NextResponse.json({ error: 'Une erreur est survenue. Merci de réessayer.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}