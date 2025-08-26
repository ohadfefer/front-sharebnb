import { useEffect, useRef, useState } from "react"
import { DayPicker } from "react-day-picker"
import { format } from "date-fns"

export function DateRangePicker() {
  const [range, setRange] = useState({ from: undefined, to: undefined })
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)

  const triggerRef = useRef(null)   // ← עוטף את שני התאים
  const popoverRef = useRef(null)

  useEffect(() => {
    function handleClickOutside(event) {
      if (!isPopoverOpen) return
      if (popoverRef.current?.contains(event.target)) return
      if (triggerRef.current?.contains(event.target)) return
      setIsPopoverOpen(false)
    }
    function onEsc(event) { if (event.key === "Escape") setIsPopoverOpen(false) }

    document.addEventListener("mousedown", handleClickOutside)
    document.addEventListener("keydown", onEsc)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
      document.removeEventListener("keydown", onEsc)
    }
  }, [isPopoverOpen])

  return (
    <>
      <div ref={triggerRef} className="dates-trigger-wrap">
        <div className="cell checkin" onMouseDown={(event) => { event.preventDefault(); setIsPopoverOpen(true) }}>
          <span className="title">Check in</span>
          <span className="place-holder">{range.from ? format(range.from, "MMM d") : "Add date"}</span>
        </div>

        <div className="cell checkout" onMouseDown={(event) => { event.preventDefault(); setIsPopoverOpen(true) }}>
          <span className="title">Check out</span>
          <span className="place-holder">{range.to ? format(range.to, "MMM d") : "Add date"}</span>
        </div>
      </div>

      {isPopoverOpen && (
        <div ref={popoverRef} className="dates-popover">
          <DayPicker
            mode="range"
            selected={range}
            onSelect={setRange}
            numberOfMonths={2}
            showOutsideDays
          />
        </div>
      )}
    </>
  )
}
