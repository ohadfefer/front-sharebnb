import door from '../assets/logo/icons/door.svg'
import pin from '../assets/logo/icons/pin.svg'
import parking from '../assets/logo/icons/parking.svg'
import star from '../assets/logo/icons/star.svg'


export function StayDescription({ stay }) {

    const avgRate = stay.reviews.reduce((acc, r) => acc + r.rate, 0) / stay.reviews.length
    return (
        <div className="stay-description">
            <div className="stay-info">
                <div className='header'>{stay.type} hosted by {stay.host.fullname}</div>
                <p className="capacity">{stay.capacity} guests · 2 bedrooms · 2 beds · 2 baths</p>
                <div className="reviews-modal">
                    <img src={star} alt="" width={8}/> <span>{(avgRate || 'No').toFixed(2)} · {stay.reviews.length} reviews</span>
                </div>
            </div>
            <hr className="divider" />
            <div className="stay-info-grid host-grid">
                <div className="column-1">
                    <img src={stay.host.imgUrl} alt={stay.host.fullname} className="host-image" />
                </div>
                <div className="column-2">
                    <p>Hosted by {stay.host.fullname}</p>
                </div>
            </div>
            <hr className="divider" />
            <div className="stay-info-grid features-grid">
                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={door} alt="" width={24}/></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Self check-in</p>
                            <p>Check yourself in with the lockbox.</p>
                        </div>
                    </div>
                </div>
                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={pin} alt="" width={24}/></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Beautiful and walkable</p>
                            <p>Guests say this area is scenic and it's easy to get around.</p>
                        </div>
                    </div>
                </div>
                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={parking} alt="" width={24}/></span>
                    </div>
                    <div className="column-2">
                        <div className="info-item">
                            <p>Park for free</p>
                            <p>This is one of the few places in the area with free parking.</p>
                        </div>
                    </div>
                </div>
            </div>
            <hr className="divider" />

        </div>
    )
}