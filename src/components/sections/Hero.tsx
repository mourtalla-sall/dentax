import Image from 'next/image'
import { ArrowRight, CalendarDays, ShieldCheck } from 'lucide-react'
import { getHomepage } from '@/lib/homepage'

const FALLBACK_TEXT =
  "Notre équipe de professionnels s'engage à vous offrir des soins dentaires personnalisés, de haute qualité, dans un cadre confortable et chaleureux."

export async function Hero() {
  const { hero } = await getHomepage()

  const image = typeof hero?.image === 'object' && hero.image ? hero.image : null

  return (
    <section id="accueil" className="px-4 pt-4">
      <div className="relative mx-auto flex min-h-[560px] max-w-site items-center overflow-hidden rounded-3xl bg-brown md:min-h-[720px]">
        {/* Photo */}
        {image?.url && (
          <Image
            src={image.url}
            alt={image.alt ?? ''}
            fill
            priority
            sizes="(min-width: 1440px) 1408px, 100vw"
            className="object-cover object-right"
          />
        )}

        {/* Voile sombre : fort à gauche, transparent à droite */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-brown/80 via-brown/40 to-transparent md:via-brown/30"
        />
        <div aria-hidden="true" className="absolute inset-0 bg-brown/10" />

        {/* Contenu : espace en haut pour la navbar flottante sur mobile */}
        <div className="relative z-10 w-full px-6 pb-16 pt-32 md:px-16 md:py-16">
          <div className="max-w-xl">
            <p className="inline-flex items-center gap-2 rounded-full border border-white/25 bg-white/15 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-widest text-white backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-mint" />
              {hero?.pill ?? 'Un sourire confiant commence ici'}
            </p>

            <h1 className="mt-5 text-4xl leading-[1.1] text-white md:text-5xl lg:text-6xl">
              {hero?.title ?? 'Créer de beaux sourires avec la touche personnelle'}
            </h1>

            <p className="mt-5 max-w-md text-base leading-relaxed text-white/90 md:text-lg">
              {hero?.text || FALLBACK_TEXT}
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <a
                href="#rendez-vous"
                className="inline-flex items-center gap-2 rounded-lg bg-mint px-5 py-3 text-sm font-semibold text-brown transition hover:bg-mint-hover"
              >
                <CalendarDays size={16} aria-hidden="true" />
                {hero?.primaryCta ?? 'Prendre rendez-vous'}
                <ArrowRight size={16} aria-hidden="true" />
              </a>
              <a
                href="#soins"
                className="inline-flex items-center rounded-lg border border-white/40 bg-white/15 px-5 py-3 text-sm font-semibold text-white backdrop-blur-sm transition hover:bg-white/25"
              >
                {hero?.secondaryCta ?? 'Consulter les soins'}
              </a>
            </div>
          </div>
        </div>

        {/* Badge en bas à droite */}
        {hero?.badge && (
          <div className="absolute bottom-5 right-5 z-10 hidden items-center gap-3 rounded-2xl bg-white/90 px-4 py-3 shadow-soft backdrop-blur-md sm:flex">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-mint-tint text-mint-dark">
              <ShieldCheck size={18} aria-hidden="true" />
            </span>
            <span className="text-sm font-semibold">{hero.badge}</span>
          </div>
        )}
      </div>
    </section>
  )
}