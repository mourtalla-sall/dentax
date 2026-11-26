'use client'

import { useEffect, useState } from 'react'

type NavLink = { href: string; label: string }

export function NavLinks({ links }: { links: NavLink[] }) {
  const [active, setActive] = useState('')

  useEffect(() => {
    const ids = links.map((l) => l.href.replace('/#', ''))
    const els = ids
      .map((id) => document.getElementById(id))
      .filter((el): el is HTMLElement => Boolean(el))

    // Pages sans ces sections (mentions légales, etc.) : aucun lien actif.
    if (els.length === 0) return

    // Une section est "active" quand elle croise la bande centrale de l'écran.
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(e.target.id)
        })
      },
      { rootMargin: '-40% 0px -55% 0px' },
    )

    els.forEach((el) => io.observe(el))
    return () => io.disconnect()
  }, [links])

  return (
    <ul className="flex items-center gap-1 text-sm">
      {links.map((l) => {
        const isActive = active === l.href.replace('/#', '')
        return (
          <li key={l.href}>
            <a
              href={l.href}
              aria-current={isActive ? 'true' : undefined}
              className={`rounded-full px-4 py-2 font-medium transition ${
                isActive
                  ? 'bg-mint/40 text-brown'
                  : 'text-brown hover:bg-white/60 hover:text-mint-dark'
              }`}
            >
              {l.label}
            </a>
          </li>
        )
      })}
    </ul>
  )
}