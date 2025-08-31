import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { DateRangePanel } from './DateRangePanel'
import { GuestsPanel } from './GuestsPanel'
import { useSelector } from "react-redux"
import { buildSearchParams, parseSearchParams, formatGuestsLabel, nightsBetween, formatMoney } from "../services/util.service.js"


export function StickyCard({ selectedDates }) {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { stayId } = useParams()

    const [isFilled, setIsFilled] = useState(false)
    const [formData, setFormData] = useState({
        checkin: '',
        checkout: '',
        guests: ''
    })

    const [activePanel, setActivePanel] = useState(null)
    const dateAnchorRef = useRef(null)
    const guestsAnchorRef = useRef(null)

    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    const stay = useSelector(selector => selector.stayModule.stay)
    const nightlyPrice = Number(stay?.price) || 0

    const nights = nightsBetween(formData.checkin, formData.checkout)
    const subtotal = nightlyPrice * nights

    useEffect(() => {
        const parsed = parseSearchParams(searchParams)
        const checkin = parsed.checkIn || ""
        const checkout = parsed.checkOut || ""

        setFormData(prev => ({ ...prev, checkin, checkout }))

        if (parsed.guests) {
            setGuests(parsed.guests)
            setFormData(prev => ({ ...prev, guests: formatGuestsLabel(parsed.guests) }))
        }

        if (checkin && checkout) setIsFilled(true)
    }, [searchParams])

    useEffect(() => {
        if (!selectedDates) return
        const { checkIn, checkOut } = selectedDates
        setFormData(prev => ({ ...prev, checkin: checkIn || prev.checkin, checkout: checkOut || prev.checkout }))
        if (checkIn && checkOut) setIsFilled(true)
    }, [selectedDates])

    useEffect(() => {
        setFormData(prev => ({ ...prev, guests: formatGuestsLabel(guests) }))
    }, [guests])

    const handleCheckAvailability = () => {
        if (!isFilled) {
            setIsFilled(true)
        } else {
            const params = buildSearchParams({
                checkIn: formData.checkin,
                checkOut: formData.checkout,
                guests   // { adults, children, infants, pets }
            })
            navigate(`/stay/${stayId}/order?${params.toString()}`)
        }
    }

    const getButtonText = () => {
        return isFilled ? 'Reserve' : 'Check availability'
    }

    const getFieldValue = (fieldName) => {
        if (!isFilled) {
            return fieldName === 'guests' ? 'Add guests' : 'Add date'
        }
        return formData[fieldName]
    }

    const closePanels = () => setActivePanel(null)

    return (
        <aside className="sticky-card">
            <div className="sticky-card-inner">
                <div className="sticky-card-header">
                    {nightlyPrice ? (
                        <>
                            <span style={{ color: "#6b6b6b", fontSize: "16px" }}>{formatMoney(nightlyPrice)} / night</span><br />
                            {nights > 0 && (
                                <>{formatMoney(subtotal)} for {nights} night{nights > 1 ? "s" : ""}</>
                            )}
                        </>
                    ) : (
                        "Add dates for prices"
                    )}
                </div>
                <div className="sticky-card-fields">
                    <div className="field" ref={dateAnchorRef}>
                        <label>Check-in</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('dates')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('checkin')}</div>
                    </div>
                    <div className="field">
                        <label>Check-out</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('dates')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('checkout')}</div>
                    </div>
                    <div className="field" ref={guestsAnchorRef}>
                        <label>Guests</label>
                        <div
                            className="input like-input"
                            onClick={() => setActivePanel('guests')}
                            role="button"
                            tabIndex={0}
                        >{getFieldValue('guests')}</div>
                    </div>
                </div>
                <button
                    className="sticky-card-btn"
                    type="button"
                    onClick={handleCheckAvailability}
                >
                    {getButtonText()}
                </button>

                {activePanel === 'dates' && (
                    <div className="popover-small right-aligned" onMouseLeave={closePanels}>
                        <DateRangePanel
                            value={{ checkIn: formData.checkin, checkOut: formData.checkout }}
                            onChange={(next) => {
                                setFormData(prev => ({ ...prev, checkin: next.checkIn, checkout: next.checkOut }))
                                if (next.checkIn && next.checkOut) setIsFilled(true)
                            }}
                            onComplete={closePanels}
                        />
                    </div>
                )}

                {activePanel === 'guests' && (
                    <div className="popover-small right-aligned" onMouseLeave={closePanels}>
                        <GuestsPanel
                            value={guests}
                            onChange={(partial) => {
                                // partial is {guests: next}
                                if (partial?.guests) setGuests(partial.guests)
                            }}
                            onComplete={closePanels}
                        />
                    </div>
                )}
            </div>
        </aside>
    )
}