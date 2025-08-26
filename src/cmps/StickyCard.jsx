import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams, useParams } from 'react-router-dom'

export function StickyCard() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { stayId } = useParams()
    const [isFilled, setIsFilled] = useState(false)
    const [formData, setFormData] = useState({
        checkin: '',
        checkout: '',
        guests: ''
    })

    useEffect(() => {
        const checkin = searchParams.get('checkin') || '9/20/2025'
        const checkout = searchParams.get('checkout') || '9/27/2025'
        const guests = searchParams.get('guests') || '2'
        
        setFormData({ checkin, checkout, guests })
    }, [searchParams])

    const handleCheckAvailability = () => {
        if (!isFilled) {
            setIsFilled(true)
        } else {
            const params = new URLSearchParams({
                checkin: formData.checkin,
                checkout: formData.checkout,
                guests: formData.guests
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

    return (
        <aside className="sticky-card">
            <div className="sticky-card-inner">
                <div className="sticky-card-header">Add dates for prices</div>
                <div className="sticky-card-fields">
                    <div className="field">
                        <label>Check-in</label>
                        <div className="input like-input">{getFieldValue('checkin')}</div>
                    </div>
                    <div className="field">
                        <label>Check-out</label>
                        <div className="input like-input">{getFieldValue('checkout')}</div>
                    </div>
                    <div className="field">
                        <label>Guests</label>
                        <div className="input like-input">{getFieldValue('guests')}</div>
                    </div>
                </div>
                <button 
                    className="sticky-card-btn" 
                    type="button"
                    onClick={handleCheckAvailability}
                >
                    {getButtonText()}
                </button>
            </div>
        </aside>
    )
}