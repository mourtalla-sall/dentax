import Link from 'next/link'
import config from '@/payload.config'
// import '@/styles.css'



export function Logo({ name, tagline }: { name: string; tagline?: string | null }) {
  return (
    <Link href="/" className="flex items-center gap-3" aria-label={`${name} – accueil`}>
      <span className="grid h-10 w-10 place-items-center rounded-xl bg-mint">
        <svg viewBox="0 0 24 24" className="h-5 w-5 text-brown" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" aria-hidden="true">
          <path d="M7 3c-2 0-3.5 1.7-3.5 4 0 2 .8 3.2 1.4 5 .6 1.9.6 4.5 1.4 7.5.3 1 1.2 1.5 1.9 1.5 1.5 0 1.3-3.5 3.8-3.5s2.3 3.5 3.8 3.5c.7 0 1.6-.5 1.9-1.5.8-3 .8-5.6 1.4-7.5.6-1.8 1.4-3 1.4-5 0-2.3-1.5-4-3.5-4-1.8 0-3 1-5 1S8.8 3 7 3z" />
        </svg>
      </span>
      <span className="leading-tight">
        <span className="block font-serif text-xl font-semibold">{name}</span>
        {tagline && (
          <span className="block text-[11px] uppercase tracking-widest text-brown-soft">
            {tagline}
          </span>
        )}
      </span>
    </Link>
  )
}