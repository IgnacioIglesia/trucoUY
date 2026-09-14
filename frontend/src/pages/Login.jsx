import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth'
import { usePageTitle } from '../hooks/usePageTitle'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'
const GOLD_BORDER = 'rgba(201,168,60,0.28)'

const GoogleIcon = () => (
  <svg viewBox="0 0 24 24" className="w-4 h-4 flex-shrink-0" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
)

const CardLogo = () => (
  <div style={{ width: 36, height: 46, background: '#0a150c', border: `1.5px solid ${GOLD}`, borderRadius: 5, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
    <span style={{ color: GOLD, fontSize: 20, lineHeight: 1, fontFamily: 'Georgia, serif' }}>♠</span>
  </div>
)

export default function Login() {
  usePageTitle('Iniciar sesión')
  const navigate = useNavigate()
  const location = useLocation()
  const desde = location.state?.desde
  const [email, setEmail]       = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [cargando, setCargando] = useState(false)

  const handleEmail = async (e) => {
    e.preventDefault()
    setCargando(true)
    setError('')
    try {
      await signInWithEmailAndPassword(auth, email, password)
      navigate(desde || '/')
    } catch {
      setError('Email o contraseña incorrectos.')
    }
    setCargando(false)
  }

  const handleGoogle = async () => {
    setError('')
    setCargando(true)
    try {
      await signInWithPopup(auth, googleProvider)
      navigate(desde || '/')
    } catch (err) {
      if (err.code !== 'auth/popup-closed-by-user') setError('No se pudo iniciar sesión con Google.')
    }
    setCargando(false)
  }

  return (
    <div className="min-h-screen text-white flex" style={{ background: '#07090d' }}>

      {/* ── Panel izquierdo ── */}
      <div className="hidden lg:flex w-[460px] flex-shrink-0 flex-col justify-center p-14 relative overflow-hidden"
           style={{ background: 'linear-gradient(155deg, #0a0d07 0%, #060809 100%)' }}>

        {/* Glow dorado */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(201,168,60,0.09), transparent)' }} />

        {/* Puntos */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />

        {/* Línea divisoria */}
        <div className="absolute right-0 inset-y-0 w-px pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,60,0.2), transparent)' }} />

        {/* Palo decorativo */}
        <span className="absolute -bottom-8 -right-4 font-serif select-none pointer-events-none leading-none"
              style={{ fontSize: 200, color: 'rgba(201,168,60,0.04)' }} aria-hidden>♠</span>

        <div className="relative z-10 flex flex-col gap-10 max-w-xs">

          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <CardLogo />
            <span className="text-2xl font-black text-white">Truco<span style={{ color: GOLD }}>UY</span></span>
          </button>

          <div>
            <h2 className="text-2xl font-extrabold leading-snug">Bienvenido de vuelta.</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Tus rivales te están esperando para la próxima mano.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { suit: '♠', texto: 'Truco Online 1vs1 y 2vs2' },
              { suit: '♥', texto: 'Jugá contra amigos en tiempo real' },
              { suit: '♦', texto: 'Ranking y estadísticas' },
              { suit: '♣', texto: 'Completamente gratis' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3 transition-colors"
                   style={{ background: 'rgba(201,168,60,0.05)', border: `1px solid ${GOLD_BORDER}` }}>
                <span className="font-serif flex-shrink-0 text-base" style={{ color: GOLD }}>{item.suit}</span>
                <span className="text-gray-300 text-sm">{item.texto}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Panel derecho — formulario ── */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 relative">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 50% 35% at 50% 0%, rgba(201,168,60,0.05), transparent)' }} />

        <div className="relative z-10 w-full max-w-sm flex flex-col gap-5">

          <button onClick={() => navigate('/')}
            className="flex items-center gap-1.5 text-gray-600 hover:text-gray-300 transition text-sm self-start mb-1">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5"/>
            </svg>
            Volver al inicio
          </button>

          {/* Logo mobile */}
          <div className="lg:hidden flex items-center gap-2.5 mb-1">
            <CardLogo />
            <span className="text-xl font-black">Truco<span style={{ color: GOLD }}>UY</span></span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">Iniciar sesión</h1>
            <p className="text-gray-500 text-sm mt-1">Bienvenido de vuelta a TrucoUY</p>
          </div>

          {desde && (
            <div className="text-sm px-4 py-3 rounded-2xl flex items-center gap-2"
                 style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}`, color: GOLD_LIGHT }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 flex-shrink-0">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z"/>
              </svg>
              Iniciá sesión para continuar
            </div>
          )}

          {error && (
            <div className="bg-red-950/50 border border-red-700/40 text-red-400 text-sm px-4 py-3 rounded-2xl">
              {error}
            </div>
          )}

          <button onClick={handleGoogle} disabled={cargando}
            className="w-full flex items-center justify-center gap-3 bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.07] hover:border-white/[0.15] text-white py-3.5 rounded-2xl font-semibold transition-all text-sm disabled:opacity-40">
            <GoogleIcon />
            Continuar con Google
          </button>

          <div className="flex items-center gap-3">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-gray-700 text-[11px] uppercase tracking-wider">o con email</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          <form onSubmit={handleEmail} className="flex flex-col gap-4">
            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className="w-full bg-white/[0.04] border border-white/[0.08] outline-none text-white px-4 py-3 rounded-xl text-sm transition placeholder-gray-700"
                style={{ transition: 'border-color 0.15s' }}
                onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </Field>
            <Field label="Contraseña">
              <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                placeholder="••••••••" required
                className="w-full bg-white/[0.04] border border-white/[0.08] outline-none text-white px-4 py-3 rounded-xl text-sm transition placeholder-gray-700"
                onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </Field>
            <button type="submit" disabled={cargando}
              className="w-full py-3.5 rounded-2xl font-bold transition-all text-sm mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{ background: GOLD, color: '#07090d' }}
              onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = GOLD_LIGHT }}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}>
              {cargando ? 'Ingresando...' : 'Ingresar →'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            ¿No tenés cuenta?{' '}
            <button onClick={() => navigate('/registro')} className="font-semibold transition" style={{ color: GOLD }}
              onMouseEnter={e => e.target.style.color = GOLD_LIGHT}
              onMouseLeave={e => e.target.style.color = GOLD}>
              Registrate gratis
            </button>
          </p>

        </div>
      </div>
    </div>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest">{label}</label>
      {children}
    </div>
  )
}
