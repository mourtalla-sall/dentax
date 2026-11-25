import { ClipboardList, FileText, HeartPulse, ShieldCheck } from 'lucide-react'
import { getSteps } from '@/lib/steps'

type Item = { id: string; number: number; title: string; text: string; duration?: string | null }

const ICONS = [ClipboardList, FileText, ShieldCheck, HeartPulse]

// Aperçu tant que la collection est vide.
const DEFAULT_STEPS: Item[] = [
  {
    id: 's1',
    number: 1,
    title: 'Consultation initiale & bilan',
    text: "Questionnaire médical approfondi, bilan photographique, résolution et examen panoramique pour établir un diagnostic complet.",
    duration: 'Durée : 45 minutes',
  },
  {
    id: 's2',
    number: 2,
    title: 'Plan thérapeutique & devis détaillé',
    text: "Présentation claire des options de soins, explication anatomique sur écran et remise d'un devis préalable détaillé.",
    duration: 'Transparence tarifaire totale',
  },
  {
    id: 's3',
    number: 3,
    title: 'Réalisation des actes sous asepsie contrôlée',
    text: "Soins réalisés sous anesthésie confortable, isolation complète sous champ opératoire stérile et respect de la posture du patient.",
    duration: 'Traçabilité unitaire certifiée',
  },
  {
    id: 's4',
    number: 4,
    title: 'Suivi clinique & maintenance préventive',
    text: "Contrôles périodiques programmés, réévaluation de la santé parodontale et conseils d'hygiène personnalisés.",
    duration: 'Pérennité thérapeutique',
  },
]

export async function Parcours() {
  const docs = await getSteps()

  const steps: Item[] =
    docs.length > 0
      ? docs.map((s) => ({
          id: String(s.id),
          number: s.number,
          title: s.title,
          text: s.text,
          duration: s.duration,
        }))
      : DEFAULT_STEPS

  return (
    <section id="parcours" className="scroll-mt-28 bg-peach/60 px-4 py-20 md:py-28">
      <div className="mx-auto max-w-site">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
            Votre parcours médical
          </p>
          <h2 className="mt-4 text-3xl leading-tight md:text-5xl">
            Un protocole clinique rigoureux en {steps.length} étapes
          </h2>
          <p className="mt-5 text-base leading-relaxed text-brown-soft">
            Chaque prise en charge suit une méthode établie pour garantir la transparence
            thérapeutique, l'absence d'imprévu et la pérennité des résultats.
          </p>
        </div>

        <ol className="mt-14 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {steps.map((s, i) => {
            const Icon = ICONS[i % ICONS.length]
            return (
              <li
                key={s.id}
                className="flex flex-col rounded-3xl border border-line bg-white p-7 shadow-soft"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
                    Étape {String(s.number).padStart(2, '0')}
                  </span>
                  <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint-tint text-mint-dark">
                    <Icon size={19} aria-hidden="true" />
                  </span>
                </div>

                <h3 className="mt-5 text-xl leading-snug">{s.title}</h3>
                <p className="mt-3 flex-1 text-[15px] leading-relaxed text-brown-soft">{s.text}</p>

                {s.duration && (
                  <p className="mt-6 border-t border-line pt-4 text-sm font-medium">
                    {s.duration}
                  </p>
                )}
              </li>
            )
          })}
        </ol>
      </div>
    </section>
  )
}