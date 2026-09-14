import { useNavigate } from 'react-router-dom'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'

export default function Games() {
  usePageTitle('Jugar')
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-32 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(109,40,217,0.18),transparent)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(139,92,246,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-2xl w-full flex flex-col items-center gap-12">
          <div className="text-center flex flex-col gap-3">
            <p className="text-emerald-400 font-semibold text-xs uppercase tracking-widest">Modos de juego</p>
            <h1 className="text-4xl md:text-5xl font-extrabold leading-tight">¿Cómo querés jugar?</h1>
            <p className="text-gray-400 text-base max-w-sm mx-auto">
              Elegí si querés jugar online con amigos o practicar contra la máquina.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {/* Truco Online */}
            <button
              onClick={() => navigate('/juegos/truco-online')}
              className="group text-left rounded-3xl border border-emerald-500/30 bg-emerald-950/20 hover:border-emerald-400/50 hover:bg-emerald-950/30 p-8 flex flex-col gap-5 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/40 border border-emerald-700/25 flex items-center justify-center group-hover:bg-emerald-800/50 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-extrabold text-xl">Truco Online</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-green-950/70 text-green-400 border-green-700/30 uppercase tracking-widest">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
                    Online
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Jugá 1vs1 o 2vs2 con amigos en tiempo real.</p>
              </div>
              <span className="text-emerald-400 text-sm font-bold group-hover:text-emerald-300 transition-colors">
                Jugar Online →
              </span>
            </button>

            {/* Truco vs IA */}
            <button
              onClick={() => navigate('/juegos/truco')}
              className="group text-left rounded-3xl border border-white/[0.07] bg-white/[0.03] hover:border-emerald-500/25 hover:bg-white/[0.05] p-8 flex flex-col gap-5 transition-all duration-200"
            >
              <div className="w-14 h-14 rounded-2xl bg-emerald-900/40 border border-emerald-700/25 flex items-center justify-center group-hover:bg-emerald-800/50 transition-colors">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-emerald-400">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3" />
                </svg>
              </div>
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center gap-2">
                  <h2 className="text-white font-extrabold text-xl">Truco vs IA</h2>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full border bg-emerald-950/70 text-emerald-300 border-emerald-700/30 uppercase tracking-widest">
                    Solo
                  </span>
                </div>
                <p className="text-gray-400 text-sm leading-relaxed">Practicá contra la máquina, cuando quieras y sin esperar a nadie.</p>
              </div>
              <span className="text-emerald-400 text-sm font-bold group-hover:text-emerald-300 transition-colors">
                Jugar solo →
              </span>
            </button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
