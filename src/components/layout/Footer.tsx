
import { Accessibility, MapPin, Phone } from 'lucide-react'
import { formatHours, getSettings } from '@/lib/settings'
import { Logo } from './Logo'

const FOOTER_LINKS = [
  { href: '/#accueil', label: 'Accueil' },
  { href: '/#a-propos', label: 'À propos' },
  { href: '/#soins', label: 'Soins & Disciplines' },
  { href: '/#equipe', label: 'Équipe médicale' },
  { href: '/#parcours', label: 'Parcours patient' },
  { href: '/#contact', label: 'Contact & Accès' },
]

const colTitle =
  'text-xs font-semibold uppercase tracking-widest text-[#79C9A8]'

const link =
  'text-[#B7A89B] transition-colors duration-300 hover:text-[#79C9A8]'

export async function Footer() {
  const s = await getSettings()
  const hours = formatHours(s.hours)
  const tel = s.phone?.replace(/\s/g, '')

  return (
    <footer
      id="contact"
      className="mt-24 border-t border-[#3B2923] bg-[#1E120F] text-[#F5EDE4]"
    >
      <div className="mx-auto grid max-w-site gap-10 px-6 py-14 sm:grid-cols-2 lg:grid-cols-4">

        {/* Colonne 1 : identité */}
        <div>
          <Logo
            name={s.clinicName ?? 'Dentax'}
            tagline={s.tagline}
          />

          <p className="mt-5 max-w-xs text-sm leading-relaxed text-[#B7A89B]">
            L'alliance de la rigueur scientifique, des technologies de pointe et de la
            bientraitance médicale au cœur de Paris.
          </p>

          <a
            href="#rendez-vous"
            className="mt-6 inline-block rounded-full bg-[#79C9A8] px-5 py-2.5 text-xs font-semibold uppercase tracking-wide text-[#1E120F] transition duration-300 hover:bg-[#96D9BB]"
          >
            Prendre rendez-vous
          </a>
        </div>

        {/* Colonne 2 : navigation */}
        <nav aria-label="Navigation du pied de page">
          <h2 className={colTitle}>Navigation</h2>

          <ul className="mt-4 space-y-2.5 text-sm">
            {FOOTER_LINKS.map((l) => (
              <li key={l.href}>
                <a href={l.href} className={link}>
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Colonne 3 : horaires */}
        <div>
          <h2 className={colTitle}>Horaires &amp; sérénité</h2>

          <ul className="mt-4 space-y-3 text-sm">
            {hours.map((h) => (
              <li key={h.label}>
                <span className="font-semibold text-[#F5EDE4]">
                  {h.label}
                </span>
                <span className="block text-[#B7A89B]">
                  {h.time}
                </span>
              </li>
            ))}

            <li>
              <span className="font-semibold text-[#F5EDE4]">
                Dimanche &amp; fériés
              </span>
              <span className="block text-[#B7A89B]">
                Fermé (service de garde : Samu 15)
              </span>
            </li>
          </ul>
        </div>

        {/* Colonne 4 : contact */}
        <div>
          <h2 className={colTitle}>Contact &amp; accès</h2>

          <ul className="mt-4 space-y-3 text-sm text-[#B7A89B]">
            {s.address && (
              <li className="flex gap-3">
                <MapPin
                  size={17}
                  className="mt-0.5 shrink-0 text-[#79C9A8]"
                />
                <span className="whitespace-pre-line">
                  {s.address}
                </span>
              </li>
            )}

            {tel && (
              <li className="flex gap-3">
                <Phone
                  size={17}
                  className="mt-0.5 shrink-0 text-[#79C9A8]"
                />
                <a href={`tel:${tel}`} className={link}>
                  {s.phone}
                </a>
              </li>
            )}

            {s.accessibility && (
              <li className="flex gap-3">
                <Accessibility
                  size={17}
                  className="mt-0.5 shrink-0 text-[#79C9A8]"
                />
                <span>{s.accessibility}</span>
              </li>
            )}
          </ul>
        </div>
      </div>

      {/* Barre du bas */}
      <div className="border-t border-[#3B2923]">
        <div className="mx-auto flex max-w-6xl flex-col gap-3 px-6 py-5 text-xs text-[#B7A89B] sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {s.clinicName ?? 'Dentax'} Cabinet dentaire. Tous droits réservés.
          </p>

          <ul className="flex flex-wrap gap-x-5 gap-y-1">
            <li>
              <a href="/mentions-legales" className={link}>
                Mentions légales
              </a>
            </li>
            <li>
              <a href="/confidentialite" className={link}>
                Confidentialité &amp; RGPD
              </a>
            </li>
            <li>
              <a href="/deontologie" className={link}>
                Déontologie médicale
              </a>
            </li>
          </ul>
        </div>
      </div>
    </footer>
  )
}
