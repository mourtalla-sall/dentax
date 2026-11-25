'use client'

import { useState } from 'react'
import { ArrowRight, ChevronDown } from 'lucide-react'

export type SoinItem = {
  id: string
  number: string
  title: string
  summary: string
  detail?: string
}

export function SoinsList({ items }: { items: SoinItem[] }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null)

  return (
    <ul className="divide-y divide-line overflow-hidden rounded-3xl border border-line bg-white shadow-soft">
      {items.map((item) => {
        const open = openId === item.id
        return (
          <li key={item.id} className={open ? 'bg-mint-tint/50' : ''}>
            <h3 className="font-sans">
              <button
                type="button"
                onClick={() => setOpenId(open ? null : item.id)}
                aria-expanded={open}
                aria-controls={`soin-${item.id}`}
                className={`flex w-full items-start gap-4 border-l-2 px-6 py-5 text-left transition md:px-8 ${
                  open ? 'border-mint-dark' : 'border-transparent hover:bg-mint-tint/40'
                }`}
              >
                <span className="mt-1 font-serif text-sm text-mint-dark">{item.number}</span>
                <span className="flex-1 font-serif text-lg leading-snug md:text-xl">
                  {item.title}
                </span>
                <ChevronDown
                  size={18}
                  aria-hidden="true"
                  className={`mt-1.5 shrink-0 text-brown-soft transition ${open ? 'rotate-180' : ''}`}
                />
              </button>
            </h3>

            {open && (
              <div id={`soin-${item.id}`} className="px-6 pb-6 pl-16 md:px-8 md:pl-[4.5rem]">
                <p className="text-base leading-relaxed text-brown-soft">{item.summary}</p>
                {item.detail && (
                  <p className="mt-3 text-base leading-relaxed text-brown-soft">{item.detail}</p>
                )}
                <a
                  href="#rendez-vous"
                  className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-mint-dark hover:underline"
                >
                  Prendre rendez-vous <ArrowRight size={15} aria-hidden="true" />
                </a>
              </div>
            )}
          </li>
        )
      })}
    </ul>
  )
}