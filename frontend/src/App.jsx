import { lazy, Suspense, useState } from 'react'
import { Routes, Route, useParams, useNavigate } from 'react-router-dom'
import ErrorBoundary from './components/ErrorBoundary'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'

const Home               = lazy(() => import('./pages/Home'))
const Games              = lazy(() => import('./pages/Games'))
const Login              = lazy(() => import('./pages/Login'))
const Registro           = lazy(() => import('./pages/Registro'))
const Perfil             = lazy(() => import('./pages/Perfil'))
const PerfilPublico      = lazy(() => import('./pages/PerfilPublico'))
const Ranking            = lazy(() => import('./pages/Ranking'))
const NotFound           = lazy(() => import('./pages/NotFound'))
const Truco              = lazy(() => import('./pages/Truco/index.jsx'))
const TrucoOnline        = lazy(() => import('./pages/Truco/TrucoOnline.jsx'))
const TrucoOnlineSelector = lazy(() => import('./pages/Truco/TrucoOnlineSelector.jsx'))
const Terminos           = lazy(() => import('./pages/Terminos'))
const Privacidad         = lazy(() => import('./pages/Privacidad'))
const Cookies            = lazy(() => import('./pages/Cookies'))

function TrucoOnlineJoin() {
  const { codigo } = useParams()
  const navigate   = useNavigate()
  const [unirse, setUnirse] = useState(false)

  if (unirse) return <TrucoOnline codigoAuto={codigo} />

  const codigoLimpio = (codigo || '').toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 4)

  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Navbar />
      <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_0%,rgba(6,78,59,0.22),transparent)]" />
        <div className="absolute inset-0" style={{ backgroundImage: 'radial-gradient(rgba(16,185,129,0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 bg-white/[0.03] border border-white/[0.07] rounded-3xl p-8 max-w-sm w-full flex flex-col gap-7 backdrop-blur-sm text-center shadow-2xl">

          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-2xl bg-emerald-900/40 border border-emerald-700/30 flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-8 h-8 text-emerald-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z"/>
              </svg>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <span className="inline-flex items-center gap-2 bg-emerald-950/50 border border-emerald-600/30 text-emerald-300 text-[10px] font-semibold px-3 py-1 rounded-full uppercase tracking-widest self-center">
              Truco Online · 1 vs 1
            </span>
            <h1 className="text-2xl font-extrabold text-white">¡Te invitaron a jugar!</h1>
            <p className="text-gray-500 text-sm">Alguien te mandó este link para una partida de Truco.</p>
          </div>

          <div className="flex flex-col items-center gap-1.5 bg-white/[0.03] border border-white/[0.06] rounded-2xl py-4 px-6">
            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Código de sala</p>
            <p className="text-4xl font-mono font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-300 tracking-widest">{codigoLimpio}</p>
          </div>

          <div className="flex flex-col gap-3">
            <button
              onClick={() => setUnirse(true)}
              className="w-full bg-emerald-600 hover:bg-emerald-500 text-white py-3.5 rounded-2xl font-bold transition-all hover:shadow-[0_0_32px_rgba(16,185,129,0.35)] text-sm"
            >
              Entrar a la partida →
            </button>
            <button
              onClick={() => navigate('/')}
              className="w-full text-gray-500 hover:text-gray-300 text-sm transition py-2"
            >
              ← Volver al inicio
            </button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}

const PageLoader = () => (
  <div className="min-h-screen bg-[#07070f] flex items-center justify-center">
    <div className="w-7 h-7 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
  </div>
)

function App() {
  return (
    <ErrorBoundary>
      <Suspense fallback={<PageLoader />}>
        <ScrollToTop />
        <Routes>
          <Route path="/"                         element={<Home />} />
          <Route path="/juegos"                   element={<Games />} />
          <Route path="/login"                    element={<Login />} />
          <Route path="/registro"                 element={<Registro />} />
          <Route path="/perfil"                   element={<Perfil />} />
          <Route path="/perfil/:uid"              element={<PerfilPublico />} />
          <Route path="/juegos/truco"             element={<Truco />} />
          <Route path="/juegos/truco-online"      element={<TrucoOnlineSelector />} />
          <Route path="/juegos/truco-online/1vs1" element={<TrucoOnline modalidadFijada="1vs1" />} />
          <Route path="/juegos/truco-online/2vs2" element={<TrucoOnline modalidadFijada="2vs2" />} />
          <Route path="/ranking"                  element={<Ranking />} />
          <Route path="/unirse/:codigo"           element={<TrucoOnlineJoin />} />
          <Route path="/terminos"                 element={<Terminos />} />
          <Route path="/privacidad"               element={<Privacidad />} />
          <Route path="/cookies"                  element={<Cookies />} />
          <Route path="*"                         element={<NotFound />} />
        </Routes>
      </Suspense>
    </ErrorBoundary>
  )
}

export default App
