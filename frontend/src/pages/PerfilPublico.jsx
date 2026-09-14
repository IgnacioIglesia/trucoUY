import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { doc, getDoc, collection, getDocs, query, where, orderBy, limit } from 'firebase/firestore'
import { db } from '../firebase'
import Navbar from '../components/Navbar'
import Avatar from '../components/Avatar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'
import EmptyState from '../components/EmptyState'

const GOLD        = '#c9a83c'
const GOLD_LIGHT  = '#e8c96a'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

function IconBolt({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ display: 'inline', flexShrink: 0 }}>
      <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" fill="currentColor" />
    </svg>
  )
}
function IconFlame({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <path d="M8.5 14.5A2.5 2.5 0 0011 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 11-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 002.5 2.5z" />
    </svg>
  )
}
function IconCold({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <line x1="2" y1="12" x2="22" y2="12" />
      <line x1="12" y1="2" x2="12" y2="22" />
      <path d="M20 16l-4-4 4-4M4 8l4 4-4 4M16 4l-4 4-4-4M8 20l4-4 4 4" />
    </svg>
  )
}

function timeAgo(date) {
  if (!date) return ''
  const diff = (Date.now() - date.getTime()) / 1000
  if (diff < 60)     return 'Hace un momento'
  if (diff < 3600)   return `Hace ${Math.floor(diff / 60)} min`
  if (diff < 86400)  return `Hace ${Math.floor(diff / 3600)}h`
  if (diff < 604800) return `Hace ${Math.floor(diff / 86400)}d`
  return date.toLocaleDateString('es-UY', { day: 'numeric', month: 'short' })
}

function WinrateRing({ pct }) {
  const r    = 42
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="120" height="120" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={GOLD} strokeWidth="11"
        strokeDasharray={`${dash} ${circ}`} strokeDashoffset={circ * 0.25} strokeLinecap="round" />
      <text x="50" y="46" textAnchor="middle" fill={GOLD}
        fontSize="22" fontWeight="900" fontFamily="system-ui,sans-serif">{pct}%</text>
      <text x="50" y="61" textAnchor="middle" fill="#6b7280"
        fontSize="9" fontFamily="system-ui,sans-serif">winrate</text>
    </svg>
  )
}

export default function PerfilPublico() {
  usePageTitle('Perfil')
  const { uid } = useParams()

  const [perfil, setPerfil]   = useState(null)
  const [truco, setTruco]     = useState(null)
  const [elo, setElo]         = useState(null)
  const [cargando, setCargando] = useState(true)
  const [noExiste, setNoExiste] = useState(false)

  useEffect(() => {
    if (!uid) return
    cargarPerfil()
  }, [uid])

  const cargarPerfil = async () => {
    setCargando(true)
    try {
      const [userDoc, trucoSnap] = await Promise.all([
        getDoc(doc(db, 'users', uid)).catch(() => null),
        getDocs(query(collection(db, 'ranking_truco'), where('uid', '==', uid))).catch(() => null),
      ])

      if (userDoc?.exists()) {
        setPerfil(userDoc.data())
        if (userDoc.data().elo != null) setElo(userDoc.data().elo)
      } else {
        let nombre = null
        trucoSnap?.forEach(d => { if (!nombre) nombre = d.data().nombre })
        if (!nombre && !trucoSnap?.size) { setNoExiste(true); setCargando(false); return }
        setPerfil({ displayName: nombre || null, photoURL: '' })
      }

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
        recientes: entries.slice(0, 12).map(e => e.resultado),
      })
    } catch { setNoExiste(true) }
    setCargando(false)
  }

  const winrate = truco && truco.partidas > 0 ? Math.round(truco.victorias / truco.partidas * 100) : 0

  return (
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 70% 35% at 50% 0%, rgba(201,168,60,0.09), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.035) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 py-10 flex flex-col gap-6">

          {cargando ? (
            <div className="flex justify-center py-24">
              <div className="w-8 h-8 border-2 rounded-full animate-spin"
                   style={{ borderColor: 'rgba(201,168,60,0.15)', borderTopColor: GOLD }} />
            </div>
          ) : noExiste ? (
            <EmptyState icon="user" title="Perfil no encontrado"
              description="Este jugador todavía no tiene un perfil público."
              action={{ label: 'Volver al inicio', to: '/' }} size="lg" />
          ) : (
            <>
              {/* ── Hero ── */}
              <div className="rounded-3xl overflow-hidden"
                   style={{
                     background: 'linear-gradient(135deg, rgba(201,168,60,0.08) 0%, rgba(255,255,255,0.02) 55%, rgba(201,168,60,0.04) 100%)',
                     border: `1px solid ${GOLD_BORDER}`,
                   }}>
                <div className="relative px-6 pt-7 pb-6">
                  <span className="absolute right-5 top-3 select-none pointer-events-none font-serif"
                        style={{ fontSize: 100, color: 'rgba(201,168,60,0.06)', lineHeight: 1 }}>♠</span>

                  <div className="flex items-center gap-5 relative z-10">
                    <Avatar usuario={perfil} size="xl" />
                    <div className="flex-1 min-w-0">
                      <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate">
                        {perfil?.displayName || 'Jugador'}
                      </h1>
                      <div className="flex flex-wrap gap-2 mt-3">
                        {elo != null && (
                          <span className="text-xs font-bold px-3 py-1.5 rounded-full"
                                style={{ background: 'rgba(201,168,60,0.12)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
                            <IconBolt size={12} /> ELO {elo}
                          </span>
                        )}
                        {truco?.racha > 0 && (
                          <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-green-950/50 border border-green-700/30 text-green-400">
                            <IconFlame size={12} /> Racha +{truco.racha}
                          </span>
                        )}
                        {truco?.ultimaPartida && (
                          <span className="text-xs px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.07] text-gray-500">
                            Activo {timeAgo(truco.ultimaPartida)}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {truco && truco.partidas > 0 && (
                  <div className="grid grid-cols-3" style={{ borderTop: `1px solid ${GOLD_BORDER}` }}>
                    {[
                      { label: 'Partidas',  value: truco.partidas,  color: '#fff'    },
                      { label: 'Victorias', value: truco.victorias, color: '#4ade80' },
                      { label: 'Winrate',   value: `${winrate}%`,   color: GOLD      },
                    ].map((s, i) => (
                      <div key={i} className="flex flex-col items-center py-4 gap-0.5"
                           style={{ borderLeft: i > 0 ? `1px solid ${GOLD_BORDER}` : undefined }}>
                        <span className="text-2xl sm:text-3xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</span>
                        <span className="text-[11px] font-medium text-gray-600">{s.label}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* ── Stats detalle ── */}
              {truco && truco.partidas > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                  {/* Winrate ring */}
                  <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-5"
                       style={{ background: 'rgba(201,168,60,0.04)', border: `1px solid ${GOLD_BORDER}` }}>
                    <WinrateRing pct={winrate} />
                    <div className="flex w-full gap-3">
                      <div className="flex-1 flex flex-col items-center py-3 rounded-xl"
                           style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                        <span className="text-xl font-black text-green-400 tabular-nums">{truco.victorias}</span>
                        <span className="text-[10px] text-gray-600 mt-0.5">victorias</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center py-3 rounded-xl"
                           style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)' }}>
                        <span className="text-xl font-black text-red-400 tabular-nums">{truco.derrotas}</span>
                        <span className="text-[10px] text-gray-600 mt-0.5">derrotas</span>
                      </div>
                    </div>
                  </div>

                  {/* Historial + racha */}
                  <div className="rounded-2xl p-6 flex flex-col gap-5"
                       style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-widest mb-1">Racha actual</p>
                        <p className="text-4xl font-black tabular-nums"
                           style={{ color: truco.racha > 0 ? '#4ade80' : truco.racha < 0 ? '#f87171' : '#6b7280' }}>
                          {truco.racha === 0 ? '—' : truco.racha > 0 ? `+${truco.racha}` : truco.racha}
                        </p>
                      </div>
                      {truco.racha !== 0 && (
                        <span style={{ color: truco.racha > 0 ? '#f97316' : '#60a5fa' }}>
                          {truco.racha > 0 ? <IconFlame size={40} /> : <IconCold size={40} />}
                        </span>
                      )}
                    </div>

                    {truco.recientes.length > 0 && (
                      <div>
                        <p className="text-[10px] text-gray-600 mb-3">Últimas {truco.recientes.length} partidas</p>
                        <div className="flex items-end gap-1.5" style={{ height: 40 }}>
                          {truco.recientes.map((res, i) => (
                            <div key={i}
                                 style={{
                                   flex: 1,
                                   height: res === 'victoria' ? '100%' : '50%',
                                   background: res === 'victoria' ? 'rgba(74,222,128,0.65)' : 'rgba(248,113,113,0.5)',
                                   borderRadius: 4,
                                   alignSelf: 'flex-end',
                                 }} />
                          ))}
                        </div>
                      </div>
                    )}

                    <div>
                      <div className="flex justify-between text-[10px] text-gray-600 mb-1.5">
                        <span className="text-green-500">{truco.victorias}V</span>
                        <span className="text-red-500">{truco.derrotas}D</span>
                      </div>
                      <div className="flex h-2.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        {truco.victorias > 0 && (
                          <div className="rounded-l-full" style={{ width: `${winrate}%`, background: 'rgba(74,222,128,0.55)' }} />
                        )}
                        {truco.derrotas > 0 && (
                          <div className="rounded-r-full flex-1" style={{ background: 'rgba(248,113,113,0.35)' }} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <EmptyState icon="cards" title="Sin partidas registradas"
                  description="Este jugador todavía no tiene partidas guardadas." />
              )}
            </>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
