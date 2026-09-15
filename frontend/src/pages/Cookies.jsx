import { useState, useEffect, useRef } from 'react'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePageTitle } from '../hooks/usePageTitle'

const GOLD = '#c9a83c'
const GOLD_BORDER = 'rgba(201,168,60,0.22)'

function Section({ title, children }) {
  const ref = useRef(null)
  const [seen, setSeen] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) { setSeen(true); obs.disconnect() } },
      { threshold: 0.08 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="flex flex-col gap-3"
         style={{ opacity: seen ? 1 : 0, transform: seen ? 'none' : 'translateY(14px)', transition: 'opacity 0.55s ease, transform 0.55s ease' }}>
      <h2 className="flex items-center gap-2.5 text-white font-bold text-[15px]">
        <span className="flex-shrink-0 w-0.5 h-3.5 rounded-full" style={{ background: GOLD, opacity: 0.5 }} />
        {title}
      </h2>
      <div className="text-gray-400 text-sm leading-relaxed flex flex-col gap-2 pl-4">{children}</div>
    </div>
  )
}

export default function Cookies() {
  usePageTitle('Política de Cookies')
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 60)
    return () => clearTimeout(t)
  }, [])

  return (
    <div className="min-h-screen text-white flex flex-col">
      <Navbar />

      <div className="relative flex-1">
        <div className="absolute inset-0 pointer-events-none"
             style={{ background: 'radial-gradient(ellipse 70% 25% at 50% 0%, rgba(201,168,60,0.05), transparent)' }} />

        <div className="relative z-10 max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-10">

          {/* Header */}
          <div className="flex flex-col gap-4"
               style={{ opacity: visible ? 1 : 0, transform: visible ? 'none' : 'translateY(16px)', transition: 'opacity 0.7s ease, transform 0.7s ease' }}>
            <span className="inline-flex items-center gap-1.5 text-[10px] font-semibold px-3 py-1.5 rounded-full uppercase tracking-widest self-start"
                  style={{ background: 'rgba(201,168,60,0.07)', border: `1px solid ${GOLD_BORDER}`, color: GOLD }}>
              Legal
            </span>
            <div>
              <h1 className="text-4xl font-black leading-none tracking-tight">Política de Cookies</h1>
              <p className="text-gray-600 text-sm mt-3">Última actualización: septiembre 2026</p>
            </div>
          </div>

          <div className="h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,60,0.15), transparent)', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }} />

          <div className="flex flex-col gap-8">

            <Section title="¿Qué son las cookies?">
              <p>Las cookies son pequeños archivos de texto que los sitios web guardan en tu dispositivo cuando los visitás. Sirven para recordar información entre visitas.</p>
            </Section>

            <Section title="Cookies que usamos">
              <p>TrucoUY usa un número mínimo de cookies, todas necesarias para el funcionamiento:</p>
              <div className="flex flex-col gap-3 mt-1">
                <div className="rounded-xl p-4 flex flex-col gap-1.5"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-xs font-bold">Autenticación (Firebase Auth)</p>
                  <p className="text-gray-400 text-xs">Firebase guarda un token de sesión para mantenerte conectado. Sin esta cookie tendrías que iniciar sesión cada vez. No puede desactivarse si usás tu cuenta.</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>Necesaria</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>Google Firebase</span>
                  </div>
                </div>
                <div className="rounded-xl p-4 flex flex-col gap-1.5"
                     style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <p className="text-white text-xs font-bold">Preferencias locales</p>
                  <p className="text-gray-400 text-xs">Guardamos preferencias menores en localStorage (no cookies tradicionales) como el estado de la sesión de juego. No salen de tu dispositivo.</p>
                  <div className="flex gap-2 mt-1">
                    <span className="text-[10px] px-2 py-0.5 rounded-full font-semibold"
                          style={{ background: 'rgba(59,130,246,0.15)', border: '1px solid rgba(59,130,246,0.3)', color: '#93c5fd' }}>Necesaria</span>
                    <span className="text-[10px] px-2 py-0.5 rounded-full"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', color: '#9ca3af' }}>Local</span>
                  </div>
                </div>
              </div>
            </Section>

            <Section title="Lo que NO hacemos">
              <ul className="list-disc list-inside flex flex-col gap-1.5 text-gray-400 ml-2">
                <li>No usamos cookies de publicidad ni tracking</li>
                <li>No compartimos datos de navegación con terceros</li>
                <li>No usamos Google Analytics ni herramientas de análisis de comportamiento</li>
              </ul>
            </Section>

            <Section title="Cómo controlar las cookies">
              <p>Podés gestionar o eliminar cookies desde la configuración de tu navegador:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Chrome: Configuración → Privacidad → Cookies</li>
                <li>Firefox: Opciones → Privacidad → Cookies</li>
                <li>Safari: Preferencias → Privacidad</li>
              </ul>
              <p>Tené en cuenta que deshabilitar las cookies de autenticación hará que no puedas iniciar sesión.</p>
            </Section>

            <Section title="Contacto">
              <p>Para consultas sobre el uso de cookies escribí a <span style={{ color: GOLD }}>iaioiglesia@icloud.com</span>.</p>
            </Section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
