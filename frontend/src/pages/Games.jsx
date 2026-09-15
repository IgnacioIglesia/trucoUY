import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'

export default function Games() {
  usePageTitle('Jugar')
  const navigate = useNavigate()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col sm:flex-row relative overflow-hidden" style={{ minHeight: 'calc(100vh - 56px)' }}>

        {/* ── Truco Online ── */}
        <button
          onClick={() => navigate('/juegos/truco-online')}
          className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-16 text-center overflow-hidden"
          style={{ minHeight: '50vh', background: 'transparent', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(-18px)', transition: 'opacity 0.7s ease, transform 0.7s ease, background 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(201,168,60,0.03)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-100"
               style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(201,168,60,0.1), transparent)' }} />
          {/* Palo decorativo — Espada */}
          <svg className="absolute -bottom-6 right-6 select-none pointer-events-none transition-all duration-500 group-hover:scale-105" aria-hidden
               width="125" height="280" viewBox="0 0 30 68" fill="none">
            <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"
                  fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.12)" strokeWidth="0.7" strokeLinejoin="round"/>
            <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"
                  fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.12)" strokeWidth="0.7"/>
            <rect x="13.5" y="38" width="3" height="14" rx="1.5"
                  fill="rgba(201,168,60,0.04)" stroke="rgba(201,168,60,0.1)" strokeWidth="0.7"/>
            <ellipse cx="15" cy="58" rx="7" ry="5"
                     fill="rgba(201,168,60,0.04)" stroke="rgba(201,168,60,0.1)" strokeWidth="0.7"/>
          </svg>
          {/* Línea lateral derecha */}
          <div className="hidden sm:block absolute right-0 inset-y-0 w-px pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,60,0.15), transparent)' }} />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-xs">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border"
                  style={{ background: 'rgba(201,168,60,0.08)', borderColor: 'rgba(201,168,60,0.25)', color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full animate-pulse" style={{ background: '#c9a83c' }} />
              Multijugador en vivo
            </span>

            <div className="flex flex-col items-center gap-2">
              <h2 className="text-4xl sm:text-5xl font-black leading-none">Truco Online</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Enfrentá rivales reales en partidas 1vs1 o 2vs2 en tiempo real.</p>
            </div>

            <div className="flex gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <svg width="8" height="18" viewBox="0 0 30 68" fill="none" style={{ flexShrink: 0 }}>
                  <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"
                        fill="rgba(201,168,60,0.3)" stroke="#c9a83c" strokeWidth="1.5" strokeLinejoin="round"/>
                  <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"
                        fill="rgba(201,168,60,0.3)" stroke="#c9a83c" strokeWidth="1.5"/>
                  <rect x="13.5" y="38" width="3" height="14" rx="1.5" fill="rgba(201,168,60,0.25)" stroke="#c9a83c" strokeWidth="1.2"/>
                  <ellipse cx="15" cy="58" rx="7" ry="5" fill="rgba(201,168,60,0.25)" stroke="#c9a83c" strokeWidth="1.2"/>
                </svg> 1 vs 1
              </span>
              <span className="text-gray-800">·</span>
              <span className="flex items-center gap-1.5">
                <svg width="8" height="18" viewBox="0 0 30 68" fill="none" style={{ flexShrink: 0 }}>
                  <circle cx="15" cy="10" r="10" fill="rgba(201,168,60,0.25)" stroke="#c9a83c" strokeWidth="1.5"/>
                  <circle cx="15" cy="27" r="8.5" fill="rgba(201,168,60,0.25)" stroke="#c9a83c" strokeWidth="1.5"/>
                  <circle cx="15" cy="42" r="7" fill="rgba(201,168,60,0.25)" stroke="#c9a83c" strokeWidth="1.5"/>
                  <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                        fill="rgba(201,168,60,0.2)" stroke="#c9a83c" strokeWidth="1.2"/>
                </svg> 2 vs 2
              </span>
            </div>

            <div className="mt-2 px-7 py-3 rounded-2xl font-bold text-sm transition-all duration-200"
                 style={{ background: GOLD, color: '#07090d' }}
                 onMouseEnter={e => e.currentTarget.style.background = GOLD_LIGHT}
                 onMouseLeave={e => e.currentTarget.style.background = GOLD}>
              Jugar Online →
            </div>
          </div>
        </button>

        {/* ── Divisor ── */}
        <div className="hidden sm:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px z-20 pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(201,168,60,0.12) 30%, rgba(201,168,60,0.12) 70%, transparent 95%)' }}>
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-gray-600"
               style={{ background: '#07090d', border: '1px solid rgba(255,255,255,0.07)' }}>
            ó
          </div>
        </div>
        {/* Divisor mobile */}
        <div className="sm:hidden h-px w-full"
             style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,60,0.15), transparent)' }} />

        {/* ── Truco vs IA ── */}
        <button
          onClick={() => navigate('/juegos/truco')}
          className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-16 text-center overflow-hidden"
          style={{ minHeight: '50vh', background: 'transparent', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateX(18px)', transition: 'opacity 0.7s ease 0.1s, transform 0.7s ease 0.1s, background 0.3s' }}
          onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.01)'}
          onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
        >
          {/* Glow sutil */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(201,168,60,0.05), transparent)' }} />
          {/* Palo decorativo — Basto */}
          <svg className="absolute -bottom-6 left-6 select-none pointer-events-none transition-all duration-500 group-hover:scale-105" aria-hidden
               width="125" height="280" viewBox="0 0 30 68" fill="none">
            <circle cx="15" cy="10" r="10"
                    fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
            <circle cx="15" cy="27" r="8.5"
                    fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
            <circle cx="15" cy="42" r="7"
                    fill="rgba(255,255,255,0.02)" stroke="rgba(255,255,255,0.06)" strokeWidth="0.7"/>
            <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                  fill="rgba(255,255,255,0.015)" stroke="rgba(255,255,255,0.05)" strokeWidth="0.7"/>
          </svg>

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-xs">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border border-white/[0.08] bg-white/[0.03] text-gray-500">
              Sin esperar · Offline
            </span>

            <div className="flex flex-col items-center gap-2">
              <h2 className="text-4xl sm:text-5xl font-black leading-none">Truco vs IA</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Practicá contra la máquina cuando quieras, sin necesitar rivales.</p>
            </div>

            <div className="flex gap-3 text-xs text-gray-600">
              <span>Gratis</span>
              <span className="text-gray-800">·</span>
              <span>Sin registro</span>
              <span className="text-gray-800">·</span>
              <span>Cualquier hora</span>
            </div>

            <div className="mt-2 px-7 py-3 rounded-2xl font-bold text-sm border border-white/[0.1] bg-white/[0.04] text-gray-300 transition-all duration-200 group-hover:border-white/[0.18] group-hover:text-white">
              Jugar solo →
            </div>
          </div>
        </button>

      </div>

      <Footer />
    </div>
  )
}
