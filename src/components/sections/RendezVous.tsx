import { Clock, Phone } from 'lucide-react'
import { formatHours, getSettings } from '@/lib/settings'
import { Calendrier } from './Calendrier'

export async function RendezVous() {
  const s = await getSettings()
  const hours = formatHours(s.hours)
  const tel = s.phone?.replace(/\s/g, '')

  return (
    <section id="rendez-vous" className="scroll-mt-28 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
            Réservation en ligne
          </p>
          <h2 className="mt-4 text-3xl leading-tight md:text-5xl">Prenez rendez-vous</h2>
          <p className="mt-5 text-base leading-relaxed text-brown-soft">
            Sélectionnez un créneau disponible dans le planning de la semaine. Réponse sous 24 h
            ouvrées.
          </p>
        </div>

        <div className="mt-12">
          <Calendrier />
        </div>

        <p className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-brown-soft">
          {tel && (
            <span className="flex items-center gap-2">
              Besoin d'aide pour réserver ?
              <Phone size={16} className="text-mint-dark" aria-hidden="true" />
              <a href={`tel:${tel}`} className="font-semibold text-brown hover:text-mint-dark">
                {s.phone}
              </a>
            </span>
          )}
          {hours[0] && (
            <span className="flex items-center gap-2">
              <Clock size={16} className="text-mint-dark" aria-hidden="true" />
              {hours[0].label} · {hours[0].time}
            </span>
          )}
        </p>
      </div>
    </section>
  )
}