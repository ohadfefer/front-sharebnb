import { useEffect, useState } from 'react'

export function useHeaderControl(distance = 80, forceExpanded = false) {
  const [isHeaderMini, setIsHeaderMini] = useState(false)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0

      setIsHeaderMini(!forceExpanded && y > distance)
    }
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [distance, forceExpanded])

  return isHeaderMini
}
