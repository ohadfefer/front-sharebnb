import 'react-day-picker/dist/style.css'
import { DayPicker } from 'react-day-picker'
import { parseISO, isValid, format } from 'date-fns'
import { useMemo } from 'react'

const ISO_FORMAT = 'yyyy-MM-dd'
const toIso = d => (d ? format(d, ISO_FORMAT) : '')
const fromIso = s => (s ? (isValid(parseISO(s)) ? parseISO(s) : undefined) : undefined)

export function DateRangePanel({ value, onChange }) {
    const selectedRange = useMemo(
        () => ({ from: fromIso(value?.checkIn), to: fromIso(value?.checkOut) }),
        [value?.checkIn, value?.checkOut]
    )

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
