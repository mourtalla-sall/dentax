import Image from 'next/image'
import { BadgeCheck, Stethoscope, UserRound } from 'lucide-react'
import { getPractitioners } from '@/lib/practitioners'

type Card = {
  id: string
  name: string
  specialty: string
  rpps?: string | null
  diplomas?: string | null
  scope?: string | null
  convention?: string | null
  photoUrl?: string | null
  photoAlt?: string | null
}

// Aperçu tant que la collection est vide : à remplacer par les vrais praticiens.
const PLACEHOLDERS: Card[] = [
  {
    id: 'p1',
    name: 'Dr. Prénom Nom',
    specialty: 'Chirurgien-dentiste · Omnipratique',
    rpps: 'À renseigner',
    diplomas: 'Diplômes et parcours à renseigner dans l’administration.',
    scope: 'Champs d’intervention à renseigner.',
    convention: 'Prise en charge conventionnée secteur 1',
  },
  {
    id: 'p2',
    name: 'Dr. Prénom Nom',
    specialty: 'Chirurgien-dentiste · Implantologie',
    rpps: 'À renseigner',
    diplomas: 'Diplômes et parcours à renseigner dans l’administration.',
    scope: 'Champs d’intervention à renseigner.',
    convention: 'Prise en charge conventionnée secteur 1',
  },
]

export async function Equipe() {
  const docs = await getPractitioners()

  const cards: Card[] =
    docs.length > 0
      ? docs.map((p) => {
          const photo = typeof p.photo === 'object' && p.photo ? p.photo : null
          return {
            id: String(p.id),
            name: p.name,
            specialty: p.specialty,
            rpps: p.rpps,
            diplomas: p.diplomas,
            scope: p.scope,
            convention: p.convention,
            photoUrl: photo?.url,
            photoAlt: photo?.alt,
          }
        })
      : PLACEHOLDERS

  return (
    <section id="equipe" className="scroll-mt-28 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
            Praticiens &amp; chirurgiens-dentistes
          </p>
          <h2 className="mt-4 text-3xl leading-tight md:text-5xl">
            Une équipe collégiale inscrite à l'Ordre des Chirurgiens-Dentistes
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brown-soft">
            Nos praticiens allient formation universitaire hospitalière de premier plan et mise
            à jour continue de leurs compétences techniques.
          </p>
        </div>

        <div className="mt-14 grid gap-8 md:grid-cols-2">
          {cards.map((p) => (
            <article
              key={p.id}
              className="overflow-hidden rounded-3xl border border-line bg-white shadow-soft"
            >
              <div className="relative aspect-[4/3] bg-peach">
                {p.photoUrl ? (
                  <Image
                    src={p.photoUrl}
                    alt={p.photoAlt ?? p.name}
                    fill
                    sizes="(min-width: 768px) 50vw, 100vw"
                    className="object-cover object-top"
                  />
                ) : (
                  <div className="grid h-full place-items-center text-brown-soft/40">
                    <UserRound size={72} aria-hidden="true" />
                  </div>
                )}
                {p.rpps && (
                  <span className="absolute right-4 top-4 rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold shadow-soft backdrop-blur-md">
                    RPPS : {p.rpps}
                  </span>
                )}
              </div>

              <div className="p-7 md:p-9">
                <p className="inline-flex items-center gap-2 rounded-full bg-mint-tint px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-mint-dark">
                  <BadgeCheck size={14} aria-hidden="true" />
                  Ordre national des chirurgiens-dentistes
                </p>

                <h3 className="mt-4 text-2xl">{p.name}</h3>
                <p className="mt-1 text-xs font-semibold uppercase tracking-widest text-mint-dark">
                  {p.specialty}
                </p>

                {p.diplomas && (
                  <p className="mt-4 text-[15px] leading-relaxed text-brown-soft">{p.diplomas}</p>
                )}
                {p.scope && (
                  <p className="mt-3 text-[15px] leading-relaxed text-brown-soft">
                    <span className="font-semibold text-brown">Champs d'intervention : </span>
                    {p.scope}
                  </p>
                )}

                {p.convention && (
                  <p className="mt-6 flex items-center gap-2 border-t border-line pt-5 text-sm font-medium">
                    <Stethoscope size={17} className="text-mint-dark" aria-hidden="true" />
                    {p.convention}
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}