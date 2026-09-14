import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import { usePageTitle } from '../../hooks/usePageTitle'
import Footer from '../../components/Footer'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'

export default function TrucoOnlineSelector() {
  usePageTitle('Truco Online')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="flex-1 flex flex-col relative overflow-hidden" style={{ minHeight: 'calc(100vh - 64px)' }}>

        {/* Header */}
        <div className="relative z-10 flex flex-col items-center justify-center gap-3 pt-12 pb-8 px-6 text-center">
          <span className="inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border"
                style={{ background: 'rgba(201,168,60,0.07)', borderColor: 'rgba(201,168,60,0.22)', color: GOLD }}>
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            Truco Online · Multijugador
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold">Elegí la modalidad</h1>
          <p className="text-gray-600 text-sm">¿Duelo individual o en equipo?</p>
        </div>

        {/* Split */}
        <div className="flex-1 flex flex-col sm:flex-row relative">

          {/* ── 1 vs 1 ── */}
          <button
            onClick={() => navigate('/juegos/truco-online/1vs1')}
            className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-14 text-center overflow-hidden transition-all duration-500"
            style={{ minHeight: '42vh', background: 'linear-gradient(160deg, #0d0f08 0%, #07090d 100%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(160deg, #111408 0%, #0a0c07 100%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0d0f08 0%, #07090d 100%)'}
          >
            <div className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-50 group-hover:opacity-100"
                 style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 70%, rgba(201,168,60,0.09), transparent)' }} />
            <span className="absolute font-serif select-none pointer-events-none leading-none"
                  style={{ fontSize: 320, color: 'rgba(201,168,60,0.03)', bottom: '-40px', right: '0', fontFamily: 'Georgia, serif' }} aria-hidden>1</span>
            <div className="hidden sm:block absolute right-0 inset-y-0 w-px pointer-events-none"
                 style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,60,0.12), transparent)' }} />

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="text-7xl sm:text-8xl font-black leading-none" style={{ color: GOLD, fontVariantNumeric: 'tabular-nums' }}>
                1<span className="text-4xl sm:text-5xl text-gray-700 mx-1">vs</span>1
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-lg font-bold text-white">Duelo individual</p>
                <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">Vos contra un rival. El mejor truco gana.</p>
              </div>
              <span className="inline-flex items-center gap-2 text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest bg-green-950/70 text-green-400 border border-green-700/30">
                <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                Disponible
              </span>
              <div className="mt-1 px-7 py-3 rounded-2xl font-bold text-sm transition-all"
                   style={{ background: GOLD, color: '#07090d' }}
                   onMouseEnter={e => e.currentTarget.style.background = GOLD_LIGHT}
                   onMouseLeave={e => e.currentTarget.style.background = GOLD}>
                Jugar 1vs1 →
              </div>
            </div>
          </button>

          {/* ── Divisor ── */}
          <div className="hidden sm:block absolute inset-y-0 left-1/2 -translate-x-1/2 w-px z-20 pointer-events-none"
               style={{ background: 'linear-gradient(to bottom, transparent 5%, rgba(201,168,60,0.1) 30%, rgba(201,168,60,0.1) 70%, transparent 95%)' }}>
            <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-gray-600"
                 style={{ background: '#07090d', border: '1px solid rgba(255,255,255,0.06)' }}>
              vs
            </div>
          </div>
          <div className="sm:hidden h-px w-full"
               style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,60,0.1), transparent)' }} />

          {/* ── 2 vs 2 ── */}
          <button
            onClick={() => navigate('/juegos/truco-online/2vs2')}
            className="group flex-1 relative flex flex-col items-center justify-center gap-8 p-10 sm:p-14 text-center overflow-hidden transition-all duration-500"
            style={{ minHeight: '42vh', background: 'linear-gradient(160deg, #0a0a0d 0%, #07090d 100%)' }}
            onMouseEnter={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0d0d11 0%, #090b0e 100%)'}
            onMouseLeave={e => e.currentTarget.style.background = 'linear-gradient(160deg, #0a0a0d 0%, #07090d 100%)'}
          >
            <div className="absolute inset-0 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                 style={{ background: 'radial-gradient(ellipse 80% 80% at 50% 70%, rgba(100,110,140,0.05), transparent)' }} />
            <span className="absolute font-serif select-none pointer-events-none leading-none"
                  style={{ fontSize: 320, color: 'rgba(255,255,255,0.015)', bottom: '-40px', left: '0', fontFamily: 'Georgia, serif' }} aria-hidden>2</span>

            <div className="relative z-10 flex flex-col items-center gap-5">
              <div className="text-7xl sm:text-8xl font-black leading-none text-white">
                2<span className="text-4xl sm:text-5xl text-gray-700 mx-1">vs</span>2
              </div>
              <div className="flex flex-col items-center gap-1.5">
                <p className="text-lg font-bold text-white">En equipo</p>
                <p className="text-gray-500 text-sm max-w-[200px] leading-relaxed">Con un compañero. El truco como se juega de verdad.</p>
              </div>
              <span className="inline-flex text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-widest border"
                    style={{ background: 'rgba(201,168,60,0.06)', borderColor: 'rgba(201,168,60,0.2)', color: GOLD }}>
                Beta
              </span>
              <div className="mt-1 px-7 py-3 rounded-2xl font-bold text-sm border border-white/[0.1] bg-white/[0.04] text-gray-300 transition-all group-hover:border-white/[0.2] group-hover:text-white">
                Jugar 2vs2 →
              </div>
            </div>
          </button>
        </div>

        {/* Back */}
        <div className="relative z-10 flex justify-center py-6">
          <button onClick={() => navigate('/juegos')}
            className="text-gray-700 text-xs hover:text-gray-400 transition">
            ← Volver
          </button>
        </div>

      </div>

      <Footer />
    </div>
  )
}
