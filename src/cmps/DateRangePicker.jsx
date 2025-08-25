// src/cmps/DateRangePicker.jsx
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from 'react'
import { DayPicker } from 'react-day-picker'
import { format, parseISO, isValid } from 'date-fns'

const DISPLAY_FMT = 'MMM d'      // Sep 18
const ISO_FMT = 'yyyy-MM-dd' // נשמר לסטייט/שאילתות

function toISO(d) { return d ? format(d, ISO_FMT) : '' }
function fromISO(s) {
  if (!s) return null
  try { const d = parseISO(s); return isValid(d) ? d : null } catch { return null }
}

const DateRangePicker = forwardRef(function DateRangePicker(
  {
    value,         // { checkIn, checkOut } as 'yyyy-MM-dd' | ''
    onChange,      // ({checkIn,checkOut}) => void
    disablePast = true,
    numberOfMonths = 2,
    className = '',
    onRequestExpand,  // אופציונלי: לפתוח את ההדר מבחוץ
  },
  ref
) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeField, setActiveField] = useState('from') // 'from' | 'to'
  const popoverRef = useRef(null)

  const selected = { from: fromISO(value?.checkIn || ''), to: fromISO(value?.checkOut || '') }
  const disabled = disablePast ? [{ before: new Date() }] : []

  // API אימפרטיבי
  useImperativeHandle(ref, () => ({
    open(which = 'from') {
      onRequestExpand?.()
      setActiveField(which)
      setIsOpen(true)
    },
    focusFrom() { onRequestExpand?.(); setActiveField('from'); setIsOpen(true) },
    focusTo() { onRequestExpand?.(); setActiveField('to'); setIsOpen(true) },
    close() { setIsOpen(false) },
  }), [onRequestExpand])

  // סגירה ב־ESC/לחיצה בחוץ
  useEffect(() => {
    const onDocClick = (e) => { if (isOpen && popoverRef.current && !popoverRef.current.contains(e.target)) setIsOpen(false) }
    const onEsc = (e) => { if (e.key === 'Escape') setIsOpen(false) }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('keydown', onEsc)
    return () => { document.removeEventListener('mousedown', onDocClick); document.removeEventListener('keydown', onEsc) }
  }, [isOpen])

  function handleSelect(next) {
    const checkIn = next?.from ? toISO(next.from) : ''
    const checkOut = next?.to ? toISO(next.to) : ''
    onChange?.({ checkIn, checkOut })
    if (next?.from && !next?.to) setActiveField('to')
    if (next?.from && next?.to) setIsOpen(false)
  }

  return (
    <div className={`rdp-airbnb ${className}`} style={{ position: 'relative' }}>
      {/* הכפתורים העליונים (Airbnb-style) */}
      <div className="air-inputs">
        <button
          type="button"
          className={`air-input ${activeField === 'from' ? 'active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onRequestExpand?.(); setActiveField('from'); setIsOpen(true) }}
          aria-label="Choose check-in date"
        >
          <span className="title">Check in</span>
          <span className={`val ${selected.from ? '' : 'placeholder'}`}>
            {selected.from ? format(selected.from, DISPLAY_FMT) : 'Add date'}
          </span>
        </button>

        <button
          type="button"
          className={`air-input ${activeField === 'to' ? 'active' : ''}`}
          onMouseDown={(e) => { e.preventDefault(); onRequestExpand?.(); setActiveField('to'); setIsOpen(true) }}
          aria-label="Choose check-out date"
        >
          <span className="title">Check out</span>
          <span className={`val ${selected.to ? '' : 'placeholder'}`}>
            {selected.to ? format(selected.to, DISPLAY_FMT) : 'Add date'}
          </span>
        </button>
      </div>

      {isOpen && (
        <div ref={popoverRef} className="air-popover" role="dialog" aria-label="Choose dates">
          <DayPicker
            mode="range"
            selected={selected}
            onSelect={handleSelect}
            defaultMonth={selected.from || new Date()}
            numberOfMonths={numberOfMonths}
            showOutsideDays
            pagedNavigation
            captionLayout="buttons"
            disabled={disabled}
            modifiersClassNames={{
              range_start: 'air-range-start',
              range_end: 'air-range-end',
              range_middle: 'air-range-middle',
              selected: 'air-selected'
            }}
          />

          {/* שורת גמישות (דקורטיבית לעכשיו) */}
          <div className="air-flex-row">
            {['Exact dates', '± 1 day', '± 2 days', '± 3 days', '± 7 days', '± 14 days'].map((t, i) => (
              <button key={i} type="button" className={`chip ${i === 0 ? 'active' : ''}`}>{t}</button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
})

export default DateRangePicker
