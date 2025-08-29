import { useState, useEffect, useRef } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'
import { DateRangePanel } from './DateRangePanel'
import { GuestsPanel } from './GuestsPanel'

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

    const [activePanel, setActivePanel] = useState(null) // 'dates' | 'guests' | null
    const dateAnchorRef = useRef(null)
    const guestsAnchorRef = useRef(null)

    // Local guests state to populate label
    const [guests, setGuests] = useState({ adults: 0, children: 0, infants: 0, pets: 0 })

    // Initialize from URL defaults once
    useEffect(() => {
        const checkin = searchParams.get('checkin') || '9/20/2025'
        const checkout = searchParams.get('checkout') || '9/27/2025'
        const guestsParam = searchParams.get('guests') || '2'
        setFormData(prev => ({ ...prev, checkin, checkout, guests: guestsParam }))
    }, [searchParams])

    // Update from selectedDates coming from parent (left panel)
    useEffect(() => {
        if (!selectedDates) return
        const { checkIn, checkOut } = selectedDates
        setFormData(prev => ({ ...prev, checkin: checkIn || prev.checkin, checkout: checkOut || prev.checkout }))
        if (checkIn && checkOut) setIsFilled(true)
    }, [selectedDates])

    // Reflect local guests into a display string
    useEffect(() => {
        const total = (guests.adults || 0) + (guests.children || 0)
        const label = total > 0 ? `${total} guest${total > 1 ? 's' : ''}` : 'Add guests'
        setFormData(prev => ({ ...prev, guests: label }))
    }, [guests])

    const handleCheckAvailability = () => {
        if (!isFilled) {
            setIsFilled(true)
        } else {
            const params = new URLSearchParams({
                checkin: formData.checkin,
                checkout: formData.checkout,
                guests: String((guests.adults || 0) + (guests.children || 0) || formData.guests)
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
                <div className="sticky-card-header">Add dates for prices</div>
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