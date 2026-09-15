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

export default function Terminos() {
  usePageTitle('Términos y Condiciones')
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
              <h1 className="text-4xl font-black leading-none tracking-tight">Términos y Condiciones</h1>
              <p className="text-gray-600 text-sm mt-3">Última actualización: septiembre 2026</p>
            </div>
          </div>

          <div className="h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,60,0.15), transparent)', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }} />

          <div className="flex flex-col gap-8">

            <Section title="1. Aceptación">
              <p>Al acceder y usar TrucoUY aceptás estos términos. Si no estás de acuerdo, por favor no uses la plataforma.</p>
            </Section>

            <Section title="2. Qué es TrucoUY">
              <p>TrucoUY es un proyecto personal sin fines de lucro que ofrece juegos de entretenimiento online de forma gratuita. No es una empresa ni un servicio comercial.</p>
            </Section>

            <Section title="3. Uso permitido">
              <p>Podés usar TrucoUY para:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Jugar de forma recreativa</li>
                <li>Competir con otros jugadores</li>
                <li>Acceder a tu historial y ranking</li>
              </ul>
              <p>Está prohibido:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Usar bots, scripts o cualquier sistema automatizado</li>
                <li>Intentar hackear, sobrecargar o afectar el funcionamiento del servicio</li>
                <li>Usar lenguaje ofensivo, amenazante o discriminatorio en el chat</li>
                <li>Crear cuentas falsas o suplantarle la identidad a otros</li>
              </ul>
            </Section>

            <Section title="4. Cuentas">
              <p>Para acceder a ciertas funciones (ranking, historial) necesitás iniciar sesión con Google. Sos responsable de mantener la seguridad de tu cuenta.</p>
              <p>Nos reservamos el derecho de suspender cuentas que violen estos términos, sin previo aviso.</p>
            </Section>

            <Section title="5. Disponibilidad del servicio">
              <p>TrucoUY se ofrece "tal cual está". No garantizamos disponibilidad continua, ya que es un proyecto personal con recursos limitados. El servicio puede estar caído por mantenimiento, problemas técnicos u otras razones sin previo aviso.</p>
            </Section>

            <Section title="6. Limitación de responsabilidad">
              <p>TrucoUY no se hace responsable por:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Pérdida de datos o progreso en los juegos</li>
                <li>Interrupciones del servicio</li>
                <li>Daños derivados del uso de la plataforma</li>
              </ul>
            </Section>

            <Section title="7. Propiedad intelectual">
              <p>El código, diseño y contenido de TrucoUY son de autoría propia. El juego de Truco implementado es de dominio público.</p>
            </Section>

            <Section title="8. Cambios en los términos">
              <p>Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor al publicarse en esta página. El uso continuado de TrucoUY implica la aceptación de los nuevos términos.</p>
            </Section>

            <Section title="9. Contacto">
              <p>Para cualquier consulta relacionada con estos términos podés escribir a <span style={{ color: GOLD }}>iaioiglesia@icloud.com</span>.</p>
            </Section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
