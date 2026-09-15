import { useState, useCallback, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Navbar from '../../components/Navbar'
import { usePageTitle } from '../../hooks/usePageTitle'
import Footer from '../../components/Footer'
import MesaTruco from './MesaTruco'
import {
    crearMazo, jerarquia, calcularEnvido, calcularFlor, detectarFlor,
    ganadorMano, ganadorRonda
  } from './logica'
import { DELAY_MANO } from './constantes'

export default function Truco() {
  usePageTitle('Truco vs Máquina')
  const { usuario } = useAuth()
  const navigate = useNavigate()
  const [pantalla, setPantalla] = useState('menu')
  const [limite, setLimite] = useState(30)
  const [muestra, setMuestra] = useState(null)
  const [manoJ, setManoJ] = useState([])
  const [manoM, setManoM] = useState([])
  const [cjJ, setCjJ] = useState([])
  const [cjM, setCjM] = useState([])
  const [resultados, setResultados] = useState([])
  const [manoActual, setManoActual] = useState(0)
  const [esMano, setEsMano] = useState(true)
  const [turno, setTurno] = useState('jugador')
  const [cartaSel, setCartaSel] = useState(null)
  const [log, setLog] = useState([])
  const [ptsJ, setPtsJ] = useState(0)
  const [ptsM, setPtsM] = useState(0)
  const [ganador, setGanador] = useState(null)
  const [esperando, setEsperando] = useState(false)
  const [florJ, setFlorJ] = useState(false)
  const [florM, setFlorM] = useState(false)
  const [florResuelta, setFlorResuelta] = useState(true)
  const [envidoResuelto, setEnvidoResuelto] = useState(false)
  const [envidoNivel, setEnvidoNivel] = useState(null)
  const [envidoPtsApostados, setEnvidoPtsApostados] = useState(0)
  const [trucoCantado, setTrucoCantado] = useState(null)
  const [ultimoEnCantar, setUltimoEnCantar] = useState(null)
  const [trucoResuelto, setTrucoResuelto] = useState(false)
  const [primeraJugada, setPrimeraJugada] = useState(false)
  const [mostrandoMano, setMostrandoMano] = useState(false)

  const [mostrarCartasRival, setMostrarCartasRival] = useState(false)
  const [rivalTieneFlor, setRivalTieneFlor] = useState(false)
  const [envidoPendiente, setEnvidoPendiente] = useState(false)
  const [trucoPendiente, setTrucoPendiente] = useState(false)
  const [florPendiente, setFlorPendiente] = useState(false)
  const [florCantada, setFlorCantada] = useState(null)

  const [timerSeg, setTimerSeg] = useState(45)
  const [visible, setVisible] = useState(false)
  const timerRef  = useRef(null)
  const manoJRef  = useRef(manoJ)
  manoJRef.current = manoJ

  const addLog = (msg) => setLog(p => [msg, ...p].slice(0, 50))

  const revisarGanador = useCallback((pj, pm) => {
    if (pj >= limite) { setPtsJ(pj); setPtsM(pm); setGanador('jugador'); setPantalla('resultado'); return true }
    if (pm >= limite) { setPtsJ(pj); setPtsM(pm); setGanador('maquina'); setPantalla('resultado'); return true }
    return false
  }, [limite])

  const resetRonda = () => {
    setCjJ([]); setCjM([]); setResultados([]); setManoActual(0); setCartaSel(null)
    setTrucoCantado(null); setTrucoResuelto(false); setUltimoEnCantar(null)
    setEnvidoResuelto(false); setMostrandoMano(false); setPrimeraJugada(false)
    setTrucoPendiente(false); setEnvidoPendiente(false)
    setEsperando(false); setEnvidoNivel(null); setEnvidoPtsApostados(0)
    setFlorPendiente(false); setMostrarCartasRival(false)
  }

  const repartir = (alternar, eManoAct) => {
    const mazo = crearMazo()
    const m = mazo[0], nj = mazo.slice(1, 4), nm = mazo.slice(4, 7)
    const nuevoEsMano = alternar ? !eManoAct : eManoAct
    const fj = detectarFlor(nj, m), fm = detectarFlor(nm, m)

    setMuestra(m); setManoJ(nj); setManoM(nm)
    resetRonda()
    setFlorResuelta(!fj && !fm); setEsMano(nuevoEsMano)
    setTurno(nuevoEsMano ? 'jugador' : 'maquina')
    setFlorJ(fj); setFlorM(fm); setRivalTieneFlor(fm); setFlorCantada(null)

    addLog(`─── Nueva ronda ───`)
    addLog(`Muestra: ${m.numero} de ${m.palo}`)
    if (fj) addLog('[F] Tenés Flor')
    if (fm) addLog('[F] Máquina tiene Flor')

    if (fj && fm) { setFlorResuelta(false); setFlorPendiente(true); addLog('[F] Ambos tienen Flor') }
    if (!fj && fm) setTimeout(() => { setPtsM(p => p + 3); addLog('[-] Flor automática — +3 pts para la máquina'); setFlorResuelta(true); setEnvidoResuelto(true) }, 800)
    if (fj && !fm) setTimeout(() => { setPtsJ(p => p + 3); addLog('[+] Flor automática — +3 pts para vos'); setFlorResuelta(true); setEnvidoResuelto(true) }, 800)

    return { m, nj, nm, nuevoEsMano, fj, fm }
  }

  const iniciar = () => {
    setPtsJ(0); setPtsM(0); setGanador(null); setLog([]); setPantalla('juego')
    addLog('─── Partida iniciada ───')
    repartir(false, true)
  }

  const terminarRonda = useCallback((gan, pjAct, pmAct, eManoAct) => {
    let pj = pjAct, pm = pmAct
    if (!trucoResuelto) {
      const val = { truco: 2, retruco: 3, vale4: 4 }[trucoCantado] || 1
      if (gan === 'jugador') { pj += val; addLog(`[+] Ronda de truco: +${val} pts para vos`) }
      else if (gan === 'maquina') { pm += val; addLog(`[-] Ronda de truco: +${val} pts para la máquina`) }
    }
    setPtsJ(pj); setPtsM(pm)
    if (pj >= limite) { setGanador('jugador'); setPantalla('resultado'); return }
    if (pm >= limite) { setGanador('maquina'); setPantalla('resultado'); return }
    if (rivalTieneFlor) setMostrarCartasRival(true)
    setTimeout(() => {
      const { nuevoEsMano } = repartir(true, eManoAct)
      if (!nuevoEsMano) setTimeout(() => maquinaJugarFn([], [], [], 0), 700)
    }, 2500)
  }, [trucoCantado, trucoResuelto, limite, rivalTieneFlor])

  const resolverMano = useCallback((cJ, cM, cjJAct, cjMAct, resAct, idx, muestraAct, mJAct, mMAct, pjAct, pmAct, eManoAct) => {
    const res = ganadorMano(cJ, cM, muestraAct)
    const nuevosRes = [...resAct, res]
    setResultados(nuevosRes); setMostrandoMano(true)
    if (res === 'jugador') addLog('[+] Ganaste la mano')
    else if (res === 'maquina') addLog('[-] Máquina ganó la mano')
    else addLog('[=] Mano empatada')
    setTimeout(() => {
      setMostrandoMano(false)
      const gan = ganadorRonda(nuevosRes, eManoAct ? 'jugador' : 'maquina')
      if (gan || nuevosRes.length === 3) {
        if (rivalTieneFlor) setMostrarCartasRival(true)
        terminarRonda(gan || 'empate', pjAct, pmAct, eManoAct); return
      }
      const sig = idx + 1; setManoActual(sig)
      const quien = res === 'empate' ? (eManoAct ? 'jugador' : 'maquina') : res
      setTurno(quien)
      if (quien === 'maquina') setTimeout(() => maquinaJugarFn(cjJAct, cjMAct, nuevosRes, sig, muestraAct, mMAct, mJAct, pjAct, pmAct, eManoAct), 500)
    }, DELAY_MANO)
  }, [terminarRonda, rivalTieneFlor])

  const maquinaJugarFn = useCallback((cjJAct, cjMAct, resAct, idx, muestraAct, mMAct, mJAct, pjAct, pmAct, eManoAct) => {
    const disp = (mMAct || manoM).filter(c => !(cjMAct || cjM).find(j => j.id === c.id))
    if (!disp.length) return
    const carta = [...disp].sort((a, b) => jerarquia(b, muestraAct || muestra) - jerarquia(a, muestraAct || muestra))[0]
    const nuevoCjM = [...(cjMAct || cjM), carta]
    setCjM(nuevoCjM)
    addLog(`Máquina: ${carta.numero} de ${carta.palo}`)
    if ((cjJAct || cjJ).length > idx) resolverMano((cjJAct || cjJ)[idx], carta, cjJAct || cjJ, nuevoCjM, resAct || resultados, idx, muestraAct || muestra, mJAct || manoJ, mMAct || manoM, pjAct ?? ptsJ, pmAct ?? ptsM, eManoAct ?? esMano)
    else setTurno('jugador')
  }, [manoM, manoJ, muestra, ptsJ, ptsM, esMano, cjJ, cjM, resultados, resolverMano])

  const jugarCarta = (carta) => {
    if (turno !== 'jugador' || esperando || !florResuelta || mostrandoMano) return
    clearInterval(timerRef.current); setTimerSeg(45)
    const nuevoCjJ = [...cjJ, carta]; setCjJ(nuevoCjJ); setCartaSel(null)
    if (!primeraJugada) setPrimeraJugada(true)
    addLog(`Vos: ${carta.numero} de ${carta.palo}`)
    if (cjM.length > manoActual) resolverMano(carta, cjM[manoActual], nuevoCjJ, cjM, resultados, manoActual, muestra, manoJ, manoM, ptsJ, ptsM, esMano)
    else { setTurno('maquina'); setTimeout(() => maquinaJugarFn(nuevoCjJ, cjM, resultados, manoActual, muestra, manoM, manoJ, ptsJ, ptsM, esMano), 500) }
  }

  // FLOR
  const cantarFlor = (nivel) => {
    setFlorCantada(nivel); setEsperando(true)
    addLog(`[F] Cantaste: ${nivel === 'flor' ? 'La mía es Flor' : nivel === 'conFlor' ? 'Con Flor Envido' : 'Contra Flor al Resto'}`)
    setTimeout(() => {
      if (Math.random() < 0.3) {
        const pts = nivel === 'flor' ? 3 : nivel === 'conFlor' ? 3 : 5
        addLog(`[+] Máquina no quiere la flor — +${pts} pts para vos`); setPtsJ(p => p + pts)
        setFlorResuelta(true); setFlorPendiente(false); setEnvidoResuelto(true); setEsperando(false); return
      }
      const vj = calcularFlor(manoJ, muestra), vm = calcularFlor(manoM, muestra)
      const pts = nivel === 'flor' ? 3 : nivel === 'conFlor' ? 6 : limite - Math.min(ptsJ, ptsM)
      addLog(`[F] Flor: vos ${vj} — máquina ${vm}`)
      if (vj >= vm) { setPtsJ(p => p + pts); addLog(`[+] Flor: +${pts} pts para vos`) }
      else { setPtsM(p => p + pts); addLog(`[-] Flor: +${pts} pts para la máquina`) }
      setFlorResuelta(true); setFlorPendiente(false); setEnvidoResuelto(true); setEsperando(false)
    }, 1000)
  }

  const responderFlorQuiero = () => {
    const vj = calcularFlor(manoJ, muestra), vm = calcularFlor(manoM, muestra)
    const pts = florCantada === 'flor' ? 3 : florCantada === 'conFlor' ? 6 : limite - Math.min(ptsJ, ptsM)
    addLog(`[F] Flor: vos ${vj} — máquina ${vm}`)
    if (vj >= vm) { setPtsJ(p => p + pts); addLog(`[+] Flor: +${pts} pts para vos`) }
    else { setPtsM(p => p + pts); addLog(`[-] Flor: +${pts} pts para la máquina`) }
    setFlorResuelta(true); setFlorPendiente(false); setEnvidoResuelto(true)
  }

  const responderFlorNoQuiero = () => {
    const pts = florCantada === 'flor' ? 3 : florCantada === 'conFlor' ? 3 : 5
    addLog(`[-] No quisiste la flor — +${pts} pts para la máquina`); setPtsM(p => p + pts)
    setFlorResuelta(true); setFlorPendiente(false); setEnvidoResuelto(true)
  }

  // ENVIDO
  const cantarEnvido = (nivel) => {
    if (esperando || envidoResuelto) return
    setEsperando(true); setEnvidoNivel(nivel)
    const pts = nivel === 'falta' ? limite - Math.min(ptsJ, ptsM) : nivel === 'real' ? 3 : 2
    setEnvidoPtsApostados(pts)
    const nEnv = nivel === 'real' ? 'Real Envido' : nivel === 'falta' ? 'Falta Envido' : 'Envido'
    addLog(`[E] Cantaste ${nEnv} (vale ${pts} pts)`)
    setTimeout(() => {
      if (Math.random() < 0.25) { addLog('[+] Máquina no quiere el envido — +1 pt para vos'); setPtsJ(p => p + 1); setEnvidoResuelto(true); setEsperando(false); return }
      if (nivel === 'envido' && Math.random() < 0.5) {
        const subida = Math.random() < 0.5 ? 'real' : 'falta'
        const ptsSub = subida === 'falta' ? limite - Math.min(ptsJ, ptsM) : 3
        addLog(`[E] Máquina sube a ${subida === 'real' ? 'Real Envido' : 'Falta Envido'} (vale ${ptsSub} pts)`)
        setEnvidoNivel(subida); setEnvidoPtsApostados(ptsSub); setEnvidoPendiente(true); setEsperando(false); return
      }
      addLog('[E] Máquina quiere el envido')
      const ej = calcularEnvido(manoJ, muestra), em = calcularEnvido(manoM, muestra)
      addLog(`[E] Tanto: vos ${ej} — máquina ${em}`)
      if (ej >= em) { setPtsJ(p => p + pts); addLog(`[+] Envido: +${pts} pts para vos`) }
      else { setPtsM(p => p + pts); addLog(`[-] Envido: +${pts} pts para la máquina`) }
      setEnvidoResuelto(true); setEsperando(false)
    }, 1000)
  }

  const responderEnvidoQuiero = () => {
    const ej = calcularEnvido(manoJ, muestra), em = calcularEnvido(manoM, muestra)
    const pts = envidoNivel === 'falta' ? limite - Math.min(ptsJ, ptsM) : envidoPtsApostados
    addLog(`[E] Tanto: vos ${ej} — máquina ${em}`)
    if (ej >= em) { setPtsJ(p => p + pts); addLog(`[+] Envido: +${pts} pts para vos`) }
    else { setPtsM(p => p + pts); addLog(`[-] Envido: +${pts} pts para la máquina`) }
    setEnvidoResuelto(true); setEnvidoPendiente(false)
  }

  const responderEnvidoNoQuiero = () => {
    addLog('[-] No quisiste el envido — +1 pt para la máquina'); setPtsM(p => p + 1)
    setEnvidoResuelto(true); setEnvidoPendiente(false)
  }

  // TRUCO
  const cantarTruco = (nivel) => {
    if (esperando || mostrandoMano) return
    setTrucoCantado(nivel); setUltimoEnCantar('jugador'); setEsperando(true)
    const nTru = nivel === 'truco' ? 'Truco' : nivel === 'retruco' ? 'Retruco' : 'Vale Cuatro'
    addLog(`[T] Cantaste ${nTru}`)
    setTimeout(() => {
      if (Math.random() < 0.35) {
        const pts = { truco: 1, retruco: 2, vale4: 3 }[nivel]; addLog(`[+] Máquina no quiere el truco — +${pts} pts para vos`); setPtsJ(p => p + pts)
        setTrucoResuelto(true); setEsperando(false)
        if (revisarGanador(ptsJ + pts, ptsM)) return
        setTimeout(() => { const { nuevoEsMano } = repartir(true, esMano); if (!nuevoEsMano) setTimeout(() => maquinaJugarFn([], [], [], 0), 500) }, 800)
      } else if (Math.random() < 0.65 || nivel === 'vale4') { addLog(`[T] Máquina quiere el ${nTru}`); setEsperando(false); setTrucoPendiente(false) }
      else {
        const subida = nivel === 'truco' ? 'retruco' : nivel === 'retruco' ? 'vale4' : null
        if (subida) { addLog(`[T] Máquina sube a ${subida === 'retruco' ? 'Retruco' : 'Vale Cuatro'}`); setTrucoCantado(subida); setUltimoEnCantar('maquina') }
        else addLog(`[T] Máquina quiere el ${nTru}`)
        setEsperando(false)
      }
    }, 1000)
  }

  const responderTrucoQuiero = () => { addLog(`[T] Aceptaste el truco`); setUltimoEnCantar('jugador'); setTrucoPendiente(false) }
  const responderTrucoNoQuiero = () => {
    const pts = { truco: 1, retruco: 2, vale4: 3 }[trucoCantado] || 1
    addLog(`[-] No quisiste el truco — +${pts} pts para la máquina`); setPtsM(p => p + pts); setTrucoResuelto(true); setTrucoPendiente(false)
    if (rivalTieneFlor) setMostrarCartasRival(true)
    setTimeout(() => terminarRonda('maquina', ptsJ, ptsM + pts, esMano), 800)
  }

  const subirTruco = (nivel) => {
    setTrucoCantado(nivel); setUltimoEnCantar('jugador'); setEsperando(true); setTrucoPendiente(false)
    const nSub = nivel === 'retruco' ? 'Retruco' : 'Vale Cuatro'
    addLog(`[T] Subís a ${nSub}`)
    setTimeout(() => {
      if (Math.random() < 0.35) {
        const pts = { retruco: 2, vale4: 3 }[nivel] || 1; addLog(`[+] Máquina no quiere — +${pts} pts para vos`); setPtsJ(p => p + pts)
        setTrucoResuelto(true); setEsperando(false)
        setTimeout(() => terminarRonda('jugador', ptsJ + pts, ptsM, esMano), 800)
      } else { addLog(`[T] Máquina quiere el ${nSub}`); setUltimoEnCantar('maquina'); setEsperando(false) }
    }, 1000)
  }

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    clearInterval(timerRef.current)
    const activo = turno === 'jugador' && florResuelta && !mostrandoMano &&
      !esperando && !trucoPendiente && !envidoPendiente && !florPendiente
    if (!activo) { setTimerSeg(45); return }
    setTimerSeg(45)
    timerRef.current = setInterval(() => {
      setTimerSeg(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current)
          const carta = manoJRef.current.find(c => !cjJ.includes(c))
          if (carta) jugarCarta(carta)
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timerRef.current)
  }, [turno, florResuelta, mostrandoMano, esperando, trucoPendiente, envidoPendiente, florPendiente])

  const resultadoUltimaMano = resultados[resultados.length - 1]
  const bloqueado = mostrandoMano || esperando || trucoPendiente || envidoPendiente
  const puedeJugar = turno === 'jugador' && !bloqueado && florResuelta
  const puedeEnvido = !envidoResuelto && !florJ && !florM && florResuelta && manoActual === 0 && !primeraJugada && !bloqueado
  const puedeTruco = !trucoResuelto && florResuelta && !mostrandoMano && !esperando
  const puedeIniciarTruco = puedeTruco && !trucoCantado && !trucoPendiente
  const puedeRetruco = puedeTruco && trucoPendiente && trucoCantado === 'truco' && ultimoEnCantar === 'maquina'
  const puedeVale4 = puedeTruco && trucoPendiente && trucoCantado === 'retruco' && ultimoEnCantar === 'maquina'
  const puedeIniciarRetruco = puedeTruco && !trucoPendiente && trucoCantado === 'truco' && ultimoEnCantar === 'maquina'
  const puedeIniciarVale4 = puedeTruco && !trucoPendiente && trucoCantado === 'retruco' && ultimoEnCantar === 'maquina'
  const puedeSubirEnvido = envidoPendiente && envidoNivel !== 'real' && envidoNivel !== 'falta'
  const puedeSubirRealEnvido = envidoPendiente && envidoNivel !== 'falta'
  const puedeSubirFaltaEnvido = envidoPendiente

  // MENÚ
  if (pantalla === 'menu') return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />
      <div className="relative flex-1 flex flex-col items-center justify-center px-6 py-12"
           style={{ minHeight: 'calc(100vh - 56px)' }}>

        {/* Glow central */}
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 60% 50% at 50% 40%, rgba(201,168,60,0.07), transparent)' }} />

        {/* Basto — derecha */}
        <svg className="hidden sm:block absolute right-16 top-1/2 -translate-y-1/2 select-none pointer-events-none" aria-hidden
             width="90" height="200" viewBox="0 0 30 68" fill="none">
          <circle cx="15" cy="10" r="10" fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <circle cx="15" cy="27" r="8.5" fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <circle cx="15" cy="42" r="7"   fill="rgba(201,168,60,0.06)" stroke="rgba(201,168,60,0.14)" strokeWidth="0.8"/>
          <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.11)" strokeWidth="0.8"/>
        </svg>
        {/* Oro — izquierda */}
        <svg className="hidden sm:block absolute left-16 top-1/2 -translate-y-1/2 select-none pointer-events-none" aria-hidden
             width="130" height="130" viewBox="0 0 46 46" fill="none">
          <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.15)" strokeWidth="2.2"/>
          <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.11)" strokeWidth="1.6"/>
          <circle cx="23" cy="4"  r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="4"  cy="23" r="2.2" fill="rgba(201,168,60,0.15)"/>
          <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.15)"/>
        </svg>

        <div className="relative z-10 w-full max-w-sm flex flex-col items-center gap-10">

          {/* Cabecera */}
          <div className="flex flex-col items-center gap-4 text-center"
               style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest"
                  style={{ background: 'rgba(201,168,60,0.07)', border: '1px solid rgba(201,168,60,0.2)', color: '#c9a83c' }}>
              1 vs Máquina
            </span>
            <div>
              <h1 className="text-6xl sm:text-7xl font-black leading-none tracking-tight">Truco</h1>
              <p className="text-gray-600 text-sm mt-3">Uruguayo · Con muestra</p>
            </div>

            {/* Feature chips */}
            <div className="flex flex-wrap justify-center gap-2 mt-1">
              {['Envido', 'Flor', 'Truco', 'Retruco', 'Vale cuatro'].map(f => (
                <span key={f} className="text-[11px] px-3 py-1 rounded-full"
                      style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', color: '#6b7280' }}>
                  {f}
                </span>
              ))}
            </div>
          </div>

          {/* Card de opciones */}
          <div className="w-full rounded-3xl p-7 flex flex-col gap-6"
               style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'opacity 0.7s ease 0.15s, transform 0.7s ease 0.15s' }}>

            <div className="flex flex-col items-center gap-3">
              <p className="text-[10px] font-semibold text-gray-600 uppercase tracking-[0.15em]">Puntos para ganar</p>
              <div className="flex gap-2.5 w-full justify-center">
                {[10, 20, 30, 40].map(l => (
                  <button key={l} onClick={() => setLimite(l)}
                    className="flex-1 max-w-[72px] h-14 rounded-2xl font-black text-lg transition-all hover:scale-105"
                    style={limite === l
                      ? { border: '2px solid #c9a83c', background: 'rgba(201,168,60,0.12)', color: '#fff', boxShadow: '0 0 24px rgba(201,168,60,0.18)' }
                      : { border: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)', color: '#4b5563' }}>
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={iniciar}
              className="w-full py-4 rounded-2xl font-bold text-base transition-all hover:scale-[1.02]"
              style={{ background: '#c9a83c', color: '#07090d' }}
              onMouseEnter={e => { e.currentTarget.style.background = '#e8c96a'; e.currentTarget.style.boxShadow = '0 0 32px rgba(201,168,60,0.3)' }}
              onMouseLeave={e => { e.currentTarget.style.background = '#c9a83c'; e.currentTarget.style.boxShadow = 'none' }}
            >
              Jugar vs Máquina →
            </button>
          </div>

          <button onClick={() => navigate('/juegos')}
            className="text-gray-700 text-xs hover:text-gray-400 transition -mt-4">
            ← Volver a los juegos
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )

  // RESULTADO
  if (pantalla === 'resultado') {
    const gano = ganador === 'jugador'
    return (
      <div className="min-h-screen text-white flex flex-col">
        <Navbar />
        <div className="relative flex-1 flex items-center justify-center px-4 overflow-hidden">
          <div className="absolute inset-0 pointer-events-none"
               style={{ background: gano
                 ? 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(201,168,60,0.15), transparent)'
                 : 'radial-gradient(ellipse 60% 50% at 50% 0%, rgba(220,38,38,0.12), transparent)' }} />
          <div className="absolute inset-0 pointer-events-none"
               style={{ backgroundImage: 'radial-gradient(rgba(201,168,60,0.04) 1px, transparent 1px)', backgroundSize: '30px 30px' }} />

          <div className="relative z-10 rounded-3xl p-10 max-w-sm w-full text-center flex flex-col gap-6 backdrop-blur-sm"
               style={{ background: 'rgba(255,255,255,0.025)', border: `1px solid ${gano ? 'rgba(201,168,60,0.2)' : 'rgba(255,255,255,0.07)'}` }}>
            <div className="flex justify-center">
              {gano ? (
                <div className="w-20 h-20 rounded-full flex items-center justify-center"
                     style={{ background: 'rgba(201,168,60,0.1)', border: '1px solid rgba(201,168,60,0.25)' }}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10" style={{ color: '#c9a83c' }}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 18.75h-9m9 0a3 3 0 013 3h-15a3 3 0 013-3m9 0v-3.375c0-.621-.503-1.125-1.125-1.125h-.871M7.5 18.75v-3.375c0-.621.504-1.125 1.125-1.125h.872m5.007 0H9.497m5.007 0a7.454 7.454 0 01-.982-3.172M9.497 14.25a7.454 7.454 0 00.981-3.172M5.25 4.236c-.982.143-1.954.317-2.916.52A6.003 6.003 0 007.73 9.728M5.25 4.236V4.5c0 2.108.966 3.99 2.48 5.228M5.25 4.236V2.721C7.456 2.41 9.71 2.25 12 2.25c2.291 0 4.545.16 6.75.47v1.516M7.73 9.728a6.726 6.726 0 002.748 1.35m8.272-6.842V4.5c0 2.108-.966 3.99-2.48 5.228m2.48-5.492a46.32 46.32 0 012.916.52 6.003 6.003 0 01-5.395 4.972m0 0a6.726 6.726 0 01-2.749 1.35m0 0a6.772 6.772 0 01-3.044 0"/>
                  </svg>
                </div>
              ) : (
                <div className="w-20 h-20 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="w-10 h-10 text-red-400">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z"/>
                  </svg>
                </div>
              )}
            </div>

            <div>
              <h2 className={`text-4xl font-extrabold ${gano ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 to-yellow-500' : 'text-white'}`}>
                {gano ? '¡Ganaste!' : 'Perdiste'}
              </h2>
              <p className="text-gray-500 text-sm mt-1">{gano ? '¡Bien jugado!' : 'La máquina te ganó esta vez'}</p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-2xl p-4" style={{ background: 'rgba(201,168,60,0.06)', border: '1px solid rgba(201,168,60,0.15)' }}>
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Vos</p>
                <p className="text-3xl font-extrabold" style={{ color: '#c9a83c' }}>{ptsJ}</p>
              </div>
              <div className="bg-white/[0.04] border border-white/[0.07] rounded-2xl p-4">
                <p className="text-gray-500 text-xs uppercase tracking-wider mb-1">Máquina</p>
                <p className="text-3xl font-extrabold text-red-400">{ptsM}</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setPantalla('menu')}
                className="flex-1 bg-white/[0.05] hover:bg-white/[0.09] border border-white/[0.08] text-gray-300 hover:text-white py-3 rounded-2xl font-semibold transition text-sm"
              >
                ← Menú
              </button>
              <button
                onClick={iniciar}
                className="flex-1 py-3 rounded-2xl font-bold transition text-sm"
                style={{ background: '#c9a83c', color: '#07090d' }}
                onMouseEnter={e => e.currentTarget.style.background = '#e8c96a'}
                onMouseLeave={e => e.currentTarget.style.background = '#c9a83c'}
              >
                Revancha →
              </button>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // JUEGO
  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />
      <MesaTruco
        manoJ={manoJ} manoM={manoM} cjJ={cjJ} cjM={cjM}
        muestra={muestra} resultados={resultados} manoActual={manoActual}
        ptsJ={ptsJ} ptsM={ptsM} limite={limite}
        turno={turno}
        cartaSel={cartaSel} setCartaSel={setCartaSel}
        log={log}
        mostrandoMano={mostrandoMano}
        trucoCantado={trucoCantado} ultimoEnCantar={ultimoEnCantar}
        trucoPendiente={trucoPendiente} envidoPendiente={envidoPendiente} florPendiente={florPendiente}
        florResuelta={florResuelta} envidoResuelto={envidoResuelto}
        bloqueado={bloqueado}
        jugarCarta={jugarCarta}
        cantarTruco={cantarTruco} responderTrucoQuiero={responderTrucoQuiero} responderTrucoNoQuiero={responderTrucoNoQuiero} subirTruco={subirTruco}
        cantarEnvido={cantarEnvido} responderEnvidoQuiero={responderEnvidoQuiero} responderEnvidoNoQuiero={responderEnvidoNoQuiero}
        cantarFlor={cantarFlor} responderFlorQuiero={responderFlorQuiero} responderFlorNoQuiero={responderFlorNoQuiero}
        puedeJugar={puedeJugar} puedeEnvido={puedeEnvido}
        puedeIniciarTruco={puedeIniciarTruco} puedeRetruco={puedeRetruco} puedeVale4={puedeVale4}
        puedeIniciarRetruco={puedeIniciarRetruco} puedeIniciarVale4={puedeIniciarVale4}
        puedeSubirEnvido={puedeSubirEnvido} puedeSubirRealEnvido={puedeSubirRealEnvido} puedeSubirFaltaEnvido={puedeSubirFaltaEnvido}
        nombreRival="Máquina"
        timerSeg={timerSeg}
        miNombre={usuario?.displayName || usuario?.email?.split('@')[0] || 'Jugador'}
        miPhotoURL={usuario?.photoURL || ''}
        florJ={florJ} florM={florM} florCantada={florCantada}
        mostrarCartasRival={mostrarCartasRival}
        nivelEnvido={envidoNivel}
        resultadoUltimaMano={resultadoUltimaMano}
        onSubirEnvidoConNivel={(nivel) => { setEnvidoPendiente(false); cantarEnvido(nivel) }}
      />
      <Footer />
    </div>
  )
}