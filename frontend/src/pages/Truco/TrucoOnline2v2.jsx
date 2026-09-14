import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/Navbar'
import Footer from '../../components/Footer'

export default function TrucoOnline2v2() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4">
        <div className="bg-gray-900 border border-gray-800 rounded-3xl p-10 max-w-md w-full text-center flex flex-col gap-6">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#c9a83c" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/>
            <line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <h2 className="text-3xl font-extrabold">Truco 2vs2</h2>
          <p className="text-gray-400">Esta modalidad está en desarrollo. ¡Pronto disponible!</p>
          <button
            onClick={() => navigate('/juegos/truco-online')}
            className="border border-gray-700 hover:border-yellow-600/50 text-gray-300 py-3 rounded-2xl font-semibold transition"
          >
            ← Volver
          </button>
        </div>
      </div>
      <Footer />
    </div>
  )
}