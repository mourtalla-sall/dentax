import { Phone } from 'lucide-react'
import { getSettings } from '@/lib/settings'
import { Logo } from './Logo'
import { MobileMenu } from './MobileMenu'
import { NavLinks } from './NavLinks'

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
    <header className="fixed inset-x-0 top-0 z-50 px-4 pt-8">
      {/* Retrait horizontal : la barre reste à l'intérieur de la carte du hero */}
      <div className="mx-auto max-w-site px-5">
        <div className="relative flex items-center justify-between rounded-full border border-white/50 bg-white/70 px-5 py-2.5 shadow-soft backdrop-blur-xl md:px-7">
          <Logo name={s.clinicName ?? 'Dentax'} tagline={s.tagline} />

          <nav aria-label="Navigation principale" className="hidden md:block">
            <NavLinks links={NAV_LINKS} />
          </nav>

          <div className="flex items-center gap-2">
            {tel && (
              <a
                href={`tel:${tel}`}
                aria-label={`Appeler le ${s.phone}`}
                className="hidden h-10 w-10 place-items-center rounded-full bg-mint-tint/80 text-mint-dark transition hover:bg-mint sm:grid"
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
      </div>
    </header>
  )
}