import { useEffect, useRef, useState } from 'react'

export function useHeaderControl(distance = 80) {
  const [isHeaderMini, setIsHeaderMini] = useState(false)
  const lastY = useRef(0)

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY || 0
      setIsHeaderMini(y > distance)
      lastY.current = y
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [distance])

  return isHeaderMini
}
