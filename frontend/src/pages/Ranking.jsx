import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { db } from '../firebase'
import { collection, getDocs } from 'firebase/firestore'
import Navbar from '../components/Navbar'
import { usePageTitle } from '../hooks/usePageTitle'
import Footer from '../components/Footer'
import EmptyState from '../components/EmptyState'

const GOLD = '#c9a83c'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

function MedalBadge({ pos }) {
  if (pos === 0) return <div className="w-7 h-7 rounded-full bg-yellow-500/20 border border-yellow-500/40 flex items-center justify-center text-yellow-400 text-xs font-black flex-shrink-0">1</div>
  if (pos === 1) return <div className="w-7 h-7 rounded-full bg-gray-300/10 border border-gray-300/25 flex items-center justify-center text-gray-300 text-xs font-black flex-shrink-0">2</div>
  if (pos === 2) return <div className="w-7 h-7 rounded-full bg-orange-500/15 border border-orange-400/30 flex items-center justify-center text-orange-300 text-xs font-black flex-shrink-0">3</div>
  return <span className="text-gray-600 text-sm font-bold tabular-nums w-7 text-center flex-shrink-0">{pos + 1}</span>
}

function Avatar({ jugador }) {
  const iniciales = (jugador.nombre || 'J').slice(0, 2).toUpperCase()
  return (
    <div className="w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0 overflow-hidden"
         style={{ background: 'rgba(201,168,60,0.1)', border: `1px solid ${GOLD_BORDER}` }}>
      {jugador.photoURL ? (
        <img src={jugador.photoURL} alt="" className="w-full h-full object-cover"
             referrerPolicy="no-referrer"
             onError={e => { e.currentTarget.style.display = 'none' }} />
      ) : (
        <span className="font-extrabold text-xs" style={{ color: GOLD }}>{iniciales}</span>
      )}
    </div>
  )
}

export default function Ranking() {
  usePageTitle('Ranking')
  const navigate = useNavigate()
  const [ranking, setRanking] = useState([])
  const [cargando, setCargando] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    const cargar = async () => {
      setCargando(true)
      try {
        const [snap, usersSnap] = await Promise.all([
          getDocs(collection(db, 'ranking_truco')),
          getDocs(collection(db, 'users')).catch(() => null),
        ])
        const perfiles = {}
        usersSnap?.forEach(doc => {
          const d = doc.data()
          perfiles[doc.id] = { nombre: d.displayName || d.nombre || '', photoURL: d.photoURL || '' }
        })
        const porUsuario = {}
        snap.forEach(doc => {
          const d = doc.data()
          if (!porUsuario[d.uid]) {
            porUsuario[d.uid] = {
              uid: d.uid,
              nombre: perfiles[d.uid]?.nombre || d.nombre || 'Jugador',
              photoURL: perfiles[d.uid]?.photoURL || d.photoURL || '',
              victorias: 0, derrotas: 0,
            }
          }
          if (d.resultado === 'victoria') porUsuario[d.uid].victorias++
          else porUsuario[d.uid].derrotas++
        })
        const lista = Object.values(porUsuario)
          .map(u => ({
            ...u,
            partidas: u.victorias + u.derrotas,
            winrate: u.victorias + u.derrotas > 0
              ? Math.round((u.victorias / (u.victorias + u.derrotas)) * 100) : 0,
          }))
          .sort((a, b) => b.victorias - a.victorias || b.winrate - a.winrate)
          .slice(0, 50)
        setRanking(lista)
      } catch { setRanking([]) }
      setCargando(false)
    }
    cargar()
  }, [])

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1" style={{ minHeight: 'calc(100vh - 56px)' }}>

        {/* Glow central */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 40% at 50% 30%, rgba(201,168,60,0.07), transparent)' }} />

        {/* Oro — izquierda, centrada */}
        <svg className="hidden sm:block absolute left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none" aria-hidden
             width="130" height="130" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.15)" strokeWidth="2.2"/>
          <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.11)" strokeWidth="1.6"/>
          <circle cx="23" cy="4"  r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="4"  cy="23" r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.15)"/>
        </svg>

        {/* Basto — derecha, centrada */}
        <svg className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none" aria-hidden
             width="90" height="200" viewBox="0 0 30 68" fill="none">
          <circle cx="15" cy="10" r="10" fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <circle cx="15" cy="27" r="8.5" fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <circle cx="15" cy="42" r="7"   fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.11)" strokeWidth="0.8"/>
        </svg>

        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 pt-10 pb-12">

          {/* Header */}
          <div className="text-center mb-10 flex flex-col items-center gap-4"
               style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ background: 'rgba(201,168,60,0.07)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
              <svg width="7" height="15" viewBox="0 0 30 68" fill="currentColor" style={{ display: 'inline', flexShrink: 0 }}>
                <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"/>
                <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"/>
                <rect x="13.5" y="38" width="3" height="14" rx="1.5"/><ellipse cx="15" cy="58" rx="7" ry="5"/>
              </svg>
              Tabla global
            </span>
            <div>
              <h1 className="text-6xl sm:text-7xl font-black leading-none tracking-tight">Ranking</h1>
              <p className="text-gray-600 text-sm mt-3">Los mejores jugadores de TrucoUY</p>
            </div>
          </div>

          {/* Contenido */}
          {cargando ? (
            <div className="flex flex-col gap-2">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 bg-white/[0.02] rounded-2xl px-4 py-3">
                  <div className="w-5 h-4 bg-white/[0.06] rounded animate-pulse flex-shrink-0" />
                  <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse flex-shrink-0" />
                  <div className="flex-1 h-4 bg-white/[0.06] rounded-lg animate-pulse" />
                  <div className="w-20 h-4 bg-white/[0.06] rounded-lg animate-pulse" />
                </div>
              ))}
            </div>
          ) : ranking.length === 0 ? (
            <EmptyState
              icon="cards"
              title="Nadie en el ranking todavía"
              description="Sé el primero en aparecer. Jugá Truco Online para sumar victorias."
              action={{ label: 'Jugar Truco Online', to: '/juegos/truco-online' }}
            />
          ) : (
            <div className="flex flex-col gap-2.5">
              {ranking.map((jugador, i) => (
                <button key={i}
                  onClick={() => jugador.uid && navigate(`/perfil/${jugador.uid}`)}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4 w-full text-left transition-all"
                  style={{
                    background: i === 0 ? 'rgba(201,168,60,0.05)' : 'rgba(255,255,255,0.02)',
                    border: i === 0 ? '1px solid rgba(201,168,60,0.2)'
                           : i === 1 ? '1px solid rgba(192,192,192,0.12)'
                           : i === 2 ? '1px solid rgba(200,120,50,0.12)'
                           : '1px solid rgba(255,255,255,0.05)',
                    cursor: jugador.uid ? 'pointer' : 'default',
                    opacity: visible ? 1 : 0,
                    transform: visible ? 'none' : 'translateY(12px)',
                    transition: `opacity 0.5s ease ${0.1 + i * 0.05}s, transform 0.5s ease ${0.1 + i * 0.05}s`,
                  }}
                  onMouseEnter={e => { if (jugador.uid) e.currentTarget.style.background = i === 0 ? 'rgba(201,168,60,0.09)' : 'rgba(255,255,255,0.05)' }}
                  onMouseLeave={e => { e.currentTarget.style.background = i === 0 ? 'rgba(201,168,60,0.05)' : 'rgba(255,255,255,0.02)' }}>
                  <MedalBadge pos={i} />
                  <Avatar jugador={jugador} />
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-white text-sm truncate">{jugador.nombre}</p>
                    <p className="text-gray-600 text-xs">{jugador.partidas} {jugador.partidas === 1 ? 'partida' : 'partidas'}</p>
                  </div>
                  <div className="flex gap-5 text-center flex-shrink-0">
                    <div>
                      <p className="text-green-400 font-extrabold text-lg leading-none tabular-nums">{jugador.victorias}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">victorias</p>
                    </div>
                    <div>
                      <p className="text-red-400 font-extrabold text-lg leading-none tabular-nums">{jugador.derrotas}</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">derrotas</p>
                    </div>
                    <div>
                      <p className="font-extrabold text-lg leading-none tabular-nums" style={{ color: GOLD }}>{jugador.winrate}%</p>
                      <p className="text-gray-600 text-[10px] mt-0.5">winrate</p>
                    </div>
                  </div>
                </button>
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}
