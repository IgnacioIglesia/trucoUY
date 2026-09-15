import { useNavigate } from 'react-router-dom'

const GOLD = '#c9a83c'
const VERSION = 'v1.5'

export default function Footer() {
  const navigate = useNavigate()

  return (
    <footer className="border-t bg-[#07090d]" style={{ borderColor: 'rgba(201,168,60,0.1)' }}>
      <div className="max-w-5xl mx-auto px-6 py-10 flex flex-col md:flex-row gap-8 md:gap-0 justify-between items-start">

        {/* Marca */}
        <div className="flex flex-col gap-3">
          <button onClick={() => navigate('/')} className="flex items-center gap-2.5 group">
            <div style={{ width: 28, height: 36, background: '#07090d', border: `1.5px solid ${GOLD}`, borderRadius: 4, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <svg width="9" height="20" viewBox="0 0 30 68" fill={GOLD}>
                <path d="M15 2 C16 8 18 22 18 34 L15 40 L12 34 C12 22 14 8 15 2 Z"/>
                <path d="M3 32 C5 27 9 30 15 30 C21 30 25 27 27 32 C25 37 21 34 15 34 C9 34 5 37 3 32 Z"/>
                <rect x="13" y="40" width="4" height="15" rx="2"/><circle cx="15" cy="59" r="7"/>
              </svg>
            </div>
            <span className="text-base font-black text-white">Truco<span style={{ color: GOLD }}>UY</span></span>
          </button>
          <p className="text-gray-600 text-xs max-w-[200px] leading-relaxed">
            Truco rioplatense online. Gratis, sin publicidad.
          </p>
          <span className="text-gray-700 text-[10px] font-mono">{VERSION}</span>
        </div>

        {/* Links */}
        <div className="flex gap-12 md:gap-16">
          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Jugar</p>
            {[
              { label: 'Truco Online', to: '/juegos/truco-online' },
              { label: 'Truco vs IA',  to: '/juegos/truco'        },
              { label: 'Ranking',      to: '/ranking'             },
            ].map(l => (
              <button key={l.to} onClick={() => navigate(l.to)}
                className="text-gray-500 hover:text-gray-300 text-xs transition text-left">
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Cuenta</p>
            {[
              { label: 'Mi perfil', to: '/perfil'   },
              { label: 'Registro',  to: '/registro' },
            ].map(l => (
              <button key={l.to} onClick={() => navigate(l.to)}
                className="text-gray-500 hover:text-gray-300 text-xs transition text-left">
                {l.label}
              </button>
            ))}
          </div>

          <div className="flex flex-col gap-3">
            <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">Legal</p>
            {[
              { label: 'Términos',   to: '/terminos'   },
              { label: 'Privacidad', to: '/privacidad' },
              { label: 'Cookies',    to: '/cookies'    },
            ].map(l => (
              <button key={l.to} onClick={() => navigate(l.to)}
                className="text-gray-500 hover:text-gray-300 text-xs transition text-left">
                {l.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="border-t px-6 py-4 max-w-5xl mx-auto" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
        <p className="text-gray-700 text-xs text-center sm:text-left">TrucoUY © 2026. Todos los derechos reservados.</p>
      </div>
    </footer>
  )
}
