import { Component } from 'react'

const GOLD = '#c9a83c'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

export default class ErrorBoundary extends Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  componentDidCatch(error, info) {
    console.error('Error no capturado:', error, info)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{ minHeight: '100vh', background: '#07090d', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'system-ui, sans-serif', position: 'relative', overflow: 'hidden' }}>

          {/* Glow de fondo */}
          <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 60% 50% at 50% 50%, rgba(201,168,60,0.05), transparent)' }} />

          {/* Oro — izquierda */}
          <svg style={{ position: 'absolute', left: 32, top: '50%', transform: 'translateY(-50%)', opacity: 1, pointerEvents: 'none' }}
               width="110" height="110" viewBox="0 0 46 46" fill="none" aria-hidden>
            <circle cx="23" cy="23" r="20" stroke="rgba(201,168,60,0.12)" strokeWidth="2.2"/>
            <circle cx="23" cy="23" r="11.5" stroke="rgba(201,168,60,0.08)" strokeWidth="1.6"/>
            <circle cx="23" cy="4"  r="2.2" fill="rgba(201,168,60,0.12)"/>
            <circle cx="23" cy="42" r="2.2" fill="rgba(201,168,60,0.12)"/>
            <circle cx="4"  cy="23" r="2.2" fill="rgba(201,168,60,0.12)"/>
            <circle cx="42" cy="23" r="2.2" fill="rgba(201,168,60,0.12)"/>
          </svg>

          {/* Basto — derecha */}
          <svg style={{ position: 'absolute', right: 32, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }}
               width="70" height="160" viewBox="0 0 30 68" fill="none" aria-hidden>
            <circle cx="15" cy="10" r="10" fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.11)" strokeWidth="0.8"/>
            <circle cx="15" cy="27" r="8.5" fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.11)" strokeWidth="0.8"/>
            <circle cx="15" cy="42" r="7"   fill="rgba(201,168,60,0.05)" stroke="rgba(201,168,60,0.11)" strokeWidth="0.8"/>
            <path d="M12.5 48 C12 54 10 60 8 68 L22 68 C20 60 18 54 17.5 48 Z"
                  fill="rgba(201,168,60,0.04)" stroke="rgba(201,168,60,0.09)" strokeWidth="0.8"/>
          </svg>

          {/* Contenido */}
          <div style={{ position: 'relative', zIndex: 10, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 32, textAlign: 'center', maxWidth: 400 }}>

            {/* Ícono grande con número */}
            <div style={{ position: 'relative' }}>
              <div style={{ fontSize: 140, fontWeight: 900, lineHeight: 1, color: 'rgba(201,168,60,0.06)', letterSpacing: '-4px', userSelect: 'none' }}>
                ERR
              </div>
              <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: 20, background: 'rgba(201,168,60,0.07)', border: `1px solid ${GOLD_BORDER}`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke={GOLD} strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"/>
                  </svg>
                </div>
              </div>
            </div>

            {/* Texto */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <span style={{ fontSize: 10, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: GOLD, background: 'rgba(201,168,60,0.07)', border: `1px solid ${GOLD_BORDER}`, borderRadius: 999, padding: '6px 14px', display: 'inline-block' }}>
                Error inesperado
              </span>
              <h1 style={{ fontSize: 40, fontWeight: 900, lineHeight: 1, letterSpacing: '-1px', margin: 0 }}>
                Algo salió mal
              </h1>
              <p style={{ color: '#6b7280', fontSize: 14, lineHeight: 1.6, margin: 0 }}>
                Ocurrió un error inesperado.<br/>Recargá la página para continuar.
              </p>
            </div>

            {/* Botones */}
            <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button
                onClick={() => window.location.reload()}
                style={{ padding: '12px 28px', borderRadius: 14, fontWeight: 700, fontSize: 14, background: GOLD, color: '#07090d', border: 'none', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                Recargar página
              </button>
              <button
                onClick={() => { window.location.href = '/' }}
                style={{ padding: '12px 28px', borderRadius: 14, fontWeight: 600, fontSize: 14, background: 'rgba(255,255,255,0.04)', color: '#e5e7eb', border: '1px solid rgba(255,255,255,0.08)', cursor: 'pointer', transition: 'opacity 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
              >
                Ir al inicio
              </button>
            </div>

          </div>
        </div>
      )
    }
    return this.props.children
  }
}
