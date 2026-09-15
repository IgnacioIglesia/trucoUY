import { useState } from 'react'
import { CartaComp, CartaMuestra, BtnCanto, TanteadorPalillos, PlayerPopup } from './componentes'
import Avatar from '../../components/Avatar'

function LogEntry({ msg, reciente }) {
  const isChat      = msg.startsWith('[C]')
  const isSeparator = msg.startsWith('───')
  const isWin       = msg.startsWith('[+]')
  const isLoss      = msg.startsWith('[-]')
  const isTie       = msg.startsWith('[=]')
  const isFlor      = msg.startsWith('[F]')
  const isEnvido    = msg.startsWith('[E]')
  const isTruco     = msg.startsWith('[T]')

  const display = msg.replace(/^\[[-+C=EFT]\] /, '')

  const color = isChat                  ? 'text-yellow-300/70'
    : isSeparator                       ? 'text-gray-600 text-center'
    : isWin && reciente                 ? 'text-green-400 font-semibold'
    : isLoss && reciente                ? 'text-red-400 font-semibold'
    : isTie                             ? 'text-gray-500'
    : isFlor                            ? 'text-yellow-400'
    : isEnvido                          ? 'text-yellow-400/80'
    : isTruco                           ? 'text-gray-300'
    : isWin                             ? 'text-green-500/60'
    : isLoss                            ? 'text-red-400/50'
    : reciente                          ? 'text-white font-semibold'
    : 'text-gray-400'

  return <p className={`text-xs mb-1 ${color}`}>{display}</p>
}

export default function MesaTruco({
  manoJ, manoM, cjJ, cjM, muestra, resultados, manoActual,
  ptsJ, ptsM, limite,
  turno,
  cartaSel, setCartaSel,
  log,
  mostrandoMano,
  trucoCantado, ultimoEnCantar,
  trucoPendiente, envidoPendiente, florPendiente,
  florIniciada, esMano,
  florResuelta,
  bloqueado,
  jugarCarta,
  cantarTruco, responderTrucoQuiero, responderTrucoNoQuiero,
  cantarEnvido, responderEnvidoQuiero, responderEnvidoNoQuiero,
  cantarFlor, responderFlorQuiero, responderFlorNoQuiero,
  puedeJugar, puedeEnvido,
  puedeIniciarTruco, puedeRetruco, puedeVale4,
  puedeIniciarRetruco, puedeIniciarVale4,
  puedeSubirEnvido, puedeSubirRealEnvido, puedeSubirFaltaEnvido,
  nombreRival, inicialesRival,
  miNombre, miPhotoURL, rivalPhotoURL, rivalUserId,
  florJ, florM, florCantada,
  mostrarCartasRival,
  nivelEnvido,
  resultadoUltimaMano,
  rondaTerminada,
  timerSeg,
  globoYo,
  globoRival,
  onEnviarMensaje,
  onSubirEnvidoConNivel,
  onIrseMazo,
  onSalirPartida,
  rivalReconectando,
  rivalAlMazo,
}) {
  const [chatInput, setChatInput]         = useState('')
  const [popupRival, setPopupRival]       = useState(false)
  const [confirmSalir, setConfirmSalir]   = useState(false)
  const [confirmMazo, setConfirmMazo]     = useState(false)

  const enviar = () => {
    const txt = chatInput.trim()
    if (!txt) return
    onEnviarMensaje?.(txt)
    setChatInput('')
  }

  return (
    <div className="flex-1 flex flex-col lg:flex-row max-w-[1400px] mx-auto w-full px-2 lg:px-4 py-2 lg:py-4 gap-3 lg:gap-4 relative">
      <style>{`
        @keyframes cardSlide { from { opacity:0; transform:translateY(-8px) scale(0.94) } to { opacity:1; transform:translateY(0) scale(1) } }
        @keyframes popIn { from { opacity:0; transform:scale(0.82) } to { opacity:1; transform:scale(1) } }
      `}</style>

      {/* ── MODAL CONFIRMAR SALIR ── */}
      {confirmSalir && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0e0c0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full flex flex-col gap-5 shadow-2xl">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white font-extrabold text-lg">¿Abandonar la partida?</h3>
              <p className="text-gray-400 text-sm">Tu rival ganará automáticamente y perderás ELO.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmSalir(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setConfirmSalir(false); onSalirPartida?.() }}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition"
              >
                Sí, salir
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── MODAL CONFIRMAR IRSE AL MAZO ── */}
      {confirmMazo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm px-4">
          <div className="bg-[#0e0c0a] border border-white/10 rounded-2xl p-6 max-w-sm w-full flex flex-col gap-5 shadow-2xl">
            <div className="flex flex-col gap-1.5">
              <h3 className="text-white font-extrabold text-lg">¿Irse al mazo?</h3>
              <p className="text-gray-400 text-sm">Perdés la ronda y el rival gana los puntos de truco cantado.</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setConfirmMazo(false)}
                className="flex-1 py-2.5 rounded-xl border border-white/10 bg-white/[0.04] hover:bg-white/[0.08] text-white text-sm font-semibold transition"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setConfirmMazo(false); onIrseMazo?.() }}
                className="flex-1 py-2.5 rounded-xl bg-red-700 hover:bg-red-600 text-white text-sm font-bold transition"
              >
                Sí, me voy
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── PANEL IZQUIERDO — solo desktop ── */}
      <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
        <div className="flex flex-col gap-2">

          {!envidoPendiente && !florPendiente && !florJ && !florM && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#c9a83c' }}>Envido</p>
              <BtnCanto onClick={() => cantarEnvido('envido')} disabled={!puedeEnvido} color="gold">Envido</BtnCanto>
              <BtnCanto onClick={() => cantarEnvido('real')} disabled={!puedeEnvido} color="gold">Real Envido</BtnCanto>
              <BtnCanto onClick={() => cantarEnvido('falta')} disabled={!puedeEnvido} color="gold">Falta Envido</BtnCanto>
            </>
          )}

          {envidoPendiente && (
            <>
              <p className="text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#c9a83c' }}>
                {nombreRival} cantó {nivelEnvido === 'real' ? 'Real Envido' : nivelEnvido === 'falta' ? 'Falta Envido' : 'Envido'}
              </p>
              {puedeSubirEnvido && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('envido')} color="gold">Envido ↑</BtnCanto>}
              {puedeSubirRealEnvido && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('real')} color="gold">Real Envido ↑</BtnCanto>}
              {puedeSubirFaltaEnvido && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('falta')} color="gold">Falta Envido ↑</BtnCanto>}
            </>
          )}

          {florJ && florM && !florResuelta && !florPendiente && !florIniciada && esMano && (
            <>
              <div className="h-px bg-gray-700 my-1" />
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider text-center">Flor</p>
              <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
              <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
              <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
            </>
          )}

          {florPendiente && (
            <>
              <div className="h-px bg-gray-700 my-1" />
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider text-center">
                {florCantada === 'flor'
                  ? `${nombreRival} dijo: La mía es Flor`
                  : `${nombreRival} cantó ${florCantada === 'conFlor' ? 'Con Flor Envido' : 'Contra Flor al Resto'}`}
              </p>
              {florCantada === 'flor' ? (
                <>
                  <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
                  <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
                  <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
                </>
              ) : (
                <>
                  <BtnCanto onClick={responderFlorQuiero} color="yellow">Quiero ✓</BtnCanto>
                  <BtnCanto onClick={responderFlorNoQuiero} color="yellow">No quiero ✗</BtnCanto>
                </>
              )}
            </>
          )}
        </div>

        <div className="flex flex-col gap-3">
          <TanteadorPalillos ptsJ={ptsJ} ptsM={ptsM} limite={limite} nombreJ={miNombre} nombreM={nombreRival} />

          {/* Chat desktop — left panel */}
          <div className="h-52 flex flex-col gap-1">
            <p className="text-[10px] font-semibold uppercase tracking-widest text-center" style={{ color: '#c9a83c' }}>Chat</p>
            <div className="rounded-xl p-2 flex-1 min-h-0 overflow-y-auto flex flex-col gap-0.5" style={{ background: 'rgba(201,168,60,0.05)', border: '1px solid rgba(201,168,60,0.12)' }}>
              {log.filter(m => m.startsWith('[C]')).slice(0, 4).length === 0
                ? <p className="text-xs text-center italic" style={{ color: 'rgba(201,168,60,0.3)' }}>Sin mensajes</p>
                : log.filter(m => m.startsWith('[C]')).slice(0, 4).map((msg, i) => (
                    <p key={i} className={`text-xs ${i === 0 ? 'text-yellow-200 font-semibold' : 'text-yellow-400/50'}`}>{msg.replace(/^\[C\] /, '')}</p>
                  ))
              }
            </div>
            <div className="flex gap-1">
              <input
                value={chatInput}
                onChange={e => setChatInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && enviar()}
                maxLength={80}
                placeholder="Escribí..."
                className="flex-1 bg-white/[0.04] border border-white/10 focus:border-yellow-600/40 rounded-lg px-2 py-1.5 text-white text-xs focus:outline-none placeholder-gray-600"
              />
              <button onClick={enviar} disabled={!chatInput.trim()}
                className="disabled:opacity-30 text-[#07090d] px-2.5 rounded-lg text-xs font-bold transition hover:opacity-90"
                style={{ background: '#c9a83c' }}>
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── CENTRO ── */}
      <div className="flex-1 flex flex-col items-center gap-2 min-w-0">

        {/* Tanteador — mobile */}
        <div className="lg:hidden w-full max-w-md">
          <TanteadorPalillos ptsJ={ptsJ} ptsM={ptsM} limite={limite} nombreJ={miNombre} nombreM={nombreRival} />
        </div>

        {/* Rival reconnecting banner */}
        {rivalReconectando && (
          <div className="w-full max-w-md mx-auto flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-950/60 border border-amber-700/40 text-amber-300 text-xs font-semibold">
            <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse flex-shrink-0" />
            {nombreRival} se desconectó — esperando reconexión (30s)...
          </div>
        )}

        {/* Rival fue al mazo banner */}
        {rivalAlMazo && (
          <div className="w-full max-w-md mx-auto flex items-center gap-3 px-4 py-3 rounded-xl bg-green-950/70 border border-green-700/50 text-green-300 text-sm font-bold shadow-lg">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-5 h-5 flex-shrink-0">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3"/>
            </svg>
            <span>{nombreRival} se fue al mazo — Ganaste la ronda</span>
          </div>
        )}

        {/* Avatar rival */}
        <div className="flex flex-col items-center gap-1 relative" style={{ zIndex: 20 }}>
          <div className="relative">
            <button
              onClick={() => setPopupRival(v => !v)}
              className="cursor-pointer hover:opacity-80 transition-opacity focus:outline-none"
              title="Ver perfil"
            >
              {rivalPhotoURL
                ? <img src={rivalPhotoURL} alt="" className="w-12 h-12 rounded-full object-cover"
                    style={{ border: '2px solid rgba(201,168,60,0.45)' }} />
                : !rivalUserId
                  ? (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(201,168,60,0.08)', border: '2px solid rgba(201,168,60,0.4)' }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#c9a83c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                        <rect x="3" y="8" width="18" height="13" rx="2"/>
                        <circle cx="9" cy="13" r="1.2" fill="#c9a83c" stroke="none"/>
                        <circle cx="15" cy="13" r="1.2" fill="#c9a83c" stroke="none"/>
                        <path d="M9 17h6"/>
                        <path d="M12 8V5"/>
                        <circle cx="12" cy="4" r="1" fill="#c9a83c" stroke="none"/>
                      </svg>
                    </div>
                  )
                  : (
                    <div className="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0"
                         style={{ background: 'rgba(201,168,60,0.1)', border: '2px solid rgba(201,168,60,0.4)' }}>
                      <span className="font-extrabold text-lg" style={{ color: '#c9a83c' }}>{inicialesRival}</span>
                    </div>
                  )
              }
            </button>
            {globoRival && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-gray-700 border border-gray-500 text-white text-xs px-3 py-1.5 rounded-2xl shadow-lg max-w-[200px] z-30 whitespace-nowrap">
                {globoRival}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-gray-700 border-l border-b border-gray-500 rotate-45" />
              </div>
            )}
            {popupRival && (
              <PlayerPopup
                userId={rivalUserId}
                nombre={nombreRival}
                photoURL={rivalPhotoURL}
                onClose={() => setPopupRival(false)}
                className="top-full mt-2 left-1/2 -translate-x-1/2"
              />
            )}
          </div>
          <span className="text-gray-400 text-xs font-semibold">{nombreRival}</span>
        </div>

        {/* Mesa + abanicos */}
        <div className="relative w-full max-w-xl">

          {/* Cartas rival en abanico */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/3"
            style={{ width: '320px', height: '175px', zIndex: 10 }}>
            {manoM.map((c, i) => {
              const angulos   = [-15, 0, 15]
              const traslados = [-65, 0, 65]
              return (
                <div key={c.id || i} style={{
                  position: 'absolute', bottom: '0px', left: '50%',
                  transform: `translateX(calc(-50% + ${traslados[i]}px)) rotate(${angulos[i]}deg)`,
                  transformOrigin: 'bottom center',
                  zIndex: i + 1,
                  filter: mostrarCartasRival ? 'brightness(1.3) saturate(1.1)' : 'none',
                  transition: 'filter 0.3s ease',
                }}>
                  <CartaComp carta={c} muestra={muestra} oculta={!mostrarCartasRival || !c.numero} />
                </div>
              )
            })}
          </div>

          <div style={{ height: '90px' }} />

          {/* Mesa */}
          <div className={`w-full rounded-2xl overflow-hidden shadow-2xl transition-all border ${mostrandoMano ? 'border-yellow-500/40' : 'border-white/[0.07]'}`}
            style={{ background: 'radial-gradient(rgba(201,168,60,0.022) 1px, transparent 1px) 0 0 / 22px 22px, radial-gradient(ellipse 75% 55% at 50% 50%, rgba(201,168,60,0.055) 0%, transparent 70%), #07090d' }}>

            {/* Header */}
            <div className="flex items-center justify-between px-4 py-2.5 bg-black/30 border-b border-white/[0.06]">
              <div className="flex items-center gap-2">
                <span className="text-gray-600 text-[10px] font-semibold uppercase tracking-widest">Mano</span>
                <div className="flex gap-1">
                  {[0,1,2].map(i => (
                    <span key={i} className={`w-6 h-6 rounded-full text-xs font-bold flex items-center justify-center border transition-all ${
                      resultados[i] === 'jugador' ? 'bg-green-800 border-green-600 text-green-200' :
                      resultados[i] === 'maquina' ? 'bg-red-900 border-red-700 text-red-200' :
                      resultados[i] === 'empate'  ? 'bg-gray-700 border-gray-500 text-gray-300' :
                      i === manoActual            ? 'bg-yellow-950/50 border-yellow-600/50 text-yellow-400' :
                                                    'bg-white/5 border-white/10 text-gray-600'
                    }`}>
                      {resultados[i] === 'jugador'
                        ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                        : resultados[i] === 'maquina'
                          ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/></svg>
                          : resultados[i] === 'empate'
                            ? <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3 h-3"><path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14"/></svg>
                            : i + 1}
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2.5">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${
                  mostrandoMano
                    ? resultadoUltimaMano === 'jugador' ? 'bg-green-900/60 border-green-700 text-green-300'
                    : resultadoUltimaMano === 'maquina' ? 'bg-red-900/60 border-red-700 text-red-300'
                    : 'bg-gray-700/60 border-gray-600 text-gray-300'
                  : bloqueado ? 'bg-black/40 border-white/10 text-gray-500'
                  : turno === 'yo' || turno === 'jugador' ? 'bg-yellow-950/50 border-yellow-600/50 text-yellow-400'
                  : 'bg-black/40 border-white/10 text-gray-400'
                }`}>
                  {mostrandoMano
                    ? resultadoUltimaMano === 'jugador' ? 'Ganaste la mano'
                    : resultadoUltimaMano === 'maquina' ? 'Perdiste la mano'
                    : 'Mano empatada'
                  : bloqueado && !trucoPendiente && !envidoPendiente && !florPendiente ? 'Esperando...'
                  : trucoPendiente  ? 'Respondé truco'
                  : envidoPendiente ? 'Respondé envido'
                  : florPendiente   ? 'Respondé flor'
                  : !florResuelta   ? 'Resolvé la Flor'
                  : turno === 'yo' || turno === 'jugador' ? 'Tu turno'
                  : 'Turno del rival'}
                </span>
              </div>
            </div>

            {/* Cartas en mesa */}
            <div className="relative flex flex-col items-center gap-5 py-8 lg:py-10 px-4">

              {/* Decoración de mesa */}
              <div className="absolute inset-0 pointer-events-none overflow-hidden">
                <div className="absolute inset-6 rounded-[50%]"
                     style={{ border: '1px solid rgba(201,168,60,0.09)' }} />
                {/* Espada */}
                <svg className="absolute top-2 left-2 select-none" aria-hidden width="9" height="18" viewBox="0 0 30 68" fill="none">
                  <path d="M15 2 L16.6 32 L15 38 L13.4 32 Z"
                        fill="rgba(201,168,60,0.18)" stroke="rgba(201,168,60,0.38)" strokeWidth="1" strokeLinejoin="round"/>
                  <path d="M3 31 C6 25 10 27 15 27 C20 27 24 25 27 31 C24 36 20 34 15 34 C10 34 6 36 3 31 Z"
                        fill="rgba(201,168,60,0.18)" stroke="rgba(201,168,60,0.38)" strokeWidth="1"/>
                  <rect x="13.5" y="38" width="3" height="14" rx="1.5"
                        fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.3)" strokeWidth="1"/>
                  <ellipse cx="15" cy="58" rx="7" ry="5"
                           fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.3)" strokeWidth="1"/>
                </svg>
                {/* Basto */}
                <svg className="absolute top-2 right-2 select-none" aria-hidden width="9" height="18" viewBox="0 0 30 68" fill="none">
                  <circle cx="15" cy="10" r="10"
                          fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.35)" strokeWidth="1"/>
                  <circle cx="15" cy="27" r="8.5"
                          fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.35)" strokeWidth="1"/>
                  <circle cx="15" cy="42" r="7"
                          fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.35)" strokeWidth="1"/>
                  <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                        fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.28)" strokeWidth="1"/>
                </svg>
                {/* Oro */}
                <svg className="absolute bottom-2 left-2 select-none" aria-hidden width="14" height="14" viewBox="0 0 46 46" fill="none">
                  <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.35)" strokeWidth="3"/>
                  <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.28)" strokeWidth="2.5"/>
                  <circle cx="23" cy="4" r="2.2" fill="rgba(201,168,60,0.35)"/>
                  <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.35)"/>
                  <circle cx="4" cy="23" r="2.2" fill="rgba(201,168,60,0.35)"/>
                  <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.35)"/>
                </svg>
                {/* Copa */}
                <svg className="absolute bottom-2 right-2 select-none" aria-hidden width="9" height="14" viewBox="0 0 36 56" fill="none">
                  <rect x="5" y="2" width="26" height="4" rx="2"
                        fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.35)" strokeWidth="1"/>
                  <path d="M7 6 C7.5 17 11 24 16 27 L20 27 C25 24 28.5 17 29 6 Z"
                        fill="rgba(201,168,60,0.14)" stroke="rgba(201,168,60,0.35)" strokeWidth="1"/>
                  <rect x="15" y="27" width="6" height="13" rx="3"
                        fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.28)" strokeWidth="1"/>
                  <path d="M9 40 Q18 38 27 40 L25.5 47 Q18 45 10.5 47 Z"
                        fill="rgba(201,168,60,0.1)" stroke="rgba(201,168,60,0.28)" strokeWidth="1"/>
                </svg>
              </div>

              <div className="absolute top-3 left-4 flex flex-col items-center gap-1">
                <span className="text-yellow-500/70 text-[10px] font-bold uppercase tracking-widest">Muestra</span>
                {muestra && <CartaMuestra carta={muestra} />}
              </div>

              {/* During mostrandoMano show the cards just played.
                  If round ended (rondaTerminada), manoActual wasn't incremented → show manoActual.
                  If round continues, manoActual already advanced → show manoActual - 1. */}
              {(() => {
                const displayIdx = (mostrandoMano && !rondaTerminada && manoActual > 0) ? manoActual - 1 : manoActual
                return (
                  <>
                    {cjM[displayIdx]
                      ? <div key={cjM[displayIdx].id} style={{ animation: 'cardSlide 0.2s ease-out' }}>
                          <CartaComp carta={cjM[displayIdx]} muestra={muestra} jugada enMesa />
                        </div>
                      : <div className="w-[68px] md:w-20 h-24 md:h-28 rounded-xl flex-shrink-0"
                          style={{ background: 'rgba(0,0,0,0.35)', boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.04)' }} />
                    }

                    <div className="flex items-center gap-2 w-40">
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to right, transparent, rgba(201,168,60,0.25))' }} />
                      <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: 'rgba(201,168,60,0.45)' }} />
                      <div className="flex-1 h-px" style={{ background: 'linear-gradient(to left, transparent, rgba(201,168,60,0.25))' }} />
                    </div>

                    {cjJ[displayIdx]
                      ? <div key={cjJ[displayIdx].id} style={{ animation: 'cardSlide 0.2s ease-out' }}>
                          <CartaComp carta={cjJ[displayIdx]} muestra={muestra} jugada enMesa />
                        </div>
                      : <div className="w-[68px] md:w-20 h-24 md:h-28 rounded-xl flex-shrink-0"
                          style={{ background: 'rgba(0,0,0,0.35)', boxShadow: 'inset 0 2px 16px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.04)' }} />
                    }
                  </>
                )
              })()}
            </div>

            {/* Banner: flor automática al inicio de ronda */}
            {(florJ || florM) && florResuelta && !rondaTerminada && resultados.length === 0 && (
              <div className="mx-3 mb-1 px-3 py-1.5 bg-yellow-900/40 border border-yellow-700/50 rounded-xl flex items-center justify-center gap-2">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-4 h-4 text-yellow-400 flex-shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c-1.5 3-3 4.5-3 7a3 3 0 006 0c0-2.5-1.5-4-3-7z M12 10v4m0 4h.01"/>
                </svg>
                <p className="text-yellow-300 text-xs font-semibold text-center">
                  {florJ && !florM ? 'Tenés Flor — +3 puntos' : `${nombreRival} tiene Flor — +3 puntos`}
                </p>
              </div>
            )}

            {/* Botones: ambos tienen flor → solo mano puede iniciar */}
            {florJ && florM && !florResuelta && !florPendiente && !florIniciada && esMano && (
              <div className="px-4 pb-3 flex flex-col gap-2">
                <p className="text-yellow-400 text-xs font-bold text-center uppercase tracking-wider">Ambos tienen Flor — Cantá</p>
                <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
                <div className="grid grid-cols-2 gap-2">
                  <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
                  <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
                </div>
              </div>
            )}

            {/* Botones: responder flor */}
            {florPendiente && (
              <div className="px-4 pb-3 flex flex-col gap-2">
                <p className="text-yellow-400 text-xs font-bold text-center">
                  {florCantada === 'flor'
                    ? `${nombreRival} dijo: La mía es Flor`
                    : `${nombreRival} cantó ${florCantada === 'conFlor' ? 'Con Flor Envido' : 'Contra Flor al Resto'}`}
                </p>
                {florCantada === 'flor' ? (
                  <div className="flex flex-col gap-2">
                    <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
                    <div className="grid grid-cols-2 gap-2">
                      <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
                      <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
                    </div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <BtnCanto onClick={responderFlorQuiero} color="yellow">Quiero ✓</BtnCanto>
                    <BtnCanto onClick={responderFlorNoQuiero} color="yellow">No quiero ✗</BtnCanto>
                  </div>
                )}
              </div>
            )}

            {/* Truco cantado */}
            {trucoCantado && (
              <div className="px-4 pb-3 flex justify-center">
                <span key={trucoCantado} className="bg-red-950/80 border border-red-700/60 text-red-300 text-xs px-3 py-1.5 rounded-full font-bold"
                      style={{ animation: 'popIn 0.18s ease-out' }}>
                  {trucoCantado === 'truco' ? 'Truco' : trucoCantado === 'retruco' ? 'Retruco' : 'Vale Cuatro'}
                  {' · '}{ultimoEnCantar === 'yo' || ultimoEnCantar === 'jugador' ? 'vos' : nombreRival}
                </span>
              </div>
            )}

            {/* Responder truco */}
            {trucoPendiente && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-center uppercase tracking-wider" style={{ color: '#e87070' }}>
                  {nombreRival} cantó {trucoCantado === 'truco' ? 'Truco' : trucoCantado === 'retruco' ? 'Retruco' : 'Vale Cuatro'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <BtnCanto onClick={responderTrucoQuiero} color="gold">Quiero ✓</BtnCanto>
                  <BtnCanto onClick={responderTrucoNoQuiero} color="gold">No quiero ✗</BtnCanto>
                </div>
              </div>
            )}

            {/* Responder envido */}
            {envidoPendiente && (
              <div className="px-4 pb-4 flex flex-col gap-2">
                <p className="text-xs font-bold text-center uppercase tracking-wider" style={{ color: '#c9a83c' }}>
                  {nombreRival} cantó {nivelEnvido === 'real' ? 'Real Envido' : nivelEnvido === 'falta' ? 'Falta Envido' : 'Envido'}
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <BtnCanto onClick={responderEnvidoQuiero} color="gold">Quiero ✓</BtnCanto>
                  <BtnCanto onClick={responderEnvidoNoQuiero} color="gold">No quiero ✗</BtnCanto>
                </div>
              </div>
            )}

            <div style={{ height: '90px' }} />
          </div>

          {/* Cartas jugador en abanico */}
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/3"
            style={{ width: '290px', height: '160px', zIndex: 10 }}>
            {manoJ.map((carta, i) => {
              const angulos   = [-15, 0, 15]
              const traslados = [-65, 0, 65]
              const jugada      = !!cjJ.find(j => j.id === carta.id)
              const seleccionada = cartaSel?.id === carta.id
              const deshabilitada = jugada || !puedeJugar
              return (
                <div key={carta.id} style={{
                  position: 'absolute',
                  bottom: seleccionada ? '24px' : '0px', left: '50%',
                  transform: `translateX(calc(-50% + ${traslados[i]}px)) rotate(${angulos[i]}deg)`,
                  transformOrigin: 'bottom center', transition: 'all 0.2s ease',
                  opacity: jugada ? 0.3 : !puedeJugar ? 0.5 : 1,
                  filter: !puedeJugar && !jugada ? 'grayscale(80%)' : 'none',
                  zIndex: seleccionada ? 10 : i + 1,
                }}>
                  <CartaComp
                    carta={carta} muestra={muestra} jugada={jugada} seleccionada={seleccionada}
                    onClick={!deshabilitada
                      ? () => { if (cartaSel?.id === carta.id) jugarCarta(carta); else setCartaSel(carta) }
                      : null}
                  />
                </div>
              )
            })}
          </div>
        </div>

        <div style={{ height: '90px' }} />

        {/* Barra de timer cuando es tu turno */}
        {puedeJugar && (
          <div className="w-full max-w-xs mx-auto px-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] text-gray-500 uppercase tracking-widest font-semibold">Tu turno</span>
              <span className={`text-sm font-extrabold tabular-nums transition-colors ${
                timerSeg > 20 ? 'text-green-400' : timerSeg > 10 ? 'text-yellow-400' : 'text-red-400 animate-pulse'
              }`}>{timerSeg}s</span>
            </div>
            <div className="w-full h-2 bg-gray-800 rounded-full overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-linear ${
                  timerSeg > 20 ? 'bg-green-500' : timerSeg > 10 ? 'bg-yellow-500' : 'bg-red-500'
                }`}
                style={{ width: `${(timerSeg / 45) * 100}%` }}
              />
            </div>
          </div>
        )}

        <p className="text-gray-500 text-xs uppercase tracking-wider text-center">
          {mostrandoMano
            ? resultadoUltimaMano === 'jugador' ? 'Ganaste la mano'
            : resultadoUltimaMano === 'maquina' ? 'Perdiste la mano'
            : 'Mano empatada'
          : rondaTerminada ? 'Nueva ronda...'
          : !florResuelta && !florJ && !florM ? 'Ambos tienen Flor — cantá'
          : !puedeJugar ? 'Esperá tu turno'
          : 'Elegí una carta — doble click para jugar'}
        </p>

        {cartaSel && <p className="text-yellow-500 text-xs animate-pulse">Clickeá de nuevo para jugar</p>}

        {/* Irse al mazo + Salir */}
        <div className="flex items-center gap-3">
          {onIrseMazo && !rondaTerminada && !bloqueado && (
            <button
              onClick={() => setConfirmMazo(true)}
              className="flex items-center gap-1.5 text-red-400/70 hover:text-red-300 text-xs font-semibold uppercase tracking-widest transition-all border border-red-900/30 hover:border-red-700/60 hover:bg-red-950/30 px-4 py-2 rounded-xl"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"/>
              </svg>
              Irse al mazo
            </button>
          )}
          <button
            onClick={() => setConfirmSalir(true)}
            className="flex items-center gap-1.5 text-gray-600 hover:text-red-400 text-xs font-semibold uppercase tracking-widest transition-all px-3 py-2 rounded-xl hover:bg-red-950/20"
            title="Abandonar partida"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-3.5 h-3.5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12"/>
            </svg>
            Salir
          </button>
        </div>

        {/* Avatar jugador */}
        <div className="flex flex-col items-center gap-1 mt-1">
          <div className="relative">
            <Avatar usuario={{ displayName: miNombre, photoURL: miPhotoURL }} size="md" />
            {globoYo && (
              <div className="absolute left-full ml-3 top-1/2 -translate-y-1/2 bg-[#1a1710] border border-yellow-700/50 text-yellow-200 text-xs px-3 py-1.5 rounded-2xl shadow-lg max-w-[200px] z-30 whitespace-nowrap">
                {globoYo}
                <div className="absolute -left-1.5 top-1/2 -translate-y-1/2 w-3 h-3 bg-[#1a1710] border-l border-b border-yellow-700/50 rotate-45" />
              </div>
            )}
          </div>
          <span className="text-gray-400 text-xs font-semibold">{miNombre}</span>
        </div>

        {/* ── BOTONES DE ACCIÓN — mobile ── */}
        <div className="lg:hidden w-full flex flex-col gap-2 mt-2">

          {/* Flor pendiente */}
          {florPendiente && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-yellow-400 font-bold text-center">
                {florCantada === 'flor'
                  ? `${nombreRival} dijo: La mía es Flor`
                  : `${nombreRival} cantó ${florCantada === 'conFlor' ? 'Con Flor Envido' : 'Contra Flor al Resto'}`}
              </p>
              {florCantada === 'flor' ? (
                <>
                  <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
                  <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
                  <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-1">
                  <BtnCanto onClick={responderFlorQuiero} color="yellow">Quiero ✓</BtnCanto>
                  <BtnCanto onClick={responderFlorNoQuiero} color="yellow">No quiero ✗</BtnCanto>
                </div>
              )}
            </div>
          )}

          {/* Flor — solo mano puede iniciar */}
          {florJ && florM && !florResuelta && !florPendiente && !florIniciada && esMano && (
            <div className="flex flex-col gap-1">
              <p className="text-xs text-yellow-400 font-bold uppercase tracking-wider text-center">Flor</p>
              <BtnCanto onClick={() => cantarFlor('flor')} color="yellow">La mía es Flor</BtnCanto>
              <BtnCanto onClick={() => cantarFlor('conFlor')} color="yellow">Con Flor Envido</BtnCanto>
              <BtnCanto onClick={() => cantarFlor('contraFlor')} color="yellow">Contra Flor al Resto</BtnCanto>
            </div>
          )}

          {/* Envido */}
          {!envidoPendiente && !florJ && !florM && (
            <div className="flex gap-1">
              <BtnCanto onClick={() => cantarEnvido('envido')} disabled={!puedeEnvido} color="gold">Envido</BtnCanto>
              <BtnCanto onClick={() => cantarEnvido('real')} disabled={!puedeEnvido} color="gold">Real E.</BtnCanto>
              <BtnCanto onClick={() => cantarEnvido('falta')} disabled={!puedeEnvido} color="gold">Falta E.</BtnCanto>
            </div>
          )}

          {/* Envido pendiente — subida */}
          {envidoPendiente && (
            <div className="flex flex-col gap-1">
              {puedeSubirEnvido     && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('envido')} color="gold">Envido ↑</BtnCanto>}
              {puedeSubirRealEnvido && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('real')}   color="gold">Real E. ↑</BtnCanto>}
              {puedeSubirFaltaEnvido && <BtnCanto onClick={() => onSubirEnvidoConNivel?.('falta')} color="gold">Falta E. ↑</BtnCanto>}
            </div>
          )}

          {/* Truco */}
          <div className="flex gap-1">
            <BtnCanto onClick={() => cantarTruco('truco')}   disabled={!puedeIniciarTruco}                       color="gold">Truco</BtnCanto>
            <BtnCanto onClick={() => cantarTruco('retruco')} disabled={!(puedeIniciarRetruco || puedeRetruco)}   color="gold">Retruco</BtnCanto>
            <BtnCanto onClick={() => cantarTruco('vale4')}   disabled={!(puedeIniciarVale4  || puedeVale4)}      color="gold">Vale 4</BtnCanto>
          </div>
        </div>

        {/* Chat — mobile: mensajes recientes + input */}
        <div className="lg:hidden w-full flex flex-col gap-1.5">
          {log.filter(m => m.startsWith('[C]')).slice(0, 3).length > 0 && (
            <div className="rounded-xl px-3 py-2 flex flex-col gap-0.5" style={{ background: 'rgba(201,168,60,0.05)', border: '1px solid rgba(201,168,60,0.12)' }}>
              {log.filter(m => m.startsWith('[C]')).slice(0, 3).map((msg, i) => (
                <p key={i} className={`text-xs ${i === 0 ? 'text-yellow-200 font-semibold' : 'text-yellow-400/50'}`}>{msg.replace(/^\[C\] /, '')}</p>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <input
              value={chatInput}
              onChange={e => setChatInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && enviar()}
              maxLength={80}
              placeholder="Escribí algo al rival..."
              className="flex-1 bg-white/[0.04] border border-white/10 focus:border-yellow-600/40 rounded-xl px-3 py-2 text-white text-xs focus:outline-none placeholder-gray-600"
            />
            <button onClick={enviar} disabled={!chatInput.trim()}
              className="disabled:opacity-30 text-[#07090d] px-3 py-2 rounded-xl text-xs font-bold transition hover:opacity-90"
              style={{ background: '#c9a83c' }}>
              →
            </button>
          </div>
        </div>

        {/* Historial — mobile */}
        <div className="lg:hidden w-full">
          <div className="rounded-2xl p-3 max-h-24 overflow-y-auto" style={{ background: '#0c0b09', border: '1px solid rgba(255,255,255,0.06)' }}>
            {log.length === 0
              ? <p className="text-gray-500 text-xs text-center">El historial aparecerá acá</p>
              : log.filter(m => !m.startsWith('[C]')).slice(0, 8).map((msg, i) => <LogEntry key={i} msg={msg} reciente={i === 0} />)
            }
          </div>
        </div>
      </div>

      {/* ── PANEL DERECHO — solo desktop ── */}
      <div className="hidden lg:flex flex-col gap-3 w-52 flex-shrink-0">
        <div className="flex flex-col gap-2">
          <p className="text-xs font-bold uppercase tracking-wider text-center" style={{ color: '#e87070' }}>Truco</p>
          <BtnCanto onClick={() => cantarTruco('truco')}   disabled={!puedeIniciarTruco}                     color="gold">Truco</BtnCanto>
          <BtnCanto onClick={() => cantarTruco('retruco')} disabled={!(puedeIniciarRetruco || puedeRetruco)} color="gold">Retruco</BtnCanto>
          <BtnCanto onClick={() => cantarTruco('vale4')}   disabled={!(puedeIniciarVale4  || puedeVale4)}    color="gold">Vale Cuatro</BtnCanto>
        </div>

        {/* Historial de juego */}
        <div className="h-[525px] flex flex-col gap-2">
          <p className="text-[10px] font-semibold uppercase tracking-widest mb-1 text-center flex-shrink-0" style={{ color: 'rgba(201,168,60,0.5)' }}>Historial</p>
          <div className="rounded-2xl p-3 overflow-y-auto flex-1 min-h-0" style={{ background: '#0c0b09', border: '1px solid rgba(255,255,255,0.06)' }}>
            {log.filter(m => !m.startsWith('[C]')).length === 0
              ? <p className="text-gray-500 text-xs text-center">El historial aparecerá acá</p>
              : log.filter(m => !m.startsWith('[C]')).map((msg, i) => <LogEntry key={i} msg={msg} reciente={i === 0} />)
            }
          </div>
        </div>
      </div>

    </div>
  )
}
