import door from '../assets/logo/icons/door.svg'
import pin from '../assets/logo/icons/pin.svg'
import parking from '../assets/logo/icons/parking.svg'
import star from '../assets/logo/icons/star.svg'

export function StayDescription({ stay }) {
    // guard input
    const reviews = Array.isArray(stay?.reviews) ? stay.reviews : []

    // numeric ratings only
    const ratings = reviews
        .map(r => Number(r?.rate))
        .filter(n => Number.isFinite(n))

    const avgRate = ratings.length
        ? ratings.reduce((a, b) => a + b, 0) / ratings.length
        : null

    const ratingText = Number.isFinite(avgRate) ? avgRate.toFixed(2) : 'No ratings yet'
    const reviewsCount = reviews.length

    const capacity = Number.isFinite(+stay?.capacity) ? +stay.capacity : null
    const bedrooms = Number.isFinite(+stay?.bedrooms) ? +stay.bedrooms : null
    const beds = Number.isFinite(+stay?.beds) ? +stay.beds : null
    const baths = Number.isFinite(+stay?.bathrooms) ? +stay.bathrooms : null

    return (
        <div className="stay-description">
            <div className="stay-info">
                <div className='header'>
                    {stay?.type || 'Stay'} hosted by {stay?.host?.fullname || 'Host'}
                </div>

                <p className="capacity">
                    {capacity ?? '—'} guests · {bedrooms ?? '—'} bedrooms · {beds ?? '—'} beds · {baths ?? '—'} baths
                </p>

                <div className="reviews-modal">
                    <img src={star} alt="" width={8} />
                    <span>
                        {Number.isFinite(avgRate)
                            ? `${ratingText} · ${reviewsCount} review${reviewsCount === 1 ? '' : 's'}`
                            : 'No ratings yet'}
                    </span>
                </div>
            </div>

            <hr className="divider" />

            <div className="stay-info-grid host-grid">
                <div className="column-1">
                    {stay?.host?.imgUrl && (
                        <img
                            src={stay.host.imgUrl}
                            alt={stay?.host?.fullname || 'Host'}
                            className="host-image"
                        />
                    )}
                </div>
                <div className="column-2">
                    <p>Hosted by {stay?.host?.fullname || '—'}</p>
                </div>
            </div>

            <hr className="divider" />

            <div className="stay-info-grid features-grid">
                <div className="grid-row">
                    <div className="column-1">
                        <span className="icon"><img src={door} alt="" width={24} /></span>
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
                        <span className="icon"><img src={pin} alt="" width={24} /></span>
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
                        <span className="icon"><img src={parking} alt="" width={24} /></span>
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
