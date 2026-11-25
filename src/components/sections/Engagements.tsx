import Image from 'next/image'
import { Activity, CheckCircle2, ShieldCheck } from 'lucide-react'
import { getHomepage } from '@/lib/homepage'

const DEFAULT_TITLE = "L'alliance de la rigueur scientifique et de la bientraitance médicale."
const DEFAULT_INTRO =
  "Chaque protocole thérapeutique s'appuie sur les données acquises de la science, validé collégialement pour assurer sécurité sanitaire maximale et confort absolu du patient."

const DEFAULT_CARDS = [
  {
    tag: 'Stérilisation hospitalière',
    title: 'Sécurité Sanitaire & Asepsie Rigoureuse',
    text: 'Salle de stérilisation dédiée avec chaîne de décontamination automatisée, autoclaves de classe B à traçabilité informatique unitaire et protocoles stricts conformes aux recommandations HAS.',
    checks: [
      'Double ensachage hermétique thermo-soudé avec indicateurs de virage',
      'Contrôles microbiologiques & bactériologiques réguliers certifiés',
      'Matériaux biomimétiques biocompatibles sans métaux lourds ni BPA',
    ],
    pills: ['Norme EN 13060', 'Conforme HAS', 'Traçabilité unitaire'],
  },
  {
    tag: 'Anesthésie assistée par ordinateur',
    title: 'Dentisterie Conservatrice & Gestion de la Douleur',
    text: 'Priorité absolue à la préservation du capital tissulaire naturel par des techniques micro-invasives sous grossissement optique. Prise en charge individualisée des patients phobiques sous anesthésie feutrée.',
    checks: [
      'Préservation pulpaire et parodontale tissulaire maximale',
      'Micro-chirurgie guidée par imagerie 3D et magnification optique',
      'Écoute attentive sans réprimande & sédation consciente au besoin',
    ],
    pills: ['Imagerie 3D Cone Beam', 'Microscope opératoire', 'Anesthésie Quicksleeper'],
  },
]

const ICONS = [ShieldCheck, Activity]

export async function Engagements() {
  const { commitments } = await getHomepage()

  const image =
    typeof commitments?.image === 'object' && commitments.image ? commitments.image : null

  const adminCards = commitments?.cards ?? []
  const cards =
    adminCards.length > 0
      ? adminCards.map((c) => ({
          tag: c.tag ?? '',
          title: c.title,
          text: c.text ?? '',
          checks: (c.checks ?? []).map((x) => x.label),
          pills: (c.pills ?? []).map((x) => x.label),
        }))
      : DEFAULT_CARDS

  return (
    <section id="a-propos" className="scroll-mt-28 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-site">
        {/* En-tête */}
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
              {commitments?.eyebrow ?? 'Déontologie & engagements cliniques'}
            </p>
            <h2 className="mt-4 max-w-xl text-3xl leading-tight md:text-5xl">
              {commitments?.title ?? DEFAULT_TITLE}
            </h2>
          </div>
          <p className="border-l-2 border-mint pl-5 text-base italic leading-relaxed text-brown-soft lg:ml-auto lg:max-w-md">
            {commitments?.intro || DEFAULT_INTRO}
          </p>
        </div>

        {/* Cartes + photo de même hauteur */}
        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[55fr_45fr]">
          <div className="flex flex-col gap-6">
            {cards.map((card, i) => {
              const Icon = ICONS[i % ICONS.length]
              return (
                <article
                  key={card.title}
                  className="flex flex-1 flex-col rounded-3xl border border-line bg-white p-7 shadow-soft md:p-9"
                >
                  <div className="flex items-start justify-between gap-4">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-mint-tint text-mint-dark">
                      <Icon size={22} aria-hidden="true" />
                    </span>
                    {card.tag && (
                      <span className="text-right text-xs font-medium text-brown-soft">
                        {card.tag}
                      </span>
                    )}
                  </div>

                  <h3 className="mt-5 text-2xl leading-snug">{card.title}</h3>
                  {card.text && (
                    <p className="mt-3 text-base leading-relaxed text-brown-soft">{card.text}</p>
                  )}

                  {card.checks.length > 0 && (
                    <ul className="mt-6 space-y-3 border-t border-line pt-6">
                      {card.checks.map((label) => (
                        <li key={label} className="flex gap-3 text-[15px] leading-snug">
                          <CheckCircle2
                            size={18}
                            className="mt-0.5 shrink-0 text-mint-dark"
                            aria-hidden="true"
                          />
                          <span>{label}</span>
                        </li>
                      ))}
                    </ul>
                  )}

                  {card.pills.length > 0 && (
                    <ul className="mt-6 flex flex-wrap gap-2">
                      {card.pills.map((label) => (
                        <li
                          key={label}
                          className="rounded-full border border-mint/60 bg-mint-tint px-3 py-1 text-xs font-medium text-mint-dark"
                        >
                          {label}
                        </li>
                      ))}
                    </ul>
                  )}
                </article>
              )
            })}
          </div>

          {/* Photo : même hauteur que le bloc des cartes */}
          <div className="relative min-h-[420px] overflow-hidden rounded-3xl bg-peach shadow-soft">
            {image?.url && (
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-center"
              />
            )}
            <div className="absolute bottom-5 left-5 flex items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur-md">
              <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-tint text-mint-dark">
                <ShieldCheck size={18} aria-hidden="true" />
              </span>
              <span className="text-sm font-semibold">
                Stérilisation certifiée · Protocoles HAS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}