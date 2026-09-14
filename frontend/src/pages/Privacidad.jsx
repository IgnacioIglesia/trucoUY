import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
import { usePageTitle } from '../hooks/usePageTitle'

const Section = ({ title, children }) => (
  <div className="flex flex-col gap-3">
    <h2 className="text-white font-bold text-base">{title}</h2>
    <div className="text-gray-400 text-sm leading-relaxed flex flex-col gap-2">{children}</div>
  </div>
)

export default function Privacidad() {
  usePageTitle('Política de Privacidad')
  return (
    <div className="min-h-screen bg-[#07070f] text-white flex flex-col">
      <Navbar />
      <div className="flex-1 max-w-2xl mx-auto w-full px-6 py-14 flex flex-col gap-10">

        <div className="flex flex-col gap-2">
          <span className="text-[10px] text-purple-400 font-semibold uppercase tracking-widest">Legal</span>
          <h1 className="text-3xl font-extrabold">Política de Privacidad</h1>
          <p className="text-gray-500 text-sm">Última actualización: mayo 2026</p>
        </div>

        <div className="h-px bg-white/[0.06]" />

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
            <p>Los datos se almacenan en <span className="text-purple-400">Firebase</span> (Google), que cumple con los estándares internacionales de seguridad y privacidad (GDPR, SOC 2, ISO 27001).</p>
            <p>Los servidores del juego están alojados en <span className="text-purple-400">Render</span>. No almacenamos datos sensibles en estos servidores — solo el estado temporal de las partidas en curso.</p>
          </Section>

          <Section title="4. Inicio de sesión con Google">
            <p>El acceso a TrucoUY usa OAuth de Google. Nunca vemos ni almacenamos tu contraseña. Google gestiona la autenticación de forma segura. Podés revisar qué apps tienen acceso a tu cuenta en <span className="text-purple-400">myaccount.google.com</span>.</p>
          </Section>

          <Section title="5. Tus derechos">
            <p>Tenés derecho a:</p>
            <ul className="list-disc list-inside flex flex-col gap-1 text-gray-400 ml-2">
              <li><strong className="text-white">Acceder</strong> a los datos que guardamos sobre vos</li>
              <li><strong className="text-white">Eliminar</strong> tu cuenta y todos tus datos</li>
              <li><strong className="text-white">Corregir</strong> información incorrecta</li>
            </ul>
            <p>Para cualquiera de estas acciones escribí a <span className="text-purple-400">iaioiglesia@icloud.com</span>.</p>
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
            <p>Para consultas sobre privacidad escribí a <span className="text-purple-400">iaioiglesia@icloud.com</span>.</p>
          </Section>

        </div>
      </div>
      <Footer />
    </div>
  )
}
