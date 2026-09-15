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

const GOLD       = '#c9a83c'
const GOLD_LIGHT = '#e8c96a'
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
function IconCheck({ size = 13 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <polyline points="20 6 9 17 4 12" />
    </svg>
  )
}
function IconTrophy({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <path d="M6 9H4a2 2 0 000 4h2" /><path d="M18 9h2a2 2 0 010 4h-2" />
      <path d="M6 2h12v7a6 6 0 01-12 0V2z" /><path d="M12 15v4" /><path d="M8 19h8" />
    </svg>
  )
}
function IconSword({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <polyline points="14.5 17.5 3 6 3 3 6 3 17.5 14.5" /><line x1="13" y1="19" x2="19" y2="13" />
      <line x1="16" y1="16" x2="20" y2="20" /><line x1="19" y1="21" x2="21" y2="19" />
    </svg>
  )
}
function IconShield({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}
function IconStar({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="1" style={{ display: 'inline', flexShrink: 0 }}>
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  )
}
function IconCrown({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <path d="M2 20h20" /><path d="M5 20l2-10 5 5 5-8 2 13" />
    </svg>
  )
}
function IconDiamond({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <path d="M2.7 10.3a2.41 2.41 0 000 3.41l7.59 7.58a2.41 2.41 0 003.41 0l7.58-7.58a2.41 2.41 0 000-3.41L13.69 2.71a2.41 2.41 0 00-3.41 0z" />
    </svg>
  )
}
function IconCards({ size = 16 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', flexShrink: 0 }}>
      <rect x="2" y="7" width="16" height="13" rx="2" /><path d="M22 5c0-1.1-.9-2-2-2H7" /><path d="M6 2c-1.1 0-2 .9-2 2" />
    </svg>
  )
}

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

function WinrateRing({ pct }) {
  const r   = 42
  const circ = 2 * Math.PI * r
  const dash = (pct / 100) * circ
  return (
    <svg width="148" height="148" viewBox="0 0 100 100">
      <circle cx="50" cy="50" r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="11" />
      <circle cx="50" cy="50" r={r} fill="none" stroke={GOLD} strokeWidth="11"
        strokeDasharray={`${dash} ${circ}`}
        strokeDashoffset={circ * 0.25}
        strokeLinecap="round" />
      <text x="50" y="46" textAnchor="middle" fill={GOLD}
        fontSize="24" fontWeight="900" fontFamily="system-ui,sans-serif">{pct}%</text>
      <text x="50" y="62" textAnchor="middle" fill="#6b7280"
        fontSize="9" fontFamily="system-ui,sans-serif">winrate</text>
    </svg>
  )
}

function HeroAvatar({ usuario }) {
  if (usuario?.photoURL) {
    return (
      <img src={usuario.photoURL} alt="" referrerPolicy="no-referrer"
           className="w-24 h-24 rounded-2xl object-cover flex-shrink-0"
           style={{ border: `2px solid ${GOLD_BORDER}`, boxShadow: '0 0 28px rgba(201,168,60,0.18)' }} />
    )
  }
  const ini = (usuario?.displayName || usuario?.email || '?').slice(0, 2).toUpperCase()
  return (
    <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black flex-shrink-0"
         style={{ background: 'rgba(201,168,60,0.12)', border: `2px solid ${GOLD_BORDER}`, color: GOLD }}>
      {ini}
    </div>
  )
}

export default function Perfil() {
  usePageTitle('Mi perfil')
  const { usuario, refrescarUsuario } = useAuth()
  const navigate = useNavigate()

  const [visible, setVisible]     = useState(false)
  const [tab, setTab]             = useState('resumen')
  const [cargando, setCargando]   = useState(true)
  const [truco, setTruco]         = useState(null)
  const [rivales, setRivales]     = useState([])
  const [historial, setHistorial] = useState([])
  const [elo, setElo]             = useState(null)

  const [nombre, setNombre]       = useState('')
  const [avatarSel, setAvatarSel] = useState('')
  const [urlCustom, setUrlCustom] = useState('')
  const [guardando, setGuardando] = useState(false)
  const [exito, setExito]         = useState(false)
  const [error, setError]         = useState('')

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

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
        getDocs(query(collection(db, 'users', usuario.uid, 'historial'), orderBy('fecha', 'desc'), limit(100))).catch(() => null),
      ])

      if (userDoc?.exists() && userDoc.data().elo != null) setElo(userDoc.data().elo)

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

      let mejorRacha = 0, curRachaMax = 0
      for (let i = entries.length - 1; i >= 0; i--) {
        if (entries[i].resultado === 'victoria') { curRachaMax++; if (curRachaMax > mejorRacha) mejorRacha = curRachaMax }
        else curRachaMax = 0
      }

      const ultDiez = entries.slice(0, 10)
      const winrateUlt10 = ultDiez.length > 0
        ? Math.round(ultDiez.filter(e => e.resultado === 'victoria').length / ultDiez.length * 100)
        : 0

      const now = new Date()
      const partidasMes = entries.filter(e =>
        e.fecha && e.fecha.getMonth() === now.getMonth() && e.fecha.getFullYear() === now.getFullYear()
      ).length

      setTruco({
        partidas: entries.length,
        victorias, derrotas, racha, mejorRacha,
        winrateUlt10, partidasMes,
        ultimaPartida: entries[0]?.fecha || null,
        recientes: entries.slice(0, 15).map(e => e.resultado),
      })

      const rawHistorial = []
      historialSnap?.forEach(d => {
        const data = d.data()
        rawHistorial.push({
          id: d.id,
          rival_nombre: data.rival_nombre || 'Rival',
          rival_photo: data.rival_photo || '',
          resultado: data.resultado,
          pts_yo: data.pts_yo ?? null,
          pts_rival: data.pts_rival ?? null,
          juego: data.juego || 'truco',
          fecha: data.fecha?.toDate?.() || null,
        })
      })
      setHistorial(rawHistorial)

      const rivalMap = new Map()
      historialSnap?.forEach(d => {
        const data = d.data()
        const uid = data.rival_uid || '__anon__'
        if (!rivalMap.has(uid)) rivalMap.set(uid, {
          nombre: data.rival_nombre || 'Rival',
          photo: data.rival_photo || '',
          victorias: 0, derrotas: 0, ultimaFecha: null,
        })
        const r = rivalMap.get(uid)
        if (data.resultado === 'victoria') r.victorias++; else r.derrotas++
        const fecha = data.fecha?.toDate?.() || null
        if (fecha && (!r.ultimaFecha || fecha > r.ultimaFecha)) r.ultimaFecha = fecha
      })
      setRivales(
        [...rivalMap.values()]
          .sort((a, b) => (b.victorias + b.derrotas) - (a.victorias + a.derrotas))
          .slice(0, 6)
      )
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
  const winrate        = truco && truco.partidas > 0 ? Math.round(truco.victorias / truco.partidas * 100) : 0

  const logros = truco ? [
    { id: 'primera',    label: 'Primera victoria',  desc: 'Ganá tu primera partida',          icon: <IconStar size={16} />,    earned: truco.victorias >= 1 },
    { id: 'racha3',     label: 'Racha de 3',         desc: '3 victorias consecutivas',         icon: <IconFlame size={16} />,   earned: truco.mejorRacha >= 3 },
    { id: 'llamas',     label: 'En llamas',           desc: '5 victorias consecutivas',         icon: <IconBolt size={16} />,    earned: truco.mejorRacha >= 5 },
    { id: 'imparable',  label: 'Imparable',           desc: '10 victorias consecutivas',        icon: <IconBolt size={16} />,    earned: truco.mejorRacha >= 10 },
    { id: 'jugador',    label: 'Jugador',             desc: '10 partidas jugadas',               icon: <IconCards size={16} />,   earned: truco.partidas >= 10 },
    { id: 'veterano',   label: 'Veterano',            desc: '50 partidas jugadas',               icon: <IconSword size={16} />,   earned: truco.partidas >= 50 },
    { id: 'centenario', label: 'Centenario',          desc: '100 partidas jugadas',              icon: <IconShield size={16} />,  earned: truco.partidas >= 100 },
    { id: 'crack',      label: 'Crack',               desc: '+70% winrate (mín. 20 partidas)',   icon: <IconCrown size={16} />,   earned: truco.partidas >= 20 && winrate >= 70 },
    { id: 'leyenda',    label: 'Leyenda',             desc: '+80% winrate (mín. 50 partidas)',   icon: <IconDiamond size={16} />, earned: truco.partidas >= 50 && winrate >= 80 },
    { id: 'trofeo',     label: 'Trofeo',              desc: '100 victorias totales',             icon: <IconTrophy size={16} />,  earned: truco.victorias >= 100 },
  ] : []

  if (!usuario) return null

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 70% 25% at 50% 0%, rgba(201,168,60,0.06), transparent)' }} />
        <div className="relative z-10 max-w-4xl mx-auto w-full px-4 py-8 flex flex-col gap-6">

          {/* ══════════════ HERO ══════════════ */}
          <div className="rounded-3xl overflow-hidden relative"
               style={{
                 background: 'linear-gradient(135deg, rgba(201,168,60,0.08) 0%, rgba(201,168,60,0.02) 50%, rgba(255,255,255,0.01) 100%)',
                 border: `1px solid ${GOLD_BORDER}`,
                 opacity: visible ? 1 : 0,
                 transform: visible ? 'none' : 'translateY(14px)',
                 transition: 'opacity 0.65s ease, transform 0.65s ease',
               }}>

            {/* Patrón de puntos */}
            <div className="absolute inset-0 pointer-events-none"
                 style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.05) 1px, transparent 1px)', backgroundSize: '20px 20px' }} />

            {/* Glow esquina derecha */}
            <div className="absolute top-0 right-0 w-48 h-48 pointer-events-none"
                 style={{ background: 'radial-gradient(ellipse at top right, rgba(201,168,60,0.1), transparent 70%)' }} />

            {/* Contenido */}
            <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center gap-5 px-6 pt-6 pb-5">

              {/* Avatar con borde dorado (no box-shadow — se clipea con overflow-hidden) */}
              <div className="flex-shrink-0 p-[3px] rounded-[15px]"
                   style={{ background: 'linear-gradient(135deg, rgba(201,168,60,0.55) 0%, rgba(201,168,60,0.15) 100%)' }}>
                <HeroAvatar usuario={usuario} />
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight truncate leading-tight">
                  {usuario.displayName || 'Sin nombre'}
                </h1>
                <p className="text-gray-500 text-sm mt-0.5 truncate">{usuario.email}</p>

                <div className="flex flex-wrap gap-2 mt-3">
                  {elo != null && (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full"
                          style={{ background: 'rgba(201,168,60,0.12)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
                      <IconBolt size={12} /> ELO {elo}
                    </span>
                  )}
                  {truco?.racha > 0 && (
                    <span className="flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full bg-green-950/50 border border-green-700/30 text-green-400">
                      <IconFlame size={12} /> Racha +{truco.racha}
                    </span>
                  )}
                  {truco?.racha < 0 && (
                    <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-red-950/40 border border-red-800/30 text-red-400">
                      Racha {truco.racha}
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

            {/* Stats strip */}
            {!cargando && truco && truco.partidas > 0 && (
              <div className="relative z-10 grid grid-cols-3"
                   style={{ borderTop: `1px solid ${GOLD_BORDER}` }}>
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

          {/* ══════════════ TABS ══════════════ */}
          <div className="flex gap-1.5 rounded-2xl p-1.5"
               style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(10px)', transition: 'opacity 0.65s ease 0.1s, transform 0.65s ease 0.1s' }}>
            {[
              { id: 'resumen',   label: 'Resumen'       },
              { id: 'historial', label: 'Historial'     },
              { id: 'logros',    label: 'Logros'        },
              { id: 'rivales',   label: 'Rivales'       },
              { id: 'editar',    label: 'Editar perfil' },
            ].map(t => (
              <button key={t.id} onClick={() => setTab(t.id)}
                className="flex-1 py-2.5 rounded-xl text-sm font-bold transition-all"
                style={tab === t.id ? { background: GOLD, color: '#07090d' } : { color: '#6b7280' }}
                onMouseEnter={e => { if (tab !== t.id) e.currentTarget.style.color = '#d1d5db' }}
                onMouseLeave={e => { if (tab !== t.id) e.currentTarget.style.color = '#6b7280' }}>
                {t.label}
              </button>
            ))}
          </div>

          {/* ══════════════ RESUMEN ══════════════ */}
          {tab === 'resumen' && (
            <div className="flex flex-col gap-4">
              {cargando ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {[0, 1].map(i => (
                    <div key={i} className="h-56 rounded-2xl animate-pulse" style={{ background: 'rgba(255,255,255,0.04)' }} />
                  ))}
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
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

                    {/* Winrate gauge */}
                    <div className="rounded-2xl p-6 flex flex-col items-center justify-center gap-5"
                         style={{ background: 'rgba(201,168,60,0.04)', border: `1px solid ${GOLD_BORDER}` }}>
                      <WinrateRing pct={winrate} />
                      <div className="flex w-full gap-3">
                        <div className="flex-1 flex flex-col items-center py-3 rounded-xl"
                             style={{ background: 'rgba(74,222,128,0.06)', border: '1px solid rgba(74,222,128,0.15)' }}>
                          <span className="text-2xl font-black text-green-400 tabular-nums">{truco.victorias}</span>
                          <span className="text-[10px] text-gray-600 mt-0.5">victorias</span>
                        </div>
                        <div className="flex-1 flex flex-col items-center py-3 rounded-xl"
                             style={{ background: 'rgba(248,113,113,0.05)', border: '1px solid rgba(248,113,113,0.12)' }}>
                          <span className="text-2xl font-black text-red-400 tabular-nums">{truco.derrotas}</span>
                          <span className="text-[10px] text-gray-600 mt-0.5">derrotas</span>
                        </div>
                      </div>
                    </div>

                    {/* Racha + historial de partidas */}
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
                            {truco.racha > 0 ? <IconFlame size={44} /> : <IconCold size={44} />}
                          </span>
                        )}
                      </div>

                      {/* History bars */}
                      {truco.recientes.length > 0 && (
                        <div>
                          <p className="text-[10px] text-gray-600 mb-3">Últimas {truco.recientes.length} partidas</p>
                          <div className="flex items-end gap-1.5" style={{ height: 44 }}>
                            {truco.recientes.map((res, i) => (
                              <div key={i} title={res === 'victoria' ? 'Victoria' : 'Derrota'}
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

                      {/* V/D bar */}
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

                  {/* Advanced stats strip */}
                  <div className="rounded-2xl overflow-hidden"
                       style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)' }}>
                    <div className="grid grid-cols-3 divide-x divide-white/[0.05]">
                      {[
                        { label: 'Mejor racha', value: truco.mejorRacha > 0 ? `+${truco.mejorRacha}` : '—', color: '#4ade80' },
                        { label: 'Últimas 10',  value: `${truco.winrateUlt10}%`,                             color: GOLD    },
                        { label: 'Este mes',    value: truco.partidasMes,                                    color: '#fff'  },
                      ].map((s, i) => (
                        <div key={i} className="flex flex-col items-center py-4 gap-1">
                          <span className="text-xl font-black tabular-nums" style={{ color: s.color }}>{s.value}</span>
                          <span className="text-[10px] text-gray-600">{s.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════ HISTORIAL ══════════════ */}
          {tab === 'historial' && (
            <div className="flex flex-col gap-3">
              {cargando ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 border-2 rounded-full animate-spin"
                       style={{ borderColor: 'rgba(201,168,60,0.15)', borderTopColor: GOLD }} />
                </div>
              ) : historial.length === 0 ? (
                <EmptyState
                  icon="cards"
                  title="Sin partidas registradas"
                  description="Jugá al Truco Online para ver el historial de tus partidas acá."
                  action={{ label: 'Jugar Online', to: '/juegos/truco-online' }}
                />
              ) : (
                <>
                  <p className="text-[11px] text-gray-600 uppercase tracking-widest px-1">
                    {historial.length} partidas · más recientes primero
                  </p>
                  <div className="flex flex-col gap-2">
                    {historial.map((p, i) => (
                      <div key={p.id || i}
                           className="rounded-2xl px-4 py-3 flex items-center gap-3"
                           style={{
                             background: p.resultado === 'victoria' ? 'rgba(74,222,128,0.04)' : 'rgba(248,113,113,0.03)',
                             border: p.resultado === 'victoria' ? '1px solid rgba(74,222,128,0.12)' : '1px solid rgba(248,113,113,0.1)',
                           }}>
                        {/* Rival avatar */}
                        <div className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                             style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
                          {p.rival_photo
                            ? <img src={p.rival_photo} alt="" className="w-full h-full object-cover" />
                            : <span className="text-[11px] font-bold text-gray-400">
                                {(p.rival_nombre || 'R').slice(0, 2).toUpperCase()}
                              </span>
                          }
                        </div>
                        {/* Rival name */}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-white truncate">vs {p.rival_nombre}</p>
                          {p.fecha && (
                            <p className="text-[11px] text-gray-600">{timeAgo(p.fecha)}</p>
                          )}
                        </div>
                        {/* Score */}
                        {p.pts_yo != null && p.pts_rival != null && (
                          <span className="text-sm font-black tabular-nums flex-shrink-0 text-gray-400">
                            <span style={{ color: p.resultado === 'victoria' ? '#4ade80' : '#f87171' }}>{p.pts_yo}</span>
                            <span className="text-gray-700 mx-1">—</span>
                            <span>{p.pts_rival}</span>
                          </span>
                        )}
                        {/* Badge */}
                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full flex-shrink-0"
                              style={p.resultado === 'victoria'
                                ? { background: 'rgba(74,222,128,0.12)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80' }
                                : { background: 'rgba(248,113,113,0.1)', border: '1px solid rgba(248,113,113,0.2)', color: '#f87171' }
                              }>
                          {p.resultado === 'victoria' ? 'Victoria' : 'Derrota'}
                        </span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════ LOGROS ══════════════ */}
          {tab === 'logros' && (
            <div className="flex flex-col gap-4">
              {cargando ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 border-2 rounded-full animate-spin"
                       style={{ borderColor: 'rgba(201,168,60,0.15)', borderTopColor: GOLD }} />
                </div>
              ) : !truco || truco.partidas === 0 ? (
                <EmptyState
                  icon="cards"
                  title="Todavía no tenés logros"
                  description="Jugá partidas para desbloquear tus primeros logros."
                  action={{ label: 'Ir a jugar', to: '/juegos' }}
                />
              ) : (
                <>
                  <div className="flex items-center justify-between px-1">
                    <p className="text-[11px] text-gray-600 uppercase tracking-widest">
                      {logros.filter(l => l.earned).length} / {logros.length} obtenidos
                    </p>
                    <div className="flex h-1.5 rounded-full overflow-hidden w-32"
                         style={{ background: 'rgba(255,255,255,0.06)' }}>
                      <div style={{ width: `${Math.round(logros.filter(l => l.earned).length / logros.length * 100)}%`, background: GOLD, borderRadius: 4 }} />
                    </div>
                  </div>
                  <div className="flex flex-col gap-2">
                    {logros.map(logro => (
                      <div key={logro.id}
                           className="flex items-center gap-3 rounded-2xl px-4 py-3.5 transition-all"
                           style={{
                             background: logro.earned ? 'rgba(201,168,60,0.06)' : 'rgba(255,255,255,0.02)',
                             border: logro.earned ? `1px solid rgba(201,168,60,0.2)` : '1px solid rgba(255,255,255,0.05)',
                             opacity: logro.earned ? 1 : 0.45,
                           }}>
                        <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                             style={{ background: logro.earned ? 'rgba(201,168,60,0.12)' : 'rgba(255,255,255,0.04)',
                                      color: logro.earned ? GOLD : '#4b5563' }}>
                          {logro.icon}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold" style={{ color: logro.earned ? '#fff' : '#6b7280' }}>{logro.label}</p>
                          <p className="text-[11px] text-gray-600 mt-0.5">{logro.desc}</p>
                        </div>
                        {logro.earned && (
                          <div className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0"
                               style={{ background: 'rgba(201,168,60,0.15)', color: GOLD }}>
                            <IconCheck size={11} />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════ RIVALES ══════════════ */}
          {tab === 'rivales' && (
            <div className="flex flex-col gap-3">
              {cargando ? (
                <div className="flex justify-center py-16">
                  <div className="w-7 h-7 border-2 rounded-full animate-spin"
                       style={{ borderColor: 'rgba(201,168,60,0.15)', borderTopColor: GOLD }} />
                </div>
              ) : rivales.length === 0 ? (
                <EmptyState
                  icon="cards"
                  title="Sin rivales todavía"
                  description="Jugá partidas online para ver con quiénes te enfrentaste."
                  action={{ label: 'Jugar Online', to: '/juegos/truco-online' }}
                />
              ) : (
                <>
                  <p className="text-[11px] text-gray-600 uppercase tracking-widest px-1">
                    {rivales.length} rivales · más jugados primero
                  </p>
                  <div className="flex flex-col gap-2">
                    {rivales.map((rival, i) => {
                      const total = rival.victorias + rival.derrotas
                      const pct   = total > 0 ? Math.round(rival.victorias / total * 100) : 0
                      return (
                        <div key={rival.nombre + i}
                             className="rounded-2xl px-4 py-4 flex items-center gap-4"
                             style={{
                               background: i === 0 ? 'rgba(201,168,60,0.04)' : 'rgba(255,255,255,0.025)',
                               border: i === 0 ? `1px solid ${GOLD_BORDER}` : '1px solid rgba(255,255,255,0.07)',
                             }}>
                          {/* Rank */}
                          <span className="w-5 text-xs font-bold tabular-nums text-center flex-shrink-0"
                                style={{ color: i === 0 ? GOLD : '#4b5563' }}>
                            {i + 1}
                          </span>
                          {/* Avatar */}
                          <div className="w-10 h-10 rounded-full overflow-hidden flex items-center justify-center flex-shrink-0"
                               style={{ background: 'rgba(201,168,60,0.08)', border: `1px solid ${GOLD_BORDER}` }}>
                            {rival.photo
                              ? <img src={rival.photo} alt="" className="w-full h-full object-cover" />
                              : <span className="text-xs font-bold" style={{ color: GOLD }}>
                                  {(rival.nombre || 'R').slice(0, 2).toUpperCase()}
                                </span>
                            }
                          </div>
                          {/* Name + bars */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between mb-2">
                              <p className="text-sm font-bold text-white truncate">{rival.nombre}</p>
                              <span className="text-xs font-bold tabular-nums flex-shrink-0 ml-2"
                                    style={{ color: pct >= 50 ? '#4ade80' : '#f87171' }}>
                                {pct}%
                              </span>
                            </div>
                            <div className="flex h-1.5 rounded-full overflow-hidden mb-1.5"
                                 style={{ background: 'rgba(255,255,255,0.06)' }}>
                              {rival.victorias > 0 && (
                                <div style={{ width: `${pct}%`, background: 'rgba(74,222,128,0.6)', borderRadius: 4 }} />
                              )}
                              {rival.derrotas > 0 && (
                                <div className="flex-1" style={{ background: 'rgba(248,113,113,0.4)', borderRadius: 4 }} />
                              )}
                            </div>
                            <div className="flex items-center gap-1.5">
                              <span className="text-[10px] text-green-500">{rival.victorias}V</span>
                              <span className="text-[10px] text-gray-700">·</span>
                              <span className="text-[10px] text-red-500">{rival.derrotas}D</span>
                              <span className="text-[10px] text-gray-700">·</span>
                              <span className="text-[10px] text-gray-600">{total} jugadas</span>
                              {rival.ultimaFecha && (
                                <>
                                  <span className="text-[10px] text-gray-700 ml-auto">
                                    {timeAgo(rival.ultimaFecha)}
                                  </span>
                                </>
                              )}
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                </>
              )}
            </div>
          )}

          {/* ══════════════ EDITAR PERFIL ══════════════ */}
          {tab === 'editar' && (
            <div className="flex flex-col gap-4 max-w-lg mx-auto w-full">

              {/* Preview card */}
              <div className="rounded-2xl p-6 flex flex-col items-center gap-3 text-center"
                   style={{ background: 'rgba(201,168,60,0.04)', border: `1px solid ${GOLD_BORDER}` }}>
                {avatarPreview ? (
                  <img src={avatarPreview} alt="" referrerPolicy="no-referrer"
                       className="w-24 h-24 rounded-2xl object-cover"
                       style={{ border: `2px solid ${GOLD}`, boxShadow: '0 0 22px rgba(201,168,60,0.25)' }} />
                ) : (
                  <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-black"
                       style={{ background: 'rgba(201,168,60,0.12)', border: `2px solid ${GOLD}`, color: GOLD }}>
                    {(nombre || usuario?.displayName || usuario?.email || '?').slice(0, 2).toUpperCase()}
                  </div>
                )}
                <div>
                  <p className="text-white font-extrabold text-lg leading-tight">
                    {nombre || usuario?.displayName || 'Sin nombre'}
                  </p>
                  <p className="text-gray-500 text-sm mt-0.5">{usuario?.email}</p>
                </div>
              </div>

              {/* Nombre */}
              <div className="rounded-2xl p-5 flex flex-col gap-2.5"
                   style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Nombre de usuario</p>
                <input
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
                  placeholder="Tu nombre"
                  maxLength={30}
                  className="bg-white/[0.04] border border-white/[0.08] outline-none rounded-xl px-4 py-3 text-white text-sm transition-all placeholder-gray-600"
                  onFocus={e => e.target.style.borderColor = GOLD}
                  onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                />
              </div>

              {/* Avatar grid */}
              <div className="rounded-2xl p-5 flex flex-col gap-4"
                   style={{ background: 'rgba(255,255,255,0.025)', border: '1px solid rgba(255,255,255,0.07)' }}>
                <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest">Elegí un avatar</p>
                <div className="grid grid-cols-4 gap-3">
                  {AVATARES_PRESET.map(url => {
                    const sel = avatarSel === url && !urlCustom.trim()
                    return (
                      <button key={url} onClick={() => { setAvatarSel(url); setUrlCustom('') }}
                        className="aspect-square rounded-xl overflow-hidden transition-all"
                        style={{
                          border: sel ? `2px solid ${GOLD}` : '2px solid rgba(255,255,255,0.08)',
                          transform: sel ? 'scale(1.06)' : 'scale(1)',
                          boxShadow: sel ? '0 0 18px rgba(201,168,60,0.30)' : 'none',
                        }}>
                        <img src={url} alt="" className="w-full h-full object-cover" style={{ background: '#07090d' }} />
                      </button>
                    )
                  })}
                </div>
                <div className="flex flex-col gap-2 pt-3 border-t border-white/[0.06]">
                  <p className="text-xs text-gray-500">O pegá la URL de tu foto</p>
                  <input
                    value={urlCustom}
                    onChange={e => setUrlCustom(e.target.value)}
                    placeholder="https://..."
                    className="bg-white/[0.04] border border-white/[0.08] outline-none rounded-xl px-4 py-2.5 text-white text-sm transition-all placeholder-gray-600"
                    onFocus={e => e.target.style.borderColor = GOLD}
                    onBlur={e => e.target.style.borderColor = 'rgba(255,255,255,0.08)'}
                  />
                </div>
              </div>

              {error && (
                <p className="text-red-400 text-sm bg-red-950/40 border border-red-800/40 rounded-xl px-4 py-3">{error}</p>
              )}
              {exito && (
                <p className="text-sm bg-green-950/40 border border-green-800/40 rounded-xl px-4 py-3" style={{ color: GOLD }}>
                  <span className="flex items-center gap-1.5"><IconCheck size={13} /> Perfil actualizado correctamente</span>
                </p>
              )}

              <button onClick={handleGuardar} disabled={guardando}
                className="py-4 rounded-2xl font-black text-sm tracking-wide transition-all hover:scale-[1.02] disabled:opacity-40 disabled:cursor-not-allowed"
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
