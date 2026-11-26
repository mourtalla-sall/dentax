'use client'

import { useEffect, useMemo, useState } from 'react'
import { CalendarCheck, CheckCircle2, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react'
import { addDays, mondayOf } from '@/lib/slots'

type Slot = { time: string; available: boolean }
type Day = { date: string; open: boolean; slots: Slot[] }
type Week = { week: string; today: string; days: Day[] }
type Selected = { date: string; time: string }

const REASONS = [
  { value: 'first', label: 'Première consultation' },
  { value: 'checkup', label: 'Contrôle' },
  { value: 'urgent', label: 'Urgence' },
  { value: 'other', label: 'Autre' },
]

const MAX_WEEKS_AHEAD = 12

/** Formate une date AAAA-MM-JJ sans décalage de fuseau. */
function fmt(date: string, options: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat('fr-FR', { timeZone: 'UTC', ...options }).format(
    new Date(`${date}T00:00:00Z`),
  )
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1)

const inputClass =
  'mt-1.5 w-full rounded-lg border border-line bg-white px-4 py-3 text-base outline-none transition placeholder:text-brown-soft/50 focus:border-mint-dark focus:ring-2 focus:ring-mint/40'

export function Calendrier() {
  const [week, setWeek] = useState<string | null>(null)
  const [reloadKey, setReloadKey] = useState(0)
  const [data, setData] = useState<Week | null>(null)
  const [loading, setLoading] = useState(true)
  const [loadError, setLoadError] = useState(false)

  const [activeDay, setActiveDay] = useState<string | null>(null)
  const [selected, setSelected] = useState<Selected | null>(null)

  const [fullName, setFullName] = useState('')
  const [phone, setPhone] = useState('')
  const [reason, setReason] = useState('first')
  const [consent, setConsent] = useState(false)
  const [website, setWebsite] = useState('') // champ piège anti-robot
  const [submitting, setSubmitting] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)
  const [success, setSuccess] = useState<Selected | null>(null)

  /* Chargement des créneaux de la semaine */
  useEffect(() => {
    const ctrl = new AbortController()
    setLoading(true)
    setLoadError(false)

    fetch(`/api/availability${week ? `?week=${week}` : ''}`, {
      signal: ctrl.signal,
      cache: 'no-store',
    })
      .then((r) => {
        if (!r.ok) throw new Error('HTTP')
        return r.json() as Promise<Week>
      })
      .then(setData)
      .catch((e) => {
        if (e.name !== 'AbortError') setLoadError(true)
      })
      .finally(() => {
        if (!ctrl.signal.aborted) setLoading(false)
      })

    return () => ctrl.abort()
  }, [week, reloadKey])

  /* Jour affiché sur mobile : le jour courant s'il est libre, sinon le premier jour avec des créneaux */
  useEffect(() => {
    if (!data) return
    setActiveDay((cur) => {
      if (cur && data.days.some((d) => d.date === cur)) return cur
      const firstFree = data.days.find((d) => d.slots.some((s) => s.available))
      return (firstFree ?? data.days[0]).date
    })
  }, [data])

  const times = useMemo(
    () =>
      Array.from(new Set(data?.days.flatMap((d) => d.slots.map((s) => s.time)) ?? [])).sort(),
    [data],
  )

  const lookup = useMemo(() => {
    const map = new Map<string, Map<string, boolean>>()
    data?.days.forEach((d) =>
      map.set(d.date, new Map(d.slots.map((s) => [s.time, s.available]))),
    )
    return map
  }, [data])

  const minMonday = data ? mondayOf(data.today) : null
  const canPrev = Boolean(data && minMonday && data.week > minMonday)
  const canNext = Boolean(
    data && minMonday && addDays(data.week, 7) <= addDays(minMonday, 7 * MAX_WEEKS_AHEAD),
  )

  const weekLabel = data
    ? `${fmt(data.days[0].date, { day: 'numeric' })} – ${fmt(data.days[6].date, {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })}`
    : ''

  function goTo(delta: number) {
    if (!data) return
    setWeek(addDays(data.week, delta * 7))
  }

  function choose(date: string, time: string) {
    setSelected({ date, time })
    setSuccess(null)
    setFormError(null)
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selected) return
    setSubmitting(true)
    setFormError(null)

    try {
      const res = await fetch('/api/book', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ fullName, phone, reason, ...selected, consent, website }),
      })
      const json = (await res.json().catch(() => ({}))) as { error?: string }

      if (res.ok) {
        setSuccess(selected)
        setSelected(null)
        setFullName('')
        setPhone('')
        setReason('first')
        setConsent(false)
        setReloadKey((k) => k + 1)
      } else {
        setFormError(json.error ?? 'Une erreur est survenue. Merci de réessayer.')
        if (res.status === 409) {
          setSelected(null)
          setReloadKey((k) => k + 1)
        }
      }
    } catch {
      setFormError('Connexion impossible. Vérifiez votre réseau et réessayez.')
    } finally {
      setSubmitting(false)
    }
  }

  const slotBase =
    'rounded-lg px-2 py-2.5 text-center text-sm font-medium transition focus-visible:outline-2'
  const active = activeDay ? data?.days.find((d) => d.date === activeDay) : null

  return (
    <div className="grid items-start gap-6 lg:grid-cols-[1fr_22rem]">
      {/* ───────── Calendrier ───────── */}
      <div className="rounded-3xl border border-line bg-white p-5 shadow-soft md:p-8">
        {/* Barre de navigation */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <p className="font-serif text-2xl md:text-3xl">
              {data ? capitalize(fmt(data.week, { month: 'long', year: 'numeric' })) : 'Chargement…'}
            </p>
            <p className="mt-0.5 text-sm text-brown-soft">{weekLabel}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => goTo(-1)}
              disabled={!canPrev}
              aria-label="Semaine précédente"
              className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-mint-tint disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              onClick={() => goTo(1)}
              disabled={!canNext}
              aria-label="Semaine suivante"
              className="grid h-10 w-10 place-items-center rounded-full border border-line transition hover:bg-mint-tint disabled:cursor-not-allowed disabled:opacity-40"
            >
              <ChevronRight size={18} />
            </button>
            <button
              type="button"
              onClick={() => setWeek(null)}
              className="rounded-full border border-mint px-4 py-2 text-sm font-semibold text-mint-dark transition hover:bg-mint-tint"
            >
              Aujourd'hui
            </button>
          </div>
        </div>

        {/* États de chargement / erreur */}
        {loadError && (
          <div role="alert" className="mt-8 rounded-xl bg-peach p-5 text-sm">
            Impossible de charger les créneaux.{' '}
            <button
              type="button"
              onClick={() => setReloadKey((k) => k + 1)}
              className="font-semibold text-mint-dark underline"
            >
              Réessayer
            </button>
          </div>
        )}

        {!loadError && !data && (
          <div className="mt-8 flex items-center gap-3 text-sm text-brown-soft" role="status">
            <Loader2 size={18} className="animate-spin" /> Chargement des disponibilités…
          </div>
        )}

        {data && !loadError && (
          <div className={loading ? 'opacity-60 transition' : 'transition'} aria-busy={loading}>
            {/* ── Grille ordinateur ── */}
            <div className="mt-6 hidden overflow-x-auto md:block">
              <div className="grid min-w-[640px] grid-cols-[3.5rem_repeat(7,minmax(0,1fr))] gap-x-2 gap-y-2">
                <div />
                {data.days.map((d) => (
                  <div
                    key={d.date}
                    className={`rounded-xl py-2 text-center ${
                      d.date === data.today ? 'bg-mint-tint' : ''
                    }`}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-widest text-brown-soft">
                      {fmt(d.date, { weekday: 'short' }).replace('.', '')}
                    </p>
                    <p
                      className={`mt-0.5 font-serif text-xl ${
                        d.open ? '' : 'text-brown-soft/40'
                      }`}
                    >
                      {fmt(d.date, { day: 'numeric' })}
                    </p>
                    {!d.open && <p className="text-[10px] text-brown-soft/60">Fermé</p>}
                  </div>
                ))}

                {times.map((time) => (
                  <Row key={time} time={time}>
                    {data.days.map((d) => {
                      const state = lookup.get(d.date)?.get(time)
                      const isSel = selected?.date === d.date && selected.time === time
                      const label = `${capitalize(
                        fmt(d.date, { weekday: 'long', day: 'numeric', month: 'long' }),
                      )} à ${time}`

                      if (state === undefined) {
                        return (
                          <span key={d.date} aria-hidden="true" className="text-center text-brown-soft/25">
                            ·
                          </span>
                        )
                      }
                      if (!state) {
                        return (
                          <span
                            key={d.date}
                            className={`${slotBase} bg-peach/70 text-brown-soft/50 line-through`}
                          >
                            {time}
                            <span className="sr-only"> – {label}, indisponible</span>
                          </span>
                        )
                      }
                      return (
                        <button
                          key={d.date}
                          type="button"
                          onClick={() => choose(d.date, time)}
                          aria-pressed={isSel}
                          aria-label={label}
                          className={`${slotBase} border ${
                            isSel
                              ? 'border-mint bg-mint text-brown shadow-soft'
                              : 'border-mint/60 bg-mint-tint text-mint-dark hover:bg-mint hover:text-brown'
                          }`}
                        >
                          {time}
                        </button>
                      )
                    })}
                  </Row>
                ))}
              </div>
            </div>

            {/* ── Vue jour mobile ── */}
            <div className="mt-6 md:hidden">
              <div className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-2" role="tablist" aria-label="Jours de la semaine">
                {data.days.map((d) => {
                  const isActive = d.date === activeDay
                  return (
                    <button
                      key={d.date}
                      type="button"
                      role="tab"
                      aria-selected={isActive}
                      onClick={() => setActiveDay(d.date)}
                      className={`shrink-0 rounded-xl border px-4 py-2 text-center transition ${
                        isActive ? 'border-mint bg-mint text-brown' : 'border-line bg-white'
                      } ${d.open ? '' : 'opacity-50'}`}
                    >
                      <span className="block text-[11px] font-semibold uppercase tracking-widest">
                        {fmt(d.date, { weekday: 'short' }).replace('.', '')}
                      </span>
                      <span className="block font-serif text-lg">
                        {fmt(d.date, { day: 'numeric' })}
                      </span>
                    </button>
                  )
                })}
              </div>

              {active && (
                <div className="mt-4" role="tabpanel">
                  <p className="text-sm font-semibold">
                    {capitalize(fmt(active.date, { weekday: 'long', day: 'numeric', month: 'long' }))}
                  </p>
                  {active.slots.length === 0 ? (
                    <p className="mt-3 rounded-xl bg-peach p-4 text-sm text-brown-soft">
                      Le cabinet est fermé ce jour-là.
                    </p>
                  ) : (
                    <div className="mt-3 grid grid-cols-3 gap-2">
                      {active.slots.map((s) => {
                        const isSel = selected?.date === active.date && selected.time === s.time
                        return s.available ? (
                          <button
                            key={s.time}
                            type="button"
                            onClick={() => choose(active.date, s.time)}
                            aria-pressed={isSel}
                            className={`${slotBase} border ${
                              isSel
                                ? 'border-mint bg-mint text-brown'
                                : 'border-mint/60 bg-mint-tint text-mint-dark'
                            }`}
                          >
                            {s.time}
                          </button>
                        ) : (
                          <span
                            key={s.time}
                            className={`${slotBase} bg-peach/70 text-brown-soft/50 line-through`}
                          >
                            {s.time}
                            <span className="sr-only"> indisponible</span>
                          </span>
                        )
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Légende */}
            <ul className="mt-7 flex flex-wrap gap-x-6 gap-y-2 text-xs text-brown-soft">
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded border border-mint/60 bg-mint-tint" /> Disponible
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-mint" /> Sélectionné
              </li>
              <li className="flex items-center gap-2">
                <span className="h-3 w-3 rounded bg-peach" /> Indisponible
              </li>
            </ul>
          </div>
        )}
      </div>

      {/* ───────── Panneau de réservation ───────── */}
      <aside
        aria-label="Réservation"
        className="rounded-3xl border border-line bg-white p-6 shadow-soft md:p-7 lg:sticky lg:top-28"
      >
        {success ? (
          <div role="status" className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint-tint text-mint-dark">
              <CheckCircle2 size={28} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-2xl">Rendez-vous demandé</h3>
            <p className="mt-2 text-sm leading-relaxed text-brown-soft">
              {capitalize(fmt(success.date, { weekday: 'long', day: 'numeric', month: 'long' }))} à{' '}
              {success.time}.<br />
              Le cabinet vous confirme ce créneau par téléphone sous 24 h ouvrées.
            </p>
            <button
              type="button"
              onClick={() => setSuccess(null)}
              className="mt-5 text-sm font-semibold text-mint-dark underline"
            >
              Prendre un autre rendez-vous
            </button>
          </div>
        ) : selected ? (
          <form onSubmit={onSubmit} noValidate={false}>
            <div className="flex items-start gap-3 rounded-2xl bg-mint-tint p-4">
              <CalendarCheck size={20} className="mt-0.5 shrink-0 text-mint-dark" aria-hidden="true" />
              <div>
                <p className="text-xs font-semibold uppercase tracking-widest text-mint-dark">
                  Créneau sélectionné
                </p>
                <p className="mt-1 text-sm font-semibold">
                  {capitalize(fmt(selected.date, { weekday: 'long', day: 'numeric', month: 'long' }))}{' '}
                  · {selected.time}
                </p>
              </div>
            </div>

            <label className="mt-5 block text-sm font-semibold">
              Nom &amp; prénom
              <input
                required
                minLength={2}
                maxLength={100}
                autoComplete="name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Ex. Thomas Renaud"
                className={inputClass}
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Téléphone
              <input
                required
                type="tel"
                inputMode="tel"
                autoComplete="tel"
                pattern="[0-9 .+()\-]{8,20}"
                title="8 à 20 chiffres, espaces autorisés"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="06 12 34 56 78"
                className={inputClass}
              />
            </label>

            <label className="mt-4 block text-sm font-semibold">
              Type de consultation
              <select
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                className={inputClass}
              >
                {REASONS.map((r) => (
                  <option key={r.value} value={r.value}>
                    {r.label}
                  </option>
                ))}
              </select>
            </label>

            {/* Champ piège : invisible pour un humain, rempli par les robots */}
            <div aria-hidden="true" className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
              <label>
                Ne pas remplir
                <input
                  tabIndex={-1}
                  autoComplete="off"
                  value={website}
                  onChange={(e) => setWebsite(e.target.value)}
                />
              </label>
            </div>

            <label className="mt-5 flex cursor-pointer items-start gap-3 text-[13px] leading-snug text-brown-soft">
              <input
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#4e9c7c]"
              />
              <span>
                J'accepte que ces informations soient utilisées pour gérer ma demande de
                rendez-vous.{' '}
                <a href="/confidentialite" className="font-semibold text-mint-dark underline">
                  Politique de confidentialité
                </a>
                .
              </span>
            </label>

            {formError && (
              <p role="alert" className="mt-4 rounded-lg bg-peach p-3 text-sm">
                {formError}
              </p>
            )}

            <button
              type="submit"
              disabled={submitting || !consent}
              className="mt-5 flex w-full items-center justify-center gap-2 rounded-lg bg-mint px-5 py-3.5 text-sm font-semibold text-brown transition hover:bg-mint-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {submitting && <Loader2 size={16} className="animate-spin" aria-hidden="true" />}
              Confirmer le rendez-vous
            </button>

            <button
              type="button"
              onClick={() => setSelected(null)}
              className="mt-3 w-full text-center text-sm text-brown-soft underline"
            >
              Choisir un autre créneau
            </button>

            <p className="mt-4 text-xs leading-relaxed text-brown-soft">
              Ne mentionnez pas de détails médicaux dans ce formulaire : le praticien les abordera
              avec vous lors de la consultation.
            </p>
          </form>
        ) : (
          <div className="text-center">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-mint-tint text-mint-dark">
              <CalendarCheck size={26} aria-hidden="true" />
            </span>
            <h3 className="mt-4 text-2xl">Choisissez un créneau</h3>
            <p className="mt-2 text-sm leading-relaxed text-brown-soft">
              Sélectionnez une disponibilité dans le calendrier : il ne reste ensuite que trois
              champs à remplir.
            </p>
          </div>
        )}
      </aside>
    </div>
  )
}

/** Une ligne de la grille : l'heure, puis une cellule par jour. */
function Row({ time, children }: { time: string; children: React.ReactNode }) {
  return (
    <>
      <span className="self-center text-right text-xs font-medium text-brown-soft">{time}</span>
      {children}
    </>
  )
}