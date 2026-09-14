import { useState } from 'react'

export default function Avatar({ usuario, size = 'md' }) {
  const sizes = {
    sm:  'w-7 h-7 text-xs',
    md:  'w-9 h-9 text-sm',
    lg:  'w-16 h-16 text-xl',
    xl:  'w-24 h-24 text-3xl',
  }
  const cls = sizes[size] ?? sizes.md
  const [imgFailed, setImgFailed] = useState(false)

  const iniciales = (usuario?.displayName || usuario?.email || '?').slice(0, 2).toUpperCase()
  const borderStyle = { border: '2px solid rgba(201,168,60,0.35)' }

  if (usuario?.photoURL && !imgFailed) {
    return (
      <img
        src={usuario.photoURL}
        alt=""
        className={`${cls} rounded-full object-cover flex-shrink-0`}
        style={borderStyle}
        referrerPolicy="no-referrer"
        onError={() => setImgFailed(true)}
      />
    )
  }

  return (
    <div className={`${cls} rounded-full flex items-center justify-center font-bold flex-shrink-0`}
         style={{ ...borderStyle, background: 'rgba(201,168,60,0.15)', color: '#c9a83c' }}>
      <span>{iniciales}</span>
    </div>
  )
}
