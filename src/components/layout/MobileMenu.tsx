'use client'

import { useState } from 'react'
import { Menu, X } from 'lucide-react'

type NavLink = { href: string; label: string }

export function MobileMenu({ links, cta }: { links: NavLink[]; cta: string }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="mobile-nav"
        aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
        className="grid h-10 w-10 place-items-center rounded-full border border-line bg-white"
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      {open && (
        <nav
          id="mobile-nav"
          className="absolute inset-x-4 top-full mt-2 rounded-2xl border border-line bg-white p-4 shadow-soft"
        >
          <ul className="flex flex-col">
            {links.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  onClick={() => setOpen(false)}
                  className="block rounded-lg px-3 py-3 text-base hover:bg-mint-tint"
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <a
            href="#rendez-vous"
            onClick={() => setOpen(false)}
            className="mt-3 block rounded-lg bg-mint px-4 py-3 text-center text-sm font-semibold text-brown hover:bg-mint-hover"
          >
            {cta}
          </a>
        </nav>
      )}
    </div>
  )
}