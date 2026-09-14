import { useEffect, useState } from 'react'
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
  const [ranking, setRanking] = useState([])
  const [cargando, setCargando] = useState(true)

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
    <div className="min-h-screen bg-[#07090d] text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 65% 40% at 50% 0%, rgba(201,168,60,0.1), transparent)' }} />
        <div className="absolute inset-0 pointer-events-none"
             style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

        <div className="relative z-10 max-w-2xl mx-auto w-full px-4 py-12">

          {/* Header */}
          <div className="text-center mb-10">
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest mb-4"
                  style={{ background: 'rgba(201,168,60,0.07)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
              <span className="font-serif">♠</span>
              Tabla global
            </span>
            <h1 className="text-4xl font-extrabold">Ranking</h1>
            <p className="text-gray-500 mt-2 text-sm">Los mejores jugadores de TrucoUY</p>
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
                <div key={i}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4 transition-colors"
                  style={{
                    background: i === 0 ? 'rgba(201,168,60,0.05)' : 'rgba(255,255,255,0.02)',
                    border: i === 0 ? '1px solid rgba(201,168,60,0.2)'
                           : i === 1 ? '1px solid rgba(192,192,192,0.12)'
                           : i === 2 ? '1px solid rgba(200,120,50,0.12)'
                           : '1px solid rgba(255,255,255,0.05)',
                  }}>
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
                </div>
              ))}
            </div>
          )}

        </div>
      </div>

      <Footer />
    </div>
  )
}
