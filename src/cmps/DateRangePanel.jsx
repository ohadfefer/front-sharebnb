// panels/DateRangePanel.jsx
import { useMemo } from "react"
import { DayPicker } from "react-day-picker"
import { parseISO, isValid, format } from "date-fns"

const ISO_FORMAT = "yyyy-MM-dd"
const toIso = (date) => (date ? format(date, ISO_FORMAT) : "")
const fromIso = (iso) => (iso ? (isValid(parseISO(iso)) ? parseISO(iso) : undefined) : undefined)

/** Props:
 *  - activeCell: "checkin" | "checkout"
 *  - value: { checkIn: string, checkOut: string }
 *  - onChange: ({ checkIn, checkOut }) => void
 *  - onComplete?: () => void
 */
export function DateRangePanel({ activeCell, value, onChange, onComplete }) {
    const selectedRange = useMemo(
        () => ({ from: fromIso(value?.checkIn), to: fromIso(value?.checkOut) }),
        [value?.checkIn, value?.checkOut]
    )

    function handleSelect(range) {
        const next = { checkIn: toIso(range?.from), checkOut: toIso(range?.to) }
        onChange(next)
        if (range?.from && range?.to) onComplete?.()
    }

    return (
        <DayPicker
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            numberOfMonths={2}
            showOutsideDays
            defaultMonth={selectedRange.from || selectedRange.to || new Date()}
            initialFocus
        />
    )
}
