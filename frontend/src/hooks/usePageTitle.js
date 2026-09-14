import { useEffect } from 'react'

export function usePageTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} — TrucoUY` : 'TrucoUY'
    return () => { document.title = 'TrucoUY' }
  }, [title])
}
