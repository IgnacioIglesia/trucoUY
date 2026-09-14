import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'

export default function Games() {
  usePageTitle('Jugar')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col sm:flex-row relative overflow-hidden" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* ── Truco Online ── */}
        <button
          onClick={() => navigate('/juegos/truco-online')}
          className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-16 text-center transition-all duration-500 overflow-hidden"
          style={{ minHeight: '50vh', background: 'linear-gradient(160deg, #0d0f08 0%, #07090d 100%)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(160deg, #111408 0%, #0a0c07 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0d0f08 0%, #07090d 100%)'}
        >
          {/* Glow */}
          <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-60 group-hover:opacity-100"
               style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(201,168,60,0.1), transparent)' }} />
          {/* Palo decorativo */}
          <span className="absolute -bottom-6 right-6 font-serif select-none pointer-events-none leading-none transition-all duration-500 group-hover:scale-105"
                style={{ fontSize: 280, color: 'rgba(201,168,60,0.04)', fontFamily: 'Georgia, serif' }} aria-hidden>♠</span>
          {/* Línea lateral derecha */}
          <div className="hidden sm:block absolute right-0 inset-y-0 w-px pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,60,0.15), transparent)' }} />

          <div className="relative z-10 flex flex-col items-center gap-6 max-w-xs">
            <span className="inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border"
                  style={{ background: 'rgba(201,168,60,0.08)', borderColor: 'rgba(201,168,60,0.25)', color: GOLD }}>
              <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
              Multijugador en vivo
            </span>

            <div className="flex flex-col items-center gap-2">
              <h2 className="text-4xl sm:text-5xl font-black leading-none">Truco Online</h2>
              <p className="text-gray-500 text-sm leading-relaxed">Enfrentá rivales reales en partidas 1vs1 o 2vs2 en tiempo real.</p>
            </div>

            <div className="flex gap-3 text-xs text-gray-600">
              <span className="flex items-center gap-1.5">
                <span className="font-serif" style={{ color: GOLD }}>♠</span> 1 vs 1
              </span>
              <span className="text-gray-800">·</span>
              <span className="flex items-center gap-1.5">
                <span className="font-serif" style={{ color: GOLD }}>♣</span> 2 vs 2
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
          className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-16 text-center transition-all duration-500 overflow-hidden"
          style={{ minHeight: '50vh', background: 'linear-gradient(160deg, #0a0a0d 0%, #07090d 100%)' }}
          onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0d0d10 0%, #090b0e 100%)'}
          onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0a0a0d 0%, #07090d 100%)'}
        >
          {/* Glow sutil */}
          <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
               style={{ background: 'radial-gradient(ellipse 80% 70% at 50% 60%, rgba(100,110,130,0.06), transparent)' }} />
          {/* Palo decorativo */}
          <span className="absolute -bottom-6 left-6 font-serif select-none pointer-events-none leading-none transition-all duration-500 group-hover:scale-105"
                style={{ fontSize: 280, color: 'rgba(255,255,255,0.02)', fontFamily: 'Georgia, serif' }} aria-hidden>♣</span>

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
