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

export default function Privacidad() {
  usePageTitle('Política de Privacidad')
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
              <h1 className="text-4xl font-black leading-none tracking-tight">Política de Privacidad</h1>
              <p className="text-gray-600 text-sm mt-3">Última actualización: septiembre 2026</p>
            </div>
          </div>

          <div className="h-px" style={{ background: 'linear-gradient(to right, rgba(201,168,60,0.15), transparent)', opacity: visible ? 1 : 0, transition: 'opacity 0.7s ease 0.2s' }} />

          <div className="flex flex-col gap-8">

            <Section title="1. Información que recopilamos">
              <p>Cuando iniciás sesión con Google recopilamos:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Nombre de cuenta</li>
                <li>Dirección de email</li>
                <li>Foto de perfil (si tenés una)</li>
                <li>ID único de usuario de Google</li>
              </ul>
              <p>Durante el uso del juego también guardamos:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Historial de partidas jugadas (resultado, puntaje)</li>
                <li>Puntuación ELO (ranking)</li>
              </ul>
            </Section>

            <Section title="2. Cómo usamos tu información">
              <p>Usamos estos datos exclusivamente para:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li>Identificarte dentro de la plataforma</li>
                <li>Mostrar tu nombre y foto en partidas y ranking</li>
                <li>Guardar tu historial de juego y puntuación</li>
              </ul>
              <p>No usamos tus datos para publicidad, no los vendemos ni los compartimos con terceros.</p>
            </Section>

            <Section title="3. Dónde se almacenan">
              <p>Los datos se almacenan en <span style={{ color: GOLD }}>Firebase</span> (Google), que cumple con los estándares internacionales de seguridad y privacidad (GDPR, SOC 2, ISO 27001).</p>
              <p>Los servidores del juego están alojados en <span style={{ color: GOLD }}>Render</span>. No almacenamos datos sensibles en estos servidores — solo el estado temporal de las partidas en curso.</p>
            </Section>

            <Section title="4. Inicio de sesión con Google">
              <p>El acceso a TrucoUY usa OAuth de Google. Nunca vemos ni almacenamos tu contraseña. Google gestiona la autenticación de forma segura. Podés revisar qué apps tienen acceso a tu cuenta en <span style={{ color: GOLD }}>myaccount.google.com</span>.</p>
            </Section>

            <Section title="5. Tus derechos">
              <p>Tenés derecho a:</p>
              <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
                <li><strong className="text-white">Acceder</strong> a los datos que guardamos sobre vos</li>
                <li><strong className="text-white">Eliminar</strong> tu cuenta y todos tus datos</li>
                <li><strong className="text-white">Corregir</strong> información incorrecta</li>
              </ul>
              <p>Para cualquiera de estas acciones escribí a <span style={{ color: GOLD }}>iaioiglesia@icloud.com</span>.</p>
            </Section>

            <Section title="6. Menores de edad">
              <p>TrucoUY no está dirigido a menores de 13 años. Si tenés menos de 13 años, por favor no uses la plataforma. Si somos notificados de que un menor ha registrado una cuenta, la eliminaremos.</p>
            </Section>

            <Section title="7. Retención de datos">
              <p>Conservamos tus datos mientras tengas una cuenta activa. Si no iniciás sesión durante más de 12 meses consecutivos, podemos eliminar tu cuenta y datos asociados.</p>
            </Section>

            <Section title="8. Cambios en esta política">
              <p>Podemos actualizar esta política en cualquier momento. Te notificaremos de cambios significativos publicándolos en esta página con la fecha de actualización.</p>
            </Section>

            <Section title="9. Contacto">
              <p>Para consultas sobre privacidad escribí a <span style={{ color: GOLD }}>iaioiglesia@icloud.com</span>.</p>
            </Section>

          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
