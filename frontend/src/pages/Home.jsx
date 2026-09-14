import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

function useInView(threshold = 0.12) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)
  useEffect(() => {
    const el = ref.current
    if (!el) return
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); observer.unobserve(el) } },
      { threshold }
    )
    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])
  return [ref, inView]
}

const FEATURES = [
  {
    icon: '⚡',
    title: 'Instantáneo',
    desc: 'Sin descargas ni instalaciones. Abrís el link y en segundos ya estás jugando.',
  },
  {
    icon: '🃏',
    title: '1vs1 y 2vs2',
    desc: 'Jugá mano a mano o con equipos de dos. Creá una sala, compartí el código.',
  },
  {
    icon: '📱',
    title: 'Cualquier pantalla',
    desc: 'Funciona perfecto en celular, tablet y computadora. Jugá donde quieras.',
  },
  {
    icon: '🆓',
    title: '100% Gratis',
    desc: 'Sin suscripciones ni pagos ocultos. TrucoUY es completamente gratis para siempre.',
  },
]

export default function Home() {
  usePageTitle('Inicio')
  const navigate = useNavigate()
  const [heroVisible, setHeroVisible] = useState(false)
  const [featuresRef, featuresVisible] = useInView()
  const [modosRef,    modosVisible]    = useInView()
  const [ctaRef,      ctaVisible]      = useInView()

  useEffect(() => {
    const t = setTimeout(() => setHeroVisible(true), 80)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen text-white flex flex-col" style={{ background: '#080f0a' }}>
      <Navbar />

      {/* ── HERO ── */}
      <section className="relative min-h-screen flex items-center justify-center px-6 py-32 overflow-hidden">

        {/* Fondo: gradiente verde */}
        <div className="absolute inset-0" style={{ background: 'radial-gradient(ellipse 90% 65% at 50% -5%, rgba(6,78,59,0.55) 0%, transparent 70%)' }} />

        {/* Patrón de puntos */}
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(16,185,129,0.07) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        {/* Palos de cartas decorativos */}
        <span className="absolute top-24 left-[8%] text-[120px] text-emerald-900/25 select-none pointer-events-none leading-none font-serif" aria-hidden>♠</span>
        <span className="absolute top-16 right-[6%]  text-[100px] text-red-900/20    select-none pointer-events-none leading-none font-serif" aria-hidden>♥</span>
        <span className="absolute bottom-32 left-[5%] text-[90px]  text-red-900/15   select-none pointer-events-none leading-none font-serif" aria-hidden>♦</span>
        <span className="absolute bottom-24 right-[8%] text-[110px] text-emerald-900/20 select-none pointer-events-none leading-none font-serif" aria-hidden>♣</span>

        <div className={`relative z-10 max-w-4xl mx-auto flex flex-col items-center text-center gap-8 transition-all duration-1000 ease-out ${heroVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-12'}`}>

          <span className="inline-flex items-center gap-2 bg-emerald-950/60 border border-emerald-600/35 text-emerald-300 text-xs font-semibold px-4 py-2 rounded-full uppercase tracking-widest backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            El truco rioplatense online
          </span>

          <h1 className="text-6xl md:text-8xl font-extrabold leading-[0.95] tracking-tight">
            Truco<span className="text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 via-teal-300 to-emerald-500">UY</span>
          </h1>

          <p className="text-gray-400 text-xl md:text-2xl max-w-xl leading-relaxed">
            El clásico del Río de la Plata,<br />ahora online con tus amigos.
          </p>

          <div
            className="flex gap-4 flex-wrap justify-center"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.3s, transform 0.8s ease 0.3s' }}
          >
            <button
              onClick={() => navigate('/juegos/truco-online')}
              className="bg-emerald-600 hover:bg-emerald-500 text-white px-10 py-4 rounded-2xl text-lg font-bold transition-all duration-200 hover:scale-105 hover:shadow-[0_0_48px_rgba(16,185,129,0.4)]"
            >
              Jugar Online →
            </button>
            <button
              onClick={() => navigate('/juegos/truco')}
              className="bg-white/[0.05] hover:bg-white/[0.09] border border-white/10 hover:border-emerald-500/40 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all duration-200"
            >
              Jugar vs IA
            </button>
          </div>

          <div
            className="flex gap-12 pt-8 border-t border-white/[0.07] w-full justify-center"
            style={{ opacity: heroVisible ? 1 : 0, transform: heroVisible ? 'translateY(0)' : 'translateY(16px)', transition: 'opacity 0.8s ease 0.55s, transform 0.8s ease 0.55s' }}
          >
            {[
              { valor: '1vs1 y 2vs2', label: 'Modalidades' },
              { valor: '100%',        label: 'Gratuito'    },
              { valor: '0',           label: 'Descargas'   },
            ].map((s) => (
              <div key={s.label} className="flex flex-col items-center gap-1">
                <span className="text-2xl md:text-3xl font-extrabold text-white">{s.valor}</span>
                <span className="text-gray-500 text-sm">{s.label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none" style={{ background: 'linear-gradient(to top, #080f0a, transparent)' }} />
      </section>

      {/* ── MODOS ── */}
      <section ref={modosRef} className="py-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none" style={{ background: 'radial-gradient(ellipse 70% 50% at 50% 50%, rgba(6,78,59,0.12) 0%, transparent 70%)' }} />

        <div className="max-w-4xl mx-auto relative z-10">
          <div
            className="text-center mb-16 transition-all duration-700"
            style={{ opacity: modosVisible ? 1 : 0, transform: modosVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <p className="text-emerald-500 font-semibold text-xs uppercase tracking-widest mb-4">Modos de juego</p>
            <h2 className="text-4xl md:text-5xl font-bold">¿Cómo querés jugar?</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            {/* Truco Online */}
            <div
              onClick={() => navigate('/juegos/truco-online')}
              className="group cursor-pointer rounded-3xl p-8 flex flex-col gap-6 transition-all duration-200 relative overflow-hidden"
              style={{
                background: 'linear-gradient(135deg, rgba(6,78,59,0.35) 0%, rgba(4,47,36,0.5) 100%)',
                border: '1px solid rgba(16,185,129,0.25)',
                opacity: modosVisible ? 1 : 0,
                transform: modosVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.55s ease 0ms, transform 0.55s ease 0ms, border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.5)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(16,185,129,0.25)'}
            >
              {/* decorativo */}
              <span className="absolute -bottom-4 -right-4 text-[100px] text-emerald-900/20 select-none pointer-events-none leading-none font-serif" aria-hidden>♠</span>

              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(6,78,59,0.6)', border: '1px solid rgba(16,185,129,0.3)' }}>
                  🃏
                </div>
                <span className="inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-emerald-950/80 text-emerald-400 border-emerald-700/40 uppercase tracking-widest">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  Online
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-extrabold text-2xl">Truco Online</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Jugá 1vs1 o 2vs2 con amigos en tiempo real. Creá una sala, compartí el código y a jugar.</p>
              </div>
              <div className="pt-2 border-t border-white/[0.07] flex justify-end">
                <span className="text-emerald-400 text-sm font-bold group-hover:text-emerald-300 transition-colors">Jugar Online →</span>
              </div>
            </div>

            {/* Truco vs IA */}
            <div
              onClick={() => navigate('/juegos/truco')}
              className="group cursor-pointer rounded-3xl p-8 flex flex-col gap-6 transition-all duration-200 relative overflow-hidden"
              style={{
                background: 'rgba(255,255,255,0.025)',
                border: '1px solid rgba(255,255,255,0.07)',
                opacity: modosVisible ? 1 : 0,
                transform: modosVisible ? 'translateY(0)' : 'translateY(24px)',
                transition: 'opacity 0.55s ease 120ms, transform 0.55s ease 120ms, border-color 0.2s, background 0.2s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(16,185,129,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}
            >
              <span className="absolute -bottom-4 -right-4 text-[100px] text-white/5 select-none pointer-events-none leading-none font-serif" aria-hidden>♣</span>

              <div className="flex items-start justify-between">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
                  🤖
                </div>
                <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2.5 py-1 rounded-full border bg-white/5 text-gray-400 border-white/10 uppercase tracking-widest">
                  Solo
                </span>
              </div>
              <div className="flex flex-col gap-2">
                <h3 className="text-white font-extrabold text-2xl">Truco vs IA</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Practicá contra la máquina, cuando quieras y sin esperar a nadie.</p>
              </div>
              <div className="pt-2 border-t border-white/[0.07] flex justify-end">
                <span className="text-gray-500 text-sm font-bold group-hover:text-gray-300 transition-colors">Jugar solo →</span>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section ref={featuresRef} className="py-32 px-6">
        <div className="max-w-5xl mx-auto">
          <div
            className="text-center mb-20 transition-all duration-700"
            style={{ opacity: featuresVisible ? 1 : 0, transform: featuresVisible ? 'translateY(0)' : 'translateY(32px)' }}
          >
            <p className="text-emerald-500 font-semibold text-xs uppercase tracking-widest mb-4">Por qué TrucoUY</p>
            <h2 className="text-4xl md:text-5xl font-bold">Sin vueltas,<br />a jugar.</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {FEATURES.map((f, i) => (
              <div
                key={f.title}
                className="rounded-2xl p-7 flex flex-col gap-4"
                style={{
                  background: 'rgba(255,255,255,0.025)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  opacity: featuresVisible ? 1 : 0,
                  transform: featuresVisible ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.6s ease ${i * 100}ms, transform 0.6s ease ${i * 100}ms`,
                }}
              >
                <span className="text-3xl">{f.icon}</span>
                <h3 className="text-white font-bold text-base">{f.title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section ref={ctaRef} className="py-32 px-6">
        <div
          className="max-w-4xl mx-auto rounded-3xl p-16 text-center relative overflow-hidden"
          style={{
            background: 'linear-gradient(135deg, rgba(6,78,59,0.4) 0%, rgba(4,47,36,0.6) 100%)',
            border: '1px solid rgba(16,185,129,0.2)',
            opacity: ctaVisible ? 1 : 0,
            transform: ctaVisible ? 'translateY(0)' : 'translateY(32px)',
            transition: 'opacity 0.7s ease, transform 0.7s ease',
          }}
        >
          <div className="absolute inset-0 pointer-events-none" style={{ backgroundImage: 'radial-gradient(rgba(16,185,129,0.06) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
          <span className="absolute top-4 left-6 text-[80px] text-emerald-900/20 select-none pointer-events-none leading-none font-serif" aria-hidden>♥</span>
          <span className="absolute bottom-4 right-6 text-[80px] text-emerald-900/20 select-none pointer-events-none leading-none font-serif" aria-hidden>♦</span>

          <div className="relative z-10 flex flex-col items-center gap-6">
            <h2 className="text-4xl md:text-6xl font-extrabold leading-tight">
              ¿Listo para jugar?
            </h2>
            <p className="text-gray-300 text-lg max-w-md">
              Creá tu cuenta gratis y empezá a jugar con tus amigos ahora mismo.
            </p>
            <div className="flex gap-4 flex-wrap justify-center mt-2">
              <button
                onClick={() => navigate('/registro')}
                className="bg-emerald-600 hover:bg-emerald-500 text-white px-12 py-4 rounded-2xl text-lg font-bold transition-all hover:scale-105 hover:shadow-[0_0_48px_rgba(16,185,129,0.45)]"
              >
                Crear cuenta gratis →
              </button>
              <button
                onClick={() => navigate('/juegos/truco-online')}
                className="bg-white/[0.08] hover:bg-white/[0.13] border border-white/15 text-white px-10 py-4 rounded-2xl text-lg font-semibold transition-all"
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
