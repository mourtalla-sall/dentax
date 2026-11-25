import { Phone } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'

export const NAV_LINKS = [
  { href: '/#accueil', label: 'Accueil' },
  { href: '/#a-propos', label: 'À propos' },
  { href: '/#soins', label: 'Soins' },
  { href: '/#equipe', label: 'Équipe' },
  { href: '/#contact', label: 'Contact' },
]

export async function Header() {
  const s = await getSettings()
  const tel = s.phone?.replace(/\s/g, '')

  return (
    <header className="sticky top-0 z-50 px-4 pt-4">
      <div className="relative mx-auto flex max-w-site items-center justify-between rounded-full border border-white/60 bg-white/90 px-6 py-2.5 shadow-soft backdrop-blur-md md:px-8">
        <Logo name={s.clinicName ?? 'Dentax'} tagline={s.tagline} />

        <nav aria-label="Navigation principale" className="hidden md:block">
          <ul className="flex items-center gap-1 text-sm">
            {NAV_LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="rounded-full px-4 py-2 text-brown transition hover:bg-mint-tint hover:text-mint-dark"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div className="flex items-center gap-2">
          {tel && (
            <a
              href={`tel:${tel}`}
              aria-label={`Appeler le ${s.phone}`}
              className="hidden h-10 w-10 place-items-center rounded-full bg-mint-tint text-mint-dark transition hover:bg-mint sm:grid"
            >
              <Phone size={17} />
            </a>
          )}
          <a
            href="#rendez-vous"
            className="hidden rounded-full bg-mint px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-brown transition hover:bg-mint-hover md:inline-block"
          >
            Rendez-vous
          </a>
          <MobileMenu links={NAV_LINKS} cta="Prendre rendez-vous" />
        </div>
      </div>
    </header>
  )
}