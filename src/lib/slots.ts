import type { SiteSetting } from '@/payload-types'

type Settings = Pick<SiteSetting, 'hours' | 'breakStart' | 'breakEnd' | 'slotMinutes'>

export const TIMEZONE = 'Europe/Paris'
/** Délai minimal entre maintenant et un créneau réservable (minutes). */
export const MIN_LEAD_MINUTES = 120

export function isValidDate(s: string): boolean {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(s)) return false
  const d = new Date(`${s}T00:00:00Z`)
  return !Number.isNaN(d.getTime()) && d.toISOString().slice(0, 10) === s
}

export function addDays(date: string, n: number): string {
  const d = new Date(`${date}T00:00:00Z`)
  d.setUTCDate(d.getUTCDate() + n)
  return d.toISOString().slice(0, 10)
}

/** 0 = dimanche … 6 = samedi (même convention que le champ "day" des horaires). */
export function weekday(date: string): number {
  return new Date(`${date}T00:00:00Z`).getUTCDay()
}

export function mondayOf(date: string): string {
  const wd = weekday(date)
  return addDays(date, wd === 0 ? -6 : 1 - wd)
}

const toMinutes = (t: string) => {
  const [h, m] = t.split(':').map(Number)
  return h * 60 + m
}

const toTime = (min: number) =>
  `${String(Math.floor(min / 60)).padStart(2, '0')}:${String(min % 60).padStart(2, '0')}`

/** Date et heure actuelles à Paris, indépendamment du fuseau du serveur. */
export function nowInParis() {
  const parts = new Intl.DateTimeFormat('en-CA', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(new Date())
  const get = (type: string) => parts.find((p) => p.type === type)!.value
  return {
    date: `${get('year')}-${get('month')}-${get('day')}`,
    minutes: (Number(get('hour')) % 24) * 60 + Number(get('minute')),
  }
}

/** Créneaux théoriques d'une journée, d'après les horaires du cabinet. */
export function generateDaySlots(settings: Settings, date: string): string[] {
  const row = settings.hours?.find((h) => h.day === String(weekday(date)))
  if (!row) return [] // aucun horaire saisi = jour fermé

  const step = settings.slotMinutes || 30
  const open = toMinutes(row.open)
  const close = toMinutes(row.close)
  if (Number.isNaN(open) || Number.isNaN(close)) return []

  const bs = settings.breakStart ? toMinutes(settings.breakStart) : NaN
  const be = settings.breakEnd ? toMinutes(settings.breakEnd) : NaN
  // La pause ne s'applique qu'aux journées qui reprennent après elle
  // (le samedi 09:00-14:00 n'est donc pas coupé).
  const hasBreak = !Number.isNaN(bs) && !Number.isNaN(be) && close > be

  const slots: string[] = []
  for (let m = open; m + step <= close; m += step) {
    if (hasBreak && m < be && m + step > bs) continue
    slots.push(toTime(m))
  }
  return slots
}

export function isPastSlot(date: string, time: string, now = nowInParis()): boolean {
  if (date < now.date) return true
  if (date > now.date) return false
  return toMinutes(time) < now.minutes + MIN_LEAD_MINUTES
}