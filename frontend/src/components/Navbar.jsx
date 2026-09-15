import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useNavigationGuard } from '../context/NavigationGuardContext'
import { auth } from '../firebase'
import { signOut } from 'firebase/auth'
import Avatar from './Avatar'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'

const CardLogo = () => (
  <div style={{
    width: 26, height: 34,
    background: '#07090d',
    border: `1.5px solid ${GOLD}`,
    borderRadius: 4,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  }}>
    <svg width="8" height="18" viewBox="0 0 30 68" fill={GOLD}>
      <path d="M15 2 C16 8 18 22 18 34 L15 40 L12 34 C12 22 14 8 15 2 Z"/>
      <path d="M3 32 C5 27 9 30 15 30 C21 30 25 27 27 32 C25 37 21 34 15 34 C9 34 5 37 3 32 Z"/>
      <rect x="13" y="40" width="4" height="15" rx="2"/><circle cx="15" cy="59" r="7"/>
    </svg>
  </div>
)

const IconUser = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
  </svg>
)

const IconLogout = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
  </svg>
)

const IconRanking = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4">
    <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z" />
  </svg>
)

function Navbar() {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { usuario } = useAuth()
  const [menuAbierto, setMenuAbierto]   = useState(false)
  const [mobileOpen, setMobileOpen]     = useState(false)
  const [pendingRoute, setPendingRoute] = useState(null)
  const menuRef = useRef(null)
  const { guard, clearGuard } = useNavigationGuard()

  const isActive = (ruta) =>
    location.pathname === ruta || location.pathname.startsWith(ruta + '/')

  const handleNavigate = (ruta) => {
    setMenuAbierto(false)
    setMobileOpen(false)
    if (guard) {
      setPendingRoute(ruta)
    } else {
      navigate(ruta)
    }
  }

  const confirmNavigation = () => {
    clearGuard()
    navigate(pendingRoute)
    setPendingRoute(null)
  }

  const cancelNavigation = () => setPendingRoute(null)

  const handleLogout = async () => {
    setMenuAbierto(false)
    setMobileOpen(false)
    clearGuard()
    await signOut(auth)
    navigate('/')
  }

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) setMenuAbierto(false)
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  useEffect(() => {
    setMobileOpen(false)
  }, [location.pathname])

  const links = [
    { label: 'Inicio',       ruta: '/'                    },
    { label: 'Truco Online', ruta: '/juegos/truco-online' },
    { label: 'vs IA',        ruta: '/juegos/truco'        },
    { label: 'Ranking',      ruta: '/ranking'             },
  ]

  return (
    <>
    <div className="sticky top-0 z-50">
      <nav className="h-14 flex items-center px-4 md:px-8 border-b bg-[#07090d]/92 backdrop-blur-md"
           style={{ borderColor: 'rgba(201,168,60,0.12)' }}>

        {/* Logo */}
        <button
          onClick={() => handleNavigate('/')}
          className="flex items-center gap-2.5 bg-transparent border-none flex-shrink-0"
        >
          <CardLogo />
          <span className="text-base font-bold text-white">
            Truco<span style={{ color: GOLD }}>UY</span>
          </span>
        </button>

        {/* Nav links — desktop */}
        <div className="hidden md:flex items-center gap-1 ml-8">
          {links.map(({ label, ruta }) => (
            <button
              key={ruta}
              onClick={() => handleNavigate(ruta)}
              className="text-sm px-3 py-1.5 rounded-lg transition-all duration-200"
              style={{
                color: isActive(ruta) ? '#e8c96a' : '#6b7280',
                background: isActive(ruta) ? 'rgba(201,168,60,0.08)' : 'transparent',
                border: isActive(ruta) ? '1px solid rgba(201,168,60,0.18)' : '1px solid transparent',
              }}
              onMouseEnter={e => {
                if (!isActive(ruta)) {
                  e.currentTarget.style.color = '#d4d4d4'
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)'
                }
              }}
              onMouseLeave={e => {
                if (!isActive(ruta)) {
                  e.currentTarget.style.color = '#6b7280'
                  e.currentTarget.style.background = 'transparent'
                }
              }}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-2">

          {/* Desktop user area */}
          <div className="hidden md:block">
            {usuario ? (
              <div className="relative" ref={menuRef}>
                <button
                  onClick={() => setMenuAbierto(v => !v)}
                  className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-xl hover:bg-white/[0.05] transition border border-transparent"
                  style={{ ':hover': { borderColor: 'rgba(201,168,60,0.2)' } }}
                >
                  <Avatar usuario={usuario} size="sm" />
                  <span className="text-sm text-gray-300 max-w-[120px] truncate">
                    {usuario.displayName || usuario.email?.split('@')[0]}
                  </span>
                  <svg
                    className={`w-3 h-3 text-gray-600 transition-transform duration-200 ${menuAbierto ? 'rotate-180' : ''}`}
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {menuAbierto && (
                  <div className="absolute right-0 mt-2 w-64 rounded-2xl border shadow-2xl shadow-black/70 overflow-hidden"
                       style={{ borderColor: 'rgba(201,168,60,0.18)', background: '#0c0c14', backdropFilter: 'blur(20px)' }}>

                    {/* Header con gradiente */}
                    <div className="relative overflow-hidden px-4 py-4"
                         style={{ background: 'linear-gradient(135deg, rgba(201,168,60,0.1) 0%, transparent 65%)' }}>
                      <div className="absolute inset-0 pointer-events-none"
                           style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.06) 1px, transparent 1px)', backgroundSize: '14px 14px' }} />
                      <div className="relative flex items-center gap-3">
                        <div className="flex-shrink-0 rounded-full p-0.5"
                             style={{ background: 'linear-gradient(135deg, rgba(201,168,60,0.55), rgba(201,168,60,0.15))' }}>
                          <Avatar usuario={usuario} size="md" />
                        </div>
                        <div className="min-w-0">
                          <p className="text-white text-sm font-bold truncate leading-snug">
                            {usuario.displayName || 'Usuario'}
                          </p>
                          <p className="text-gray-500 text-xs truncate mt-0.5">{usuario.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="h-px" style={{ background: 'rgba(201,168,60,0.1)' }} />

                    {/* Acciones */}
                    <div className="p-1.5 flex flex-col gap-0.5">
                      <button
                        onClick={() => handleNavigate('/perfil')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition group"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition"
                              style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <IconUser />
                        </span>
                        Mi perfil
                      </button>
                      <button
                        onClick={() => handleNavigate('/ranking')}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-gray-300 hover:text-white hover:bg-white/[0.05] rounded-xl transition group"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-white/[0.06] transition"
                              style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <IconRanking />
                        </span>
                        Ranking
                      </button>
                    </div>

                    <div className="h-px mx-3" style={{ background: 'rgba(255,255,255,0.05)' }} />

                    <div className="p-1.5">
                      <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.07] rounded-xl transition group"
                      >
                        <span className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 group-hover:bg-red-500/[0.1] transition"
                              style={{ background: 'rgba(255,255,255,0.03)' }}>
                          <IconLogout />
                        </span>
                        Cerrar sesión
                      </button>
                    </div>

                    <div className="px-4 py-2.5 border-t" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                      <p className="text-[10px] text-gray-700">TrucoUY · v1.5</p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleNavigate('/login')}
                  className="text-gray-400 hover:text-white text-sm transition px-3 py-1.5 rounded-lg hover:bg-white/[0.05]"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => handleNavigate('/registro')}
                  className="text-sm font-bold px-4 py-1.5 rounded-xl transition"
                  style={{ background: GOLD, color: '#07090d' }}
                  onMouseEnter={e => e.currentTarget.style.background = GOLD_LIGHT}
                  onMouseLeave={e => e.currentTarget.style.background = GOLD}
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>

          {/* Hamburger — mobile only */}
          <button
            className="md:hidden p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/[0.06] transition"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Menú"
          >
            {mobileOpen ? (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden bg-[#07090d]/97 backdrop-blur-md border-b" style={{ borderColor: 'rgba(201,168,60,0.1)' }}>
          <div className="px-4 py-3 flex flex-col gap-1">
            {links.map(({ label, ruta }) => (
              <button
                key={ruta}
                onClick={() => handleNavigate(ruta)}
                className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-semibold transition-all text-left"
                style={{
                  background: isActive(ruta) ? 'rgba(201,168,60,0.08)' : 'transparent',
                  border: isActive(ruta) ? '1px solid rgba(201,168,60,0.25)' : '1px solid transparent',
                  color: isActive(ruta) ? '#e8c96a' : '#9ca3af',
                }}
              >
                {isActive(ruta) && <span className="w-1 h-1 rounded-full flex-shrink-0" style={{ background: GOLD }} />}
                {label}
              </button>
            ))}

            <div className="h-px bg-white/[0.06] my-1" />

            {usuario ? (
              <>
                <div className="flex items-center gap-3 px-3 py-2.5">
                  <Avatar usuario={usuario} size="sm" />
                  <div className="min-w-0 flex-1">
                    <p className="text-white text-sm font-semibold truncate">{usuario.displayName || 'Usuario'}</p>
                    <p className="text-gray-600 text-xs truncate">{usuario.email}</p>
                  </div>
                </div>
                <button
                  onClick={() => handleNavigate('/perfil')}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-gray-400 hover:text-white hover:bg-white/[0.05] transition text-left"
                >
                  <IconUser />
                  Mi perfil
                </button>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm text-red-400 hover:text-red-300 hover:bg-red-500/[0.08] transition text-left"
                >
                  <IconLogout />
                  Cerrar sesión
                </button>
              </>
            ) : (
              <div className="flex flex-col gap-2 pt-1">
                <button
                  onClick={() => handleNavigate('/login')}
                  className="w-full py-2.5 rounded-xl border border-white/[0.08] text-gray-300 hover:text-white text-sm font-semibold transition hover:bg-white/[0.05]"
                >
                  Iniciar sesión
                </button>
                <button
                  onClick={() => handleNavigate('/registro')}
                  className="w-full py-2.5 rounded-xl text-sm font-bold transition"
                  style={{ background: GOLD, color: '#07090d' }}
                >
                  Registrarse
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>

    {/* Modal confirmación salir */}
    {pendingRoute && (
      <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={cancelNavigation} />
        <div className="relative z-10 bg-[#0f0f1a] border border-white/[0.09] rounded-3xl p-8 max-w-sm w-full flex flex-col gap-5 shadow-2xl shadow-black/60">
          <div className="flex items-start gap-4">
            <div className="w-11 h-11 rounded-xl bg-red-900/40 border border-red-700/30 flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 text-red-400">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"/>
              </svg>
            </div>
            <div>
              <h3 className="text-white font-bold text-base">¿Salir de la partida?</h3>
              <p className="text-gray-400 text-sm mt-1 leading-relaxed">
                {guard?.message || 'Si salís ahora perdés tu lugar en la sala y la partida terminará para todos.'}
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <button onClick={cancelNavigation} className="flex-1 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.07] text-white text-sm font-semibold transition">
              Quedarme
            </button>
            <button onClick={confirmNavigation} className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition">
              Salir igual
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
}

export default Navbar
