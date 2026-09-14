import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy, limit, serverTimestamp } from 'firebase/firestore'
import { auth, db } from '../firebase'
import { useAuth } from '../context/AuthContext'
import EmptyState from '../components/EmptyState'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'
import Avatar from '../components/Avatar'

const GOLD = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

const AVATARES_PRESET = [
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Felix',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Mia',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Luna',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Nova',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ranger',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Ghost',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Storm',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Blaze',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Pixel',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Neon',
  'https://api.dicebear.com/7.x/pixel-art/svg?seed=Shadow',
]

function timeAgo(date) {
  if (!date) return ''
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60)     return 'Hace un momento'
  if (diff < 3600)   return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400)  return `Hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })
}

export default function Perfil() {
  usePageTitle('Mi perfil')
  const { usuario, refrescarUsuario } = useAuth()
  const navigate = useNavigate()

  const [tab, setTab]             = useState('resumen')
  const [cargando, setCargando]   = useState(true)
  const [truco, setTruco]         = useState(null)
  const [rivales, setRivales]     = useState([])
  const [elo, setElo]             = useState(null)

  const [nombre, setNombre]       = useState('')
  const [avatarSel, setAvatarSel] = useState('')
  const [urlCustom, setUrlCustom] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito]         = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    if (!usuario) { navigate('/login'); return }
    setNombre(usuario.displayName || '')
    setAvatarSel(usuario.photoURL || '')
    cargarDatos()
  }, [usuario?.uid])

  const cargarDatos = async () => {
    if (!usuario) return
    setCargando(true)
    try {
      const [userDoc, trucoSnap, historialSnap] = await Promise.all([
        getDoc(doc(db, 'users', usuario.uid)).catch(() => null),
        getDocs(query(collection(db, 'ranking_truco'), where('uid', '==', usuario.uid))).catch(() => null),
        getDocs(query(collection(db, 'users', usuario.uid, 'historial'), orderBy('fecha', 'desc'), limit(20))).catch(() => null),
      ])

      if (userDoc?.exists()) {
        if (userDoc.data().elo != null) setElo(userDoc.data().elo)
      }

      // Truco stats
      const entries = []
      trucoSnap?.forEach(d => {
        const data = d.data()
        entries.push({ resultado: data.resultado, fecha: data.fecha?.toDate?.() || null })
      })
      entries.sort((a, b) => (b.fecha || 0) - (a.fecha || 0))

      const victorias = entries.filter(e => e.resultado === 'victoria').length
      const derrotas  = entries.filter(e => e.resultado === 'derrota').length
      let racha = 0
      if (entries.length > 0) {
        const tipo = entries[0].resultado
        for (const e of entries) { if (e.resultado === tipo) racha++; else break }
        if (tipo !== 'victoria') racha = -racha
      }
      setTruco({
        partidas: entries.length,
        victorias, derrotas, racha,
        ultimaPartida: entries[0]?.fecha || null,
        recientes: entries.slice(0, 10).map(e => e.resultado),
      })

      // Rival history
      const rivalMap = new Map()
      historialSnap?.forEach(d => {
        const data = d.data()
        const uid = data.rival_uid || '__anon__'
        if (!rivalMap.has(uid)) rivalMap.set(uid, { nombre: data.rival_nombre || 'Rival', photo: data.rival_photo || '', victorias: 0, derrotas: 0, ultimaFecha: null })
        const r = rivalMap.get(uid)
        if (data.resultado === 'victoria') r.victorias++; else r.derrotas++
        const fecha = data.fecha?.toDate?.() || null
        if (fecha && (!r.ultimaFecha || fecha > r.ultimaFecha)) r.ultimaFecha = fecha
      })
      setRivales([...rivalMap.values()].sort((a, b) => (b.ultimaFecha || 0) - (a.ultimaFecha || 0)).slice(0, 5))

    } catch { /* silent */ }
    setCargando(false)
  }

  const handleGuardar = async () => {
    if (!auth.currentUser) return
    setGuardando(true); setError('')
    try {
      const newPhoto = urlCustom.trim() || avatarSel || usuario?.photoURL || ''
      const newName  = nombre.trim() || usuario?.displayName || ''
      await updateProfile(auth.currentUser, { displayName: newName, photoURL: newPhoto })
      await setDoc(doc(db, 'users', auth.currentUser.uid), {
        displayName: newName, photoURL: newPhoto, updatedAt: serverTimestamp(),
      }, { merge: true })
      await refrescarUsuario()
      setExito(true); setUrlCustom('')
      setTimeout(() => setExito(false), 3000)
    } catch { setError('No se pudo guardar. Intentá de nuevo.') }
    finally { setGuardando(false) }
  }

  const avatarPreview  = urlCustom.trim() || avatarSel || null
  const usuarioPreview = { ...usuario, displayName: nombre || usuario?.displayName, photoURL: avatarPreview }

  if (!usuario) return null

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 65% 40% at 50% 0%, rgba(201,168,60,0.08), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-5">

          {/* ── Header ── */}
          <div className="rounded-3xl p-6 flex items-center gap-5"
               style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${GOLD_BORDER}` }}>
            <Avatar usuario={usuario} size="xl" />
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-extrabold text-white truncate">{usuario.displayName || 'Sin nombre'}</h1>
              <p className="text-gray-500 text-sm truncate">{usuario.email}</p>
              <div className="flex gap-2 flex-wrap mt-2">
                {truco && truco.partidas > 0 && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
                    {truco.partidas} partidas
                  </span>
                )}
                {truco?.racha !== 0 && truco?.racha != null && (
                  <span className={`text-[10px] font-semibold px-2.5 py-1 rounded-full border ${
                    truco.racha > 0 ? 'bg-green-950/50 border-green-700/30 text-green-400' : 'bg-red-950/50 border-red-700/30 text-red-400'
                  }`}>
                    Racha {truco.racha > 0 ? `+${truco.racha}` : truco.racha}
                  </span>
                )}
                {elo != null && (
                  <span className="text-[10px] font-semibold px-2.5 py-1 rounded-full"
                        style={{ background: 'rgba(201,168,60,0.06)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
                    ELO {elo}
                  </span>
                )}
                {truco?.ultimaPartida && (
                  <span className="text-[10px] font-semibold bg-white/[0.03] border border-white/[0.06] text-gray-600 px-2.5 py-1 rounded-full">
                    Activo {timeAgo(truco.ultimaPartida)}
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* ── Tabs ── */}
          <div className="flex gap-1.5 rounded-2xl p-1.5"
               style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.06)' }}>
            {[
              { id: 'resumen',  label: 'Resumen' },
              { id: 'rivales',  label: 'Rivales'  },
              { id: 'editar',   label: 'Editar perfil' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={tab === t.id
                  ? { background: GOLD, color: '#07090d' }
                  : { color: '#6b7280' }}
                onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = '#d1d5db' }}
                onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = '#6b7280' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ── RESUMEN ── */}
          {tab === 'resumen' && (
            <div className="flex flex-col gap-4">
              {cargando ? (
                <div className="flex flex-col gap-3">
                  <div className="rounded-2xl p-5 flex flex-col gap-4" style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                    <div className="grid grid-cols-3 gap-3">
                      {[0,1,2].map(i => <div key={i} className="h-16 bg-white/[0.06] rounded-xl animate-pulse" />)}
                    </div>
                    <div className="h-2 bg-white/[0.06] rounded-full animate-pulse" />
                  </div>
                </div>
              ) : !truco || truco.partidas === 0 ? (
                <EmptyState
                  icon="cards"
                  title="Aún no jugaste ninguna partida"
                  description="Jugá al Truco Online o contra la IA para ver tus estadísticas acá."
                  action={{ label: 'Ir a jugar', to: '/juegos' }}
                />
              ) : (
                <>
                  {/* Stats Truco */}
                  <div className="rounded-2xl p-5 flex flex-col gap-5"
                       style={{ background: 'rgba(201,168,60,0.04)', border: `1px solid ${GOLD_BORDER}` }}>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <span className="font-serif text-lg" style={{ color: GOLD }}>♠</span>
                        <p className="text-sm font-bold text-white">Estadísticas de Truco</p>
                      </div>
                      {truco.ultimaPartida && (
                        <span className="text-[10px] text-gray-600">{timeAgo(truco.ultimaPartida)}</span>
                      )}
                    </div>

                    <div className="grid grid-cols-3 gap-3">
                      <StatBox label="partidas" value={truco.partidas} color="#fff" />
                      <StatBox label="winrate" value={`${Math.round(truco.victorias / truco.partidas * 100)}%`} color={GOLD} />
                      <StatBox
                        label="racha"
                        value={truco.racha === 0 ? '—' : truco.racha > 0 ? `+${truco.racha}` : truco.racha}
                        color={truco.racha > 0 ? '#4ade80' : truco.racha < 0 ? '#f87171' : '#6b7280'}
                      />
                    </div>

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-600 mb-1.5">
                        <span className="text-green-500">{truco.victorias} victorias</span>
                        <span className="text-red-500">{truco.derrotas} derrotas</span>
                      </div>
                      <div className="flex h-2 rounded-full overflow-hidden bg-white/[0.04]">
                        {truco.victorias > 0 && (
                          <div className="bg-green-500/70 rounded-l-full" style={{ width: `${Math.round(truco.victorias / truco.partidas * 100)}%` }} />
                        )}
                        {truco.derrotas > 0 && (
                          <div className="bg-red-500/50 rounded-r-full flex-1" />
                        )}
                      </div>
                    </div>

                    {truco.recientes.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-600 mb-2">Últimas {truco.recientes.length} partidas</p>
                        <div className="flex gap-1 flex-wrap">
                          {truco.recientes.map((res, i) => (
                            <span key={i}
                              className={`w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold flex-shrink-0 ${
                                res === 'victoria'
                                  ? 'bg-green-500/20 border border-green-500/40 text-green-400'
                                  : 'bg-red-500/20 border border-red-500/30 text-red-400'
                              }`}>
                              {res === 'victoria' ? 'V' : 'D'}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Accesos rápidos */}
                  <div className="grid grid-cols-2 gap-3">
                    <button onClick={() => navigate('/juegos/truco-online')}
                      className="flex flex-col gap-1.5 rounded-2xl p-4 text-left transition-all"
                      style={{ background: 'rgba(201,168,60,0.05)', border: `1px solid ${GOLD_BORDER}` }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = GOLD}
                      onMouseLeave={e => e.currentTarget.style.borderColor = GOLD_BORDER}>
                      <span className="font-serif text-lg" style={{ color: GOLD }}>♠</span>
                      <p className="text-sm font-bold">Truco Online</p>
                      <p className="text-xs text-gray-600">1vs1 y 2vs2 en vivo</p>
                    </button>
                    <button onClick={() => navigate('/juegos/truco')}
                      className="flex flex-col gap-1.5 rounded-2xl p-4 text-left bg-white/[0.025] border border-white/[0.07] transition-all"
                      onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,168,60,0.2)'; e.currentTarget.style.background = 'rgba(255,255,255,0.04)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)'; e.currentTarget.style.background = 'rgba(255,255,255,0.025)' }}>
                      <span className="font-serif text-lg text-gray-500">♣</span>
                      <p className="text-sm font-bold">Truco vs IA</p>
                      <p className="text-xs text-gray-600">Practicá cuando quieras</p>
                    </button>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ── RIVALES ── */}
          {tab === 'rivales' && (
            <div className="flex flex-col gap-2">
              {cargando ? (
                <div className="flex justify-center py-12">
                  <div className="w-6 h-6 border-2 rounded-full animate-spin"
                       style={{ borderColor: 'rgba(201,168,60,0.2)', borderTopColor: GOLD }} />
                </div>
              ) : rivales.length === 0 ? (
                <EmptyState
                  icon="cards"
                  title="Sin rivales todavía"
                  description="Jugá partidas online para ver con quiénes te enfrentaste."
                  action={{ label: 'Jugar Online', to: '/juegos/truco-online' }}
                />
              ) : (
                <div className="rounded-2xl overflow-hidden"
                     style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  {rivales.map((rival, i) => (
                    <div key={rival.nombre + i}
                         className={`flex items-center gap-3 px-4 py-3.5 ${i < rivales.length - 1 ? 'border-b border-white/[0.05]' : ''}`}>
                      <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
                           style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}` }}>
                        {rival.photo
                          ? <img src={rival.photo} alt="" className="w-full h-full object-cover" />
                          : <span className="text-xs font-bold" style={{ color: GOLD }}>{(rival.nombre || 'R').slice(0, 2).toUpperCase()}</span>
                        }
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-semibold truncate">{rival.nombre}</p>
                        <p className="text-gray-600 text-[10px] mt-0.5">{timeAgo(rival.ultimaFecha)}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <span className="text-green-400 text-sm font-bold tabular-nums">{rival.victorias}V</span>
                        <span className="text-gray-700 text-xs">·</span>
                        <span className="text-red-400 text-sm font-bold tabular-nums">{rival.derrotas}D</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* ── EDITAR PERFIL ── */}
          {tab === 'editar' && (
            <div className="flex flex-col gap-4">

              <div className="rounded-2xl p-5 flex items-center gap-4"
                   style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <Avatar usuario={usuarioPreview} size="xl" />
                <div className="min-w-0">
                  <p className="text-white font-bold text-base truncate">{nombre || usuario?.displayName || 'Sin nombre'}</p>
                  <p className="text-gray-500 text-sm truncate">{usuario?.email}</p>
                </div>
              </div>

              <div className="rounded-2xl p-5 flex flex-col gap-3"
                   style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold text-gray-300">Nombre de usuario</p>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={30}
                  className="bg-white/[0.04] border border-white/[0.08] outline-none rounded-xl px-4 py-3 text-white text-sm transition placeholder-gray-600"
                  onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              <div className="rounded-2xl p-5 flex flex-col gap-4"
                   style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <p className="text-sm font-semibold text-gray-300">Elegí un avatar</p>
                <div className="grid grid-cols-6 gap-2.5">
                  {AVATARES_PRESET.map(url => {
                    const sel = avatarSel === url && !urlCustom.trim()
                    return (
                      <button key={url} onClick={() => { setAvatarSel(url); setUrlCustom('') }}
                        className="aspect-square rounded-xl overflow-hidden border-2 transition-all"
                        style={{ borderColor: sel ? GOLD : 'rgba(255,255,255,0.08)', transform: sel ? 'scale(1.05)' : 'scale(1)' }}>
                        <img src={url} alt="" className="w-full h-full object-cover" style={{ background: '#07090d' }} />
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-col gap-2 pt-2 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-500">O pegá la URL de tu foto</p>
                  <input
                    value={urlCustom}
                    onChange={e => setUrlCustom(e.target.value)}
                    placeholder="https://..."
                    className="bg-white/[0.04] border border-white/[0.08] outline-none rounded-xl px-4 py-2.5 text-white text-sm transition placeholder-gray-600"
                    onFocus={e => e.target.style.borderColor = GOLD_BORDER}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              {error && <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-2.5">{error}</p>}
              {exito && <p className="text-sm bg-green-950/40 border border-green-800/40 rounded-xl px-4 py-2.5" style={{ color: GOLD }}>✓ Perfil actualizado correctamente</p>}

              <button onClick={handleGuardar} disabled={guardando}
                className="py-3.5 rounded-2xl font-bold text-sm transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
                style={{ background: GOLD, color: '#07090d' }}
                onMouseEnter={e => { if (!guardando) e.currentTarget.style.background = GOLD_LIGHT }}
                onMouseLeave={e => e.currentTarget.style.background = GOLD}>
                {guardando ? 'Guardando...' : 'Guardar cambios'}
              </button>
            </div>
          )}

        </div>
      </div>
      <Footer />
    </div>
  )
}

function StatBox({ label, value, color }) {
  return (
    <div className="rounded-xl p-3 flex flex-col items-center gap-1" style={{ background: 'rgba(255,255,255,0.03)' }}>
      <span className="font-extrabold text-xl tabular-nums" style={{ color }}>{value}</span>
      <span className="text-gray-600 text-[10px]">{label}</span>
    </div>
  )
}
