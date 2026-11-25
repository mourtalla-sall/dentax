import { getPayload } from 'payload'
import config from '@payload-config'
import type { SiteSetting } from '@/payload-types'

export async function getSettings(): Promise<SiteSetting> {
  const payload = await getPayload({ config })
  return payload.findGlobal({ slug: 'site-settings' })
}

const DAYS: Record<string, string> = {
  '1': 'Lun', '2': 'Mar', '3': 'Mer', '4': 'Jeu', '5': 'Ven', '6': 'Sam', '0': 'Dim',
}

/** Regroupe les jours consécutifs qui ont les mêmes horaires : "Lun – Ven · 08:30 – 19:30" */
export function formatHours(hours: SiteSetting['hours']): { label: string; time: string }[] {
  const rows = (hours ?? [])
    .map((h) => ({ day: Number(h.day), open: h.open, close: h.close }))
    .sort((a, b) => a.day - b.day)

  const groups: { start: number; end: number; open: string; close: string }[] = []
  for (const r of rows) {
    const last = groups[groups.length - 1]
    if (last && last.end === r.day - 1 && last.open === r.open && last.close === r.close) {
      last.end = r.day
    } else {
      groups.push({ start: r.day, end: r.day, open: r.open, close: r.close })
    }
  }

  return groups.map((g) => ({
    label:
      g.start === g.end
        ? DAYS[String(g.start)]
        : `${DAYS[String(g.start)]} – ${DAYS[String(g.end)]}`,
    time: `${g.open} – ${g.close}`,
  }))
}