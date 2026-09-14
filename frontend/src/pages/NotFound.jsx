import { useNavigate, useLocation } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

const GOLD       = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

export default function NotFound() {
  usePageTitle('404')
  const navigate = useNavigate()
  const location = useLocation()

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,60,0.08), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.035) 1px, transparent 1px)', backgroundSize: '28px 28px' }} />

        <div className="relative z-10 flex flex-col items-center gap-8 text-center max-w-md">

          {/* 404 con suit decorativo */}
          <div className="relative select-none">
            <p className="text-[160px] font-black leading-none tracking-tighter"
               style={{ color: 'rgba(201,168,60,0.07)' }}>
              404
            </p>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-3xl flex items-center justify-center"
                   style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}` }}>
                <span className="font-serif text-4xl" style={{ color: GOLD }}>♠</span>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-extrabold">Página no encontrada</h1>
            <p className="text-gray-500 text-sm leading-relaxed">
              La ruta{' '}
              <span className="font-mono text-xs px-2 py-0.5 rounded-lg"
                    style={{ color: GOLD, background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}` }}>
                {location.pathname}
              </span>
              {' '}no existe.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <button
              onClick={() => navigate(-1)}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-semibold text-sm transition-all"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#fff' }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
              </svg>
              Volver
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02]"
              style={{ background: GOLD, color: '#07090d' }}
              onMouseEnter={e => e.currentTarget.style.background = GOLD_LIGHT}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25"/>
              </svg>
              Ir al inicio
            </button>
          </div>

          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Juegos',    to: '/juegos'  },
              { label: 'Ranking',   to: '/ranking' },
              { label: 'Mi perfil', to: '/perfil'  },
            ].map(link => (
              <button key={link.to} onClick={() => navigate(link.to)}
                className="text-xs text-gray-500 px-3 py-1.5 rounded-lg border border-transparent transition-all"
                onMouseEnter={e => { e.currentTarget.style.color = GOLD; e.currentTarget.style.borderColor = GOLD_BORDER; e.currentTarget.style.background = 'rgba(201,168,60,0.06)' }}
                onMouseLeave={e => { e.currentTarget.style.color = '#6b7280'; e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent' }}>
                {link.label} →
              </button>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
