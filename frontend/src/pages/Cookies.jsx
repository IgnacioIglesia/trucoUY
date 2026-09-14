import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePageTitle } from '../hooks/usePageTitle'

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-white font-bold text-base">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed flex flex-col gap-2">{children}</div>
  </div>
)

export default function Cookies() {
  usePageTitle('Política de Cookies')
  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">Legal</span>
          <h1 className="text-3xl font-extrabold">Política de Cookies</h1>
          <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="h-px bg-white/[0.06]" />

        <div className="flex flex-col gap-8">

          <Section title="¿Qué son las cookies?">
            <p>Las cookies son pequeños archivos de texto que los sitios web guardan en tu dispositivo cuando los visitás. Sirven para recordar información entre visitas.</p>
          </Section>

          <Section title="Cookies que usamos">
            <p>TrucoUY usa un número mínimo de cookies, todas necesarias para el funcionamiento:</p>

            <div className="flex flex-col gap-3 mt-1">
              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-1.5">
                <p className="text-white text-xs font-bold">Autenticación (Firebase Auth)</p>
                <p className="text-gray-400 text-xs">Firebase guarda un token de sesión para mantenerte conectado. Sin esta cookie tendrías que iniciar sesión cada vez. No puede desactivarse si usás tu cuenta.</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-blue-900/40 border border-blue-700/30 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Necesaria</span>
                  <span className="text-[10px] bg-white/[0.04] border border-white/[0.08] text-gray-400 px-2 py-0.5 rounded-full">Google Firebase</span>
                </div>
              </div>

              <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-4 flex flex-col gap-1.5">
                <p className="text-white text-xs font-bold">Preferencias locales</p>
                <p className="text-gray-400 text-xs">Guardamos preferencias menores en localStorage (no cookies tradicionales) como el estado de la sesión de juego. No salen de tu dispositivo.</p>
                <div className="flex gap-2 mt-1">
                  <span className="text-[10px] bg-blue-900/40 border border-blue-700/30 text-blue-300 px-2 py-0.5 rounded-full font-semibold">Necesaria</span>
                  <span className="text-[10px] bg-white/[0.04] border border-white/[0.08] text-gray-400 px-2 py-0.5 rounded-full">Local</span>
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
            <p>Para consultas sobre el uso de cookies escribí a <span className="text-purple-400">iaioiglesia@icloud.com</span>.</p>
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
