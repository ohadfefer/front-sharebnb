// import { cleanliness } from '../assets/logo/icons/cleanliness.svg'
// import { accuracy } from '../assets/logo/icons/accuracy.svg'
// import { key } from '../assets/logo/icons/key.svg'
// import { chat } from '../assets/logo/icons/chat.svg'
// import { map } from '../assets/logo/icons/map.svg'
// import { value } from '../assets/logo/icons/value.svg'
import star from '../assets/logo/icons/star.svg'

import { FaStar } from 'react-icons/fa'

export function StayReviews({ stay }) {
    if (!stay || !stay.reviews || stay.reviews.length === 0) {
        return (
            <div className="stay-reviews">
                <h2>Reviews</h2>
                <p>No reviews yet</p>
            </div>
        )
    }

    const renderStars = (rating) => {
        return Array.from({ length: 5 }, (_, index) => (
            <FaStar
                key={index}
                className={`star ${index < rating ? 'filled' : 'empty'}`}
            />
        ))
    }

    const avgRate = stay.reviews.reduce((acc, r) => acc + r.rate, 0) / stay.reviews.length
    return (
        <>
            <div className="rates-info">
                <div className="rates-header">
                    <img src={star} alt="" width={8} /> {(avgRate || 'No').toFixed(1)} · {stay.reviews.length} reviews
                </div>
                <div className="rates-details">

                </div>
            </div>
            <div className="stay-reviews">
                <div className="reviews-grid">
                    {stay.reviews.map((review) => (
                        <div key={review.id} className="review-card">
                            <div className="review-header">
                                <div className="user-info">
                                    <img
                                        src={review.by.imgUrl}
                                        alt={review.by.fullname}
                                        className="user-avatar"
                                        onError={(e) => {
                                            e.target.src = '/img/default-avatar.jpg'
                                        }}
                                    />
                                    <div className="user-details">
                                        <h4 className="user-name">{review.by.fullname}</h4>
                                        <p className="user-location">
                                            {stay.loc.city}, {stay.loc.country}
                                        </p>
                                        <div className="rating">
                                            {renderStars(review.rate)}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            <div className="review-content">
                                <p className="review-text">{review.txt}</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}