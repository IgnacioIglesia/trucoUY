import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePageTitle } from '../hooks/usePageTitle'

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-white font-bold text-base">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed flex flex-col gap-2">{children}</div>
  </div>
)

export default function Terminos() {
  usePageTitle('Términos y Condiciones')
  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">Legal</span>
          <h1 className="text-3xl font-extrabold">Términos y Condiciones</h1>
          <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="h-px bg-white/[0.06]" />

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
            <p>El código, diseño y contenido de TrucoUY son de autoría propia. Los juegos implementados (Truco, Solitario, Póker, etc.) son juegos de dominio público.</p>
          </Section>

          <Section title="8. Cambios en los términos">
            <p>Podemos actualizar estos términos en cualquier momento. Los cambios entran en vigor al publicarse en esta página. El uso continuado de TrucoUY implica la aceptación de los nuevos términos.</p>
          </Section>

          <Section title="9. Contacto">
            <p>Para cualquier consulta relacionada con estos términos podés escribir a <span className="text-purple-400">iaioiglesia@icloud.com</span>.</p>
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
