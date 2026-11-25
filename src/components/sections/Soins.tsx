import Image from 'next/image'
import { BadgeCheck, Box, ShieldCheck } from 'lucide-react'
import { getHomepage } from '@/lib/homepage'
import { getServices } from '@/lib/services'
import { SoinsList, type SoinItem } from './SoinsList'

const DEFAULT_INTRO =
  "Plateau technique complet assurant un diagnostic précis et une continuité chirurgicale au sein du même établissement."

const DEFAULT_ITEMS: SoinItem[] = [
  {
    id: 'd1', number: '01',
    title: 'Prévention & Bilan Parodontal Avancé',
    summary: "Détartrage piézo-doux sans abrasion, aéropolissage sous glycine micronisée, analyse microbiologique de la plaque dentaire et dépistage tridimensionnel précoce des atteintes parodontales.",
  },
  {
    id: 'd2', number: '02',
    title: 'Dentisterie Restauratrice & Bio-Empreinte',
    summary: "Inlays, onlays et facettes feldspathiques biocompatibles posés avec précision sous digue étanche, pour assurer l'herméticité bactériologique et la pérennité mécanique.",
  },
  {
    id: 'd3', number: '03',
    title: 'Endodontie & Traitement Canalaire sous Microscope',
    summary: "Nettoyage thermo-mécanique des canaux radiculaires avec irrigation continue sous champ opératoire stérile, pour préserver la dent naturelle.",
  },
  {
    id: 'd4', number: '04',
    title: 'Chirurgie Guidée & Implantologie Zircone / Titane',
    summary: "Planification tomodensitométrique 3D préalable et pose assistée par guide stéréolithographique sur-mesure.",
  },
  {
    id: 'd5', number: '05',
    title: 'Orthodontie par Aligneurs Invisibles',
    summary: "Correction occlusale, fonctionnelle et esthétique par gouttières thermo-polymères numériques certifiées CE médical.",
  },
]

const TRUST = [
  { icon: ShieldCheck, label: 'Stérilisation certifiée' },
  { icon: Box, label: 'Imagerie 3D' },
  { icon: BadgeCheck, label: 'Protocoles HAS' },
]

export async function Soins() {
  const [{ treatments }, services] = await Promise.all([getHomepage(), getServices()])

  const image =
    typeof treatments?.image === 'object' && treatments.image ? treatments.image : null

  const items: SoinItem[] =
    services.length > 0
      ? services.map((s, i) => ({
          id: String(s.id),
          number: String(s.order ?? i + 1).padStart(2, '0'),
          title: s.title,
          summary: s.summary,
          detail: s.detail ?? undefined,
        }))
      : DEFAULT_ITEMS

  return (
    <section id="soins" className="scroll-mt-28 bg-peach/60 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-site">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
              Disciplines &amp; protocoles médicaux
            </p>
            <h2 className="mt-4 max-w-xl text-3xl leading-tight md:text-5xl">
              {treatments?.title ?? 'Des soins de haute précision fondés sur la biologie'}
            </h2>
          </div>
          <p className="text-base leading-relaxed text-brown-soft lg:ml-auto lg:max-w-md">
            {treatments?.intro || DEFAULT_INTRO}
          </p>
        </div>

        <div className="mt-12 grid items-stretch gap-6 lg:grid-cols-[45fr_55fr]">
          {/* Photo : même hauteur que la liste */}
          <div className="relative min-h-[380px] overflow-hidden rounded-3xl bg-white shadow-soft">
            {image?.url && (
              <Image
                src={image.url}
                alt={image.alt ?? ''}
                fill
                sizes="(min-width: 1024px) 45vw, 100vw"
                className="object-cover object-[60%_center]"
              />
            )}
            {treatments?.badge && (
              <div className="absolute bottom-5 left-5 right-5 rounded-2xl bg-white/90 px-4 py-3 text-sm font-semibold shadow-soft backdrop-blur-md sm:right-auto">
                {treatments.badge}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-5">
            <SoinsList items={items} />

            <ul className="flex flex-wrap gap-x-6 gap-y-3 px-2">
              {TRUST.map(({ icon: Icon, label }) => (
                <li key={label} className="flex items-center gap-2 text-sm text-brown-soft">
                  <Icon size={18} className="text-mint-dark" aria-hidden="true" />
                  {label}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}