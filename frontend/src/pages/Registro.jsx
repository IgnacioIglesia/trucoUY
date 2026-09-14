import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { auth, googleProvider } from '../firebase'
import { createUserWithEmailAndPassword, signInWithPopup, updateProfile } from 'firebase/auth'
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

export default function Registro() {
  usePageTitle('Crear cuenta')
  const navigate  = useNavigate()
  const [nombre,   setNombre]   = useState('')
  const [email,    setEmail]    = useState('')
  const [password, setPassword] = useState('')
  const [confirmar,setConfirmar]  = useState('')
  const [error,    setError]      = useState('')
  const [cargando, setCargando]   = useState(false)
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  const handleRegistro = async (e) => {
    e.preventDefault()
    setError('')
    if (password !== confirmar) { setError('Las contraseñas no coinciden.'); return }
    if (password.length < 6)   { setError('La contraseña debe tener al menos 6 caracteres.'); return }
    setCargando(true)
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password)
      await updateProfile(result.user, { displayName: nombre.trim() })
      navigate('/juegos', { state: { bienvenida: true } })
    } catch (err) {
      if (err.code === 'auth/email-already-in-use') setError('Este email ya está registrado.')
      else setError('Ocurrió un error. Intentá de nuevo.')
    }
    setCargando(false)
  }

  const handleGoogle = async () => {
    setCargando(true)
    setError('')
    try {
      await signInWithPopup(auth, googleProvider)
      navigate('/juegos', { state: { bienvenida: true } })
    } catch {
      setError('No se pudo registrar con Google.')
    }
    setCargando(false)
  }

  const noCoinciden = confirmar.length > 0 && password !== confirmar
  const coinciden   = confirmar.length > 0 && password === confirmar

  const inputBase = 'w-full bg-white/[0.04] border border-white/[0.08] outline-none text-white px-4 py-3 rounded-xl text-sm placeholder-gray-700'

  return (
    <div className="min-h-screen text-white flex" style={{ background: '#07090d' }}>

      {/* ── Panel izquierdo ── */}
      <div className="hidden lg:flex w-[460px] flex-shrink-0 flex-col justify-center p-14 relative overflow-hidden"
           style={{ background: 'linear-gradient(155deg, #0a0d07 0%, #060809 100%)' }}>

        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 80% 70% at 30% 40%, rgba(201,168,60,0.09), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.07) 1px, transparent 1px)', backgroundSize: '22px 22px' }} />
        <div className="absolute right-0 inset-y-0 w-px pointer-events-none"
             style={{ background: 'linear-gradient(to bottom, transparent, rgba(201,168,60,0.2), transparent)' }} />
        <span className="absolute -bottom-8 -right-4 font-serif select-none pointer-events-none leading-none"
              style={{ fontSize: 200, color: 'rgba(201,168,60,0.04)' }} aria-hidden>♣</span>

        <div className="relative z-10 flex flex-col gap-10 max-w-xs">

          <button onClick={() => navigate('/')} className="flex items-center gap-3">
            <CardLogo />
            <span className="text-2xl font-black text-white">Truco<span style={{ color: GOLD }}>UY</span></span>
          </button>

          <div>
            <h2 className="text-2xl font-extrabold leading-snug">Empezá a jugar hoy.</h2>
            <p className="text-gray-500 text-sm mt-2 leading-relaxed">
              Creá tu cuenta gratis y uníte a miles de jugadores.
            </p>
          </div>

          <div className="flex flex-col gap-2.5">
            {[
              { suit: '♠', texto: 'Truco Online 1vs1 y 2vs2' },
              { suit: '♥', texto: 'Jugá contra amigos en tiempo real' },
              { suit: '♦', texto: 'Ranking y estadísticas' },
              { suit: '♣', texto: 'Completamente gratis' },
            ].map((item, i) => (
              <div key={i} className="flex items-center gap-3 rounded-2xl px-4 py-3"
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

          <div className="lg:hidden flex items-center gap-2.5 mb-1">
            <CardLogo />
            <span className="text-xl font-black">Truco<span style={{ color: GOLD }}>UY</span></span>
          </div>

          <div>
            <h1 className="text-2xl font-extrabold">Crear cuenta</h1>
            <p className="text-gray-500 text-sm mt-1">Uníte gratis y empezá a jugar</p>
          </div>

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

          <form onSubmit={handleRegistro} className="flex flex-col gap-4">

            <Field label="Nombre">
              <input type="text" value={nombre} onChange={e => setNombre(e.target.value)}
                placeholder="Tu nombre" required maxLength={30}
                className={inputBase}
                onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </Field>

            <Field label="Email">
              <input type="email" value={email} onChange={e => setEmail(e.target.value)}
                placeholder="tu@email.com" required
                className={inputBase}
                onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
            </Field>

            <div className="grid grid-cols-2 gap-3">
              <Field label="Contraseña">
                <input type="password" value={password} onChange={e => setPassword(e.target.value)}
                  placeholder="Mín. 6 caracteres" required
                  className={inputBase}
                  onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'} />
              </Field>
              <Field label="Confirmar">
                <input type="password" value={confirmar} onChange={e => setConfirmar(e.target.value)}
                  placeholder="Repetí" required
                  className={`${inputBase} ${noCoinciden ? 'border-red-500/70' : coinciden ? 'border-green-500/60' : ''}`}
                  onFocus={e => { if (!noCoinciden && !coinciden) e.target.style.borderColor = GOLD_BORDER }}
                  onBlur={e => { if (!noCoinciden && !coinciden) e.target.style.borderColor = 'rgba(255,255,255,0.08)' }} />
              </Field>
            </div>

            {noCoinciden && (
              <p className="text-red-400 text-xs -mt-2 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                Las contraseñas no coinciden
              </p>
            )}
            {coinciden && (
              <p className="text-green-400 text-xs -mt-2 flex items-center gap-1.5">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3 flex-shrink-0"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                Las contraseñas coinciden
              </p>
            )}

            <label className="flex items-start gap-3 cursor-pointer group mt-1">
              <div className="w-4 h-4 mt-0.5 rounded flex-shrink-0 border-2 flex items-center justify-center transition-all"
                   style={{
                     background: aceptaTerminos ? GOLD : 'transparent',
                     borderColor: aceptaTerminos ? GOLD : 'rgba(255,255,255,0.2)',
                   }}
                   onClick={() => setAceptaTerminos(v => !v)}>
                {aceptaTerminos && (
                  <svg viewBox="0 0 24 24" fill="none" stroke="#07090d" strokeWidth="3" className="w-2.5 h-2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/>
                  </svg>
                )}
              </div>
              <input type="checkbox" checked={aceptaTerminos} onChange={e => setAceptaTerminos(e.target.checked)} className="sr-only" />
              <span className="text-gray-500 text-xs leading-relaxed">
                Acepto los{' '}
                <Link to="/terminos" target="_blank" className="underline underline-offset-2 transition"
                      style={{ color: GOLD }}
                      onMouseEnter={e => e.target.style.color = GOLD_LIGHT}
                      onMouseLeave={e => e.target.style.color = GOLD}>
                  Términos y Condiciones
                </Link>
                {' '}y la{' '}
                <Link to="/privacidad" target="_blank" className="underline underline-offset-2 transition"
                      style={{ color: GOLD }}
                      onMouseEnter={e => e.target.style.color = GOLD_LIGHT}
                      onMouseLeave={e => e.target.style.color = GOLD}>
                  Política de Privacidad
                </Link>
              </span>
            </label>

            <button type="submit" disabled={cargando || noCoinciden || !aceptaTerminos}
              className="w-full py-3.5 rounded-2xl font-bold transition-all text-sm mt-1 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-[1.02]"
              style={{ background: GOLD, color: '#07090d' }}
              onMouseEnter={e => { if (!cargando) e.currentTarget.style.background = GOLD_LIGHT }}
              onMouseLeave={e => e.currentTarget.style.background = GOLD}>
              {cargando ? 'Creando cuenta...' : 'Crear cuenta →'}
            </button>
          </form>

          <p className="text-center text-gray-600 text-sm">
            ¿Ya tenés cuenta?{' '}
            <button onClick={() => navigate('/login')} className="font-semibold transition" style={{ color: GOLD }}
              onMouseEnter={e => e.target.style.color = GOLD_LIGHT}
              onMouseLeave={e => e.target.style.color = GOLD}>
              Iniciá sesión
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
