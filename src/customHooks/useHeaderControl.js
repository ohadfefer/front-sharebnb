import { useEffect, useState } from "react"
import { useMatch } from "react-router-dom"

export function useHeaderControl(
  distance = 80,
  {
    forceMiniOnMatch = "/stay/:id", 
    hysteresisPx = 12,
    disabled = false,
  } = {}
) {
  const isForcedMiniRoute = forceMiniOnMatch ? !!useMatch(forceMiniOnMatch) : false
  const [mini, setMini] = useState(isForcedMiniRoute ? true : false)

  useEffect(() => {
    if (disabled || isForcedMiniRoute) {
      setMini(true)
      return
    }

    const onScroll = () => {
      const y = window.scrollY || 0
      setMini(prev =>
        prev ? y > distance - hysteresisPx : y > distance + hysteresisPx
      )
    }

    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [distance, hysteresisPx, disabled, isForcedMiniRoute])

  const sticky = !isForcedMiniRoute

  return { mini, sticky }
}
