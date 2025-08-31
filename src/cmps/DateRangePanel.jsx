import 'react-day-picker/dist/style.css'
import { DayPicker } from 'react-day-picker'
import { parseISO, isValid, format } from 'date-fns'
import { useMemo, useState, useEffect } from 'react'

const ISO_FORMAT = 'yyyy-MM-dd'
const toIso = d => (d ? format(d, ISO_FORMAT) : '')
const fromIso = s => (s ? (isValid(parseISO(s)) ? parseISO(s) : undefined) : undefined)

export function DateRangePanel({ value, onChange }) {
    const selectedRange = useMemo(
        () => ({ from: fromIso(value?.checkIn), to: fromIso(value?.checkOut) }),
        [value?.checkIn, value?.checkOut]
    )

    const [hoverDay, setHoverDay] = useState()
    const hoverRange = useMemo(() => {
        if (!selectedRange.from || selectedRange.to || !hoverDay) return undefined
        const a = selectedRange.from
        const b = hoverDay
        return a <= b ? { from: a, to: b } : { from: b, to: a }
    }, [selectedRange, hoverDay])

    useEffect(() => {
        if (selectedRange.to) setHoverDay(undefined)
    }, [selectedRange.to])

    function handleSelect(range) {
        onChange({
            checkIn: toIso(range?.from),
            checkOut: toIso(range?.to),
        })
    }

    return (
        <DayPicker
            className="stay-picker"
            mode="range"
            selected={selectedRange}
            onSelect={handleSelect}
            modifiers={hoverRange ? { rangeHover: hoverRange } : undefined}
            modifiersClassNames={{ rangeHover: 'is-range-hover' }}
            modifiersStyles={{
                rangeHover: {
                    background: 'var(--rdp-range_middle-background-color, #f3f4f6)',
                    color: 'var(--rdp-range_middle-color, #111)',
                    borderRadius: '10px',
                },
            }}
            onDayMouseEnter={(d) => {
                if (selectedRange.from && !selectedRange.to) setHoverDay(d)
            }}
            onDayMouseLeave={() => setHoverDay(undefined)}
            numberOfMonths={2}
            showOutsideDays
            defaultMonth={selectedRange.from || selectedRange.to || new Date()}
            initialFocus
            styles={{
                root: {
                    '--rdp-months-gap': '32px',
                    '--rdp-day-width': '46px',
                    '--rdp-day-height': '46px',
                    '--rdp-day_button-width': '44px',
                    '--rdp-day_button-height': '44px',
                    '--rdp-day_button-border-radius': '999px',
                    '--rdp-accent-color': '#111',
                    '--rdp-accent-background-color': '#fff',
                    '--rdp-range_middle-background-color': '#f3f4f6',
                    '--rdp-range_middle-color': '#111',
                    '--rdp-outside-opacity': '0.35',
                    '--rdp-disabled-opacity': '0.35',
                    '--rdp-weekday-opacity': '0.75',
                    '--rdp-nav_button-width': '36px',
                    '--rdp-nav_button-height': '36px',
                    '--rdp-animation_duration': '.25s',
                    '--rdp-animation_timing': 'cubic-bezier(.2,.8,.2,1)',
                },
            }}
        />
    )
}
