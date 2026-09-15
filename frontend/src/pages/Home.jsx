import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

const GOLD       = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'
const GOLD_DIM   = 'rgba(201,168,60,0.15)'
const GOLD_BORDER = 'rgba(201,168,60,0.25)'

function useInView(threshold = 0.1) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setInView(true); obs.unobserve(el) } },
      { threshold }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [threshold])
  return [ref, inView]
}

export default function Home() {
  usePageTitle('Inicio')
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)
  const [modosRef, modosVis] = useInView()
  const [whyRef,   whyVis]   = useInView()
  const [ctaRef,   ctaVis]   = useInView()

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      {/* ── HERO ─────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-28 overflow-hidden">

        {/* Palos decorativos — baraja española */}
        {/* Espada */}
        <svg className="absolute top-20 left-[5%] select-none pointer-events-none" aria-hidden
             width="62" height="140" viewBox="0 0 30 68" fill="none">
          <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"
                fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7" strokeLinejoin="round"/>
          <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"
                fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7"/>
          <rect x="13.5" y="38" width="3" height="14" rx="1.5"
                fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.18)" strokeWidth="0.7"/>
          <ellipse cx="15" cy="58" rx="7" ry="5"
                   fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.18)" strokeWidth="0.7"/>
        </svg>
        {/* Copa */}
        <svg className="absolute top-12 right-[4%] select-none pointer-events-none" aria-hidden
             width="74" height="120" viewBox="0 0 36 56" fill="none">
          <rect x="5" y="3" width="26" height="4.5" rx="2.25"
                fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7"/>
          <path d="M7 7.5 C7.5 19 11 27 15.5 31 L20.5 31 C25 27 28.5 19 29 7.5 Z"
                fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7"/>
          <rect x="15" y="31" width="6" height="14" rx="3"
                fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.18)" strokeWidth="0.7"/>
          <path d="M9 45 Q18 42 27 45 L25.5 52 Q18 50 10.5 52 Z"
                fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.18)" strokeWidth="0.7"/>
        </svg>
        {/* Oro */}
        <svg className="absolute bottom-28 left-[4%] select-none pointer-events-none" aria-hidden
             width="110" height="110" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.2)" strokeWidth="2.2"/>
          <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.16)" strokeWidth="1.6"/>
          <circle cx="23" cy="4" r="2.2" fill="rgba(201,168,60,0.22)"/>
          <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.22)"/>
          <circle cx="4" cy="23" r="2.2" fill="rgba(201,168,60,0.22)"/>
          <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.22)"/>
        </svg>
        {/* Basto */}
        <svg className="absolute bottom-20 right-[5%] select-none pointer-events-none" aria-hidden
             width="57" height="130" viewBox="0 0 30 68" fill="none">
          <circle cx="15" cy="10" r="10"
                  fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.8"/>
          <circle cx="15" cy="27" r="8.5"
                  fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.8"/>
          <circle cx="15" cy="42" r="7"
                  fill="rgba(201,168,60,0.07)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.8"/>
          <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.18)" strokeWidth="0.8"/>
        </svg>

        <div
          className="relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8"
          style={{ transition: 'opacity 0.9s ease, transform 0.9s ease', opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(20px)' }}
        >

          {/* Badge */}
          <span
            className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest backdrop-blur-sm"
            style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}`, color: GOLD_LIGHT }}
          >
            <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: GOLD }} />
            Truco rioplatense · Online
          </span>

          {/* Titular */}
          <div className="flex flex-col gap-2">
            <h1 className="font-extrabold leading-[0.9] tracking-tight" style={{ fontSize: 'clamp(56px, 10vw, 104px)' }}>
              El truco,
            </h1>
            <h1
              className="font-extrabold leading-[0.9] tracking-tight"
              style={{ fontSize: 'clamp(56px, 10vw, 104px)', color: 'transparent', WebkitTextStroke: `2px ${GOLD}` }}
            >
              online.
            </h1>
          </div>

          {/* Subtítulo */}
          <p className="text-gray-400 text-lg md:text-xl max-w-lg leading-relaxed"
             style={{ transitionDelay: '0.15s', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.15s' }}>
            El clásico del Río de la Plata con tus amigos,<br />
            desde cualquier parte. Sin descargas.
          </p>

          {/* CTAs */}
          <div
            className="flex gap-3 flex-wrap justify-center"
            style={{ opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s', transform: visible ? 'translateY(0)' : 'translateY(12px)' }}
          >
            <button
              onClick={() => navigate('/juegos/truco-online')}
              className="px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-[1.03]"
              style={{ background: GOLD, color: '#07090d', boxShadow: `0 0 0 0 ${GOLD}` }}
              onMouseEnter={e => { e.currentTarget.style.background = GOLD_LIGHT; e.currentTarget.style.boxShadow = `0 0 40px rgba(201,168,60,0.4)` }}
              onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.boxShadow = `0 0 0 0 ${GOLD}` }}
            >
              Jugar Online →
            </button>
            <button
              onClick={() => navigate('/juegos/truco')}
              className="px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-200"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', color: '#d1d5db' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = GOLD_BORDER; e.currentTarget.style.background = 'rgba(201,168,60,0.06)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
            >
              Jugar vs IA
            </button>
          </div>

          {/* Stats */}
          <div
            className="flex gap-10 pt-8 w-full justify-center"
            style={{ borderTop: '1px solid rgba(201,168,60,0.1)', opacity: visible ? 1 : 0, transition: 'opacity 0.8s ease 0.5s' }}
          >
            {[
              { valor: '1vs1 · 2vs2', label: 'Modalidades' },
              { valor: '100%',        label: 'Gratuito'    },
              { valor: '0',           label: 'Descargas'   },
            ].map(s => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-xl md:text-2xl font-extrabold" style={{ color: GOLD_LIGHT }}>{s.valor}</span>
                <span className="text-gray-600 text-xs uppercase tracking-widest">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Fade bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none"
             style={{ background: 'linear-gradient(to top, #07090d, transparent)' }} />
      </section>

      {/* ── MODOS ────────────────────────────────────────────────────────────── */}
      <section ref={modosRef} className="py-28 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,60,0.05) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div
            className="text-center mb-14"
            style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: modosVis ? 1 : 0, transform: modosVis ? 'none' : 'translateY(28px)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Elegí tu modo</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">¿Cómo querés jugar?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Truco Online – carta dominante */}
            <div
              onClick={() => navigate('/juegos/truco-online')}
              className="group cursor-pointer rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden transition-all duration-200"
              style={{
                background: 'linear-gradient(145deg, rgba(201,168,60,0.1) 0%, rgba(120,80,0,0.08) 100%)',
                border: `1px solid ${GOLD_BORDER}`,
                opacity: modosVis ? 1 : 0,
                transform: modosVis ? 'none' : 'translateY(24px)',
                transition: 'opacity 0.55s ease, transform 0.55s ease, border-color 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
              onMouseLeave={e => e.currentTarget.style.borderColor = GOLD_BORDER}
            >
              <svg className="absolute -bottom-6 -right-4 select-none pointer-events-none" aria-hidden
                   width="46" height="105" viewBox="0 0 30 68" fill="none">
                <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"
                      fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.28)" strokeWidth="0.7" strokeLinejoin="round"/>
                <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"
                      fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.28)" strokeWidth="0.7"/>
                <rect x="13.5" y="38" width="3" height="14" rx="1.5"
                      fill="rgba(201,168,60,0.08)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7"/>
                <ellipse cx="15" cy="58" rx="7" ry="5"
                         fill="rgba(201,168,60,0.08)" stroke="rgba(201,168,60,0.22)" strokeWidth="0.7"/>
              </svg>

              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ background: 'rgba(201,168,60,0.1)', border: `1px solid ${GOLD_BORDER}` }}>
                  🃏
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest"
                      style={{ background: 'rgba(22,163,74,0.12)', color: '#4ade80', borderColor: 'rgba(22,163,74,0.3)' }}>
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                  Online
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Truco Online</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Jugá 1vs1 o 2vs2 con tus amigos en tiempo real. Creá una sala, compartí el código y a jugar.
                </p>
              </div>

              <div className="pt-3 flex items-center justify-between" style={{ borderTop: '1px solid rgba(201,168,60,0.12)' }}>
                <div className="flex gap-2">
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>1 vs 1</span>
                  <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.05)', color: '#9ca3af' }}>2 vs 2</span>
                </div>
                <span className="text-sm font-bold transition-colors" style={{ color: GOLD }}
                      onMouseEnter={e => e.target.style.color = GOLD_LIGHT}
                      onMouseLeave={e => e.target.style.color = GOLD}>
                  Jugar →
                </span>
              </div>
            </div>

            {/* Truco vs IA */}
            <div
              onClick={() => navigate('/juegos/truco')}
              className="group cursor-pointer rounded-3xl p-8 flex flex-col gap-6 relative overflow-hidden transition-all duration-200"
              style={{
                background: 'rgba(255,255,255,0.02)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: modosVis ? 1 : 0,
                transform: modosVis ? 'none' : 'translateY(24px)',
                transition: 'opacity 0.55s ease 0.1s, transform 0.55s ease 0.1s, border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,60,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.035)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
            >
              <svg className="absolute -bottom-6 -right-4 select-none pointer-events-none" aria-hidden
                   width="43" height="105" viewBox="0 0 30 68" fill="none">
                <circle cx="15" cy="10" r="10"
                        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                <circle cx="15" cy="27" r="8.5"
                        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                <circle cx="15" cy="42" r="7"
                        fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.12)" strokeWidth="0.8"/>
                <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                      fill="rgba(255,255,255,0.03)" stroke="rgba(255,255,255,0.1)" strokeWidth="0.8"/>
              </svg>

              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl flex-shrink-0"
                     style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  🤖
                </div>
                <span className="text-[10px] font-bold px-2.5 py-1 rounded-full border uppercase tracking-widest"
                      style={{ background: 'rgba(255,255,255,0.04)', color: '#6b7280', borderColor: 'rgba(255,255,255,0.1)' }}>
                  Solo
                </span>
              </div>

              <div>
                <h3 className="text-2xl font-extrabold text-white mb-2">Truco vs IA</h3>
                <p className="text-gray-400 text-sm leading-relaxed">
                  Practicá contra la máquina. Ideal para aprender las reglas o jugar cuando no hay con quién.
                </p>
              </div>

              <div className="pt-3 flex justify-end" style={{ borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="text-sm font-bold text-gray-500 group-hover:text-gray-300 transition-colors">Jugar solo →</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── POR QUÉ ──────────────────────────────────────────────────────────── */}
      <section ref={whyRef} className="py-28 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="text-center mb-16"
            style={{ transition: 'opacity 0.7s, transform 0.7s', opacity: whyVis ? 1 : 0, transform: whyVis ? 'none' : 'translateY(28px)' }}
          >
            <p className="text-xs font-semibold uppercase tracking-widest mb-3" style={{ color: GOLD }}>Por qué TrucoUY</p>
            <h2 className="text-4xl md:text-5xl font-extrabold">Sin vueltas, a jugar.</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" style={{ color: GOLD }}>
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
                  </svg>
                ),
                title: 'Instantáneo',
                desc: 'Abrís el link y en segundos ya estás jugando. Sin descargas, sin instalaciones.',
              },
              {
                icon: (
                  <svg width="14" height="32" viewBox="0 0 30 68" fill="currentColor" style={{ color: GOLD }}>
                    <path d="M15 2 C16 8 18 22 18 34 L15 40 L12 34 C12 22 14 8 15 2 Z"/>
                    <path d="M3 32 C5 27 9 30 15 30 C21 30 25 27 27 32 C25 37 21 34 15 34 C9 34 5 37 3 32 Z"/>
                    <rect x="13" y="40" width="4" height="15" rx="2"/>
                    <circle cx="15" cy="59" r="7"/>
                  </svg>
                ),
                title: 'Multijugador',
                desc: 'Jugá 1vs1 o 2vs2 con amigos de cualquier parte. Compartí el código y listo.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                ),
                title: 'Cualquier pantalla',
                desc: 'Funciona perfecto en celular, tablet y computadora.',
              },
              {
                icon: (
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12" />
                    <rect x="2" y="7" width="20" height="5" />
                    <line x1="12" y1="22" x2="12" y2="7" />
                    <path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" />
                    <path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                  </svg>
                ),
                title: 'Siempre gratis',
                desc: 'Sin suscripciones ni pagos. TrucoUY es completamente gratuito.',
              },
            ].map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl p-6 flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  opacity: whyVis ? 1 : 0,
                  transform: whyVis ? 'none' : 'translateY(24px)',
                  transition: `opacity 0.55s ease ${i * 90}ms, transform 0.55s ease ${i * 90}ms`,
                }}
              >
                {f.icon}
                <h3 className="text-white font-bold text-sm">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ──────────────────────────────────────────────────────────────── */}
      <section ref={ctaRef} className="py-28 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-14 md:p-20 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(145deg, rgba(201,168,60,0.1) 0%, rgba(120,80,0,0.06) 100%)',
            border: `1px solid ${GOLD_BORDER}`,
            opacity: ctaVis ? 1 : 0,
            transform: ctaVis ? 'none' : 'translateY(28px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.05) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          {/* Copa */}
          <svg className="absolute top-6 left-8 select-none pointer-events-none" aria-hidden
               width="40" height="66" viewBox="0 0 32 52" fill="none">
            <rect x="4" y="2" width="24" height="4" rx="2"
                  fill="rgba(201,168,60,0.12)" stroke="rgba(201,168,60,0.35)" strokeWidth="0.8"/>
            <path d="M6 6 C6.5 17 10 25 15 28 L17 28 C22 25 25.5 17 26 6 Z"
                  fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.35)" strokeWidth="0.8"/>
            <rect x="13.5" y="28" width="5" height="13" rx="2.5"
                  fill="rgba(201,168,60,0.08)" stroke="rgba(201,168,60,0.28)" strokeWidth="0.8"/>
            <path d="M7 41 Q16 38.5 25 41 L23.5 48 Q16 46 8.5 48 Z"
                  fill="rgba(201,168,60,0.08)" stroke="rgba(201,168,60,0.28)" strokeWidth="0.8"/>
          </svg>
          {/* Oro */}
          <svg className="absolute bottom-6 right-8 select-none pointer-events-none" aria-hidden
               width="72" height="72" viewBox="0 0 46 46" fill="none">
            <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.32)" strokeWidth="2.2"/>
            <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.26)" strokeWidth="1.8"/>
            <circle cx="23" cy="4" r="2.2" fill="rgba(201,168,60,0.32)"/>
            <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.32)"/>
            <circle cx="4" cy="23" r="2.2" fill="rgba(201,168,60,0.32)"/>
            <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.32)"/>
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">¿Listo para jugar?</h2>
            <p className="text-gray-400 text-lg max-w-md">
              Creá tu cuenta gratis y empezá a jugar con tus amigos ahora mismo.
            </p>
            <div className="flex gap-3 flex-wrap justify-center mt-2">
              <button
                onClick={() => navigate('/registro')}
                className="px-12 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-[1.03]"
                style={{ background: GOLD, color: '#07090d' }}
                onMouseEnter={e => { e.currentTarget.style.background = GOLD_LIGHT; e.currentTarget.style.boxShadow = `0 0 40px rgba(201,168,60,0.4)` }}
                onMouseLeave={e => { e.currentTarget.style.background = GOLD; e.currentTarget.style.boxShadow = 'none' }}
              >
                Crear cuenta gratis →
              </button>
              <button
                onClick={() => navigate('/juegos/truco-online')}
                className="px-10 py-4 rounded-2xl text-lg font-semibold transition-all"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#d1d5db' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
              >
                Jugar sin cuenta
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
