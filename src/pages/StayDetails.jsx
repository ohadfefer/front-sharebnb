import { useEffect, useState, useRef } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addStayMsg, getCmdSetStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay/stay.service.local'
import { StayGallery } from '../cmps/StayGallery'
import { StayDescription } from '../cmps/StayDescription'
import { StayAmenities } from '../cmps/StayAmenities'
import { StayReviews } from '../cmps/StayReviews'
import { StayMap } from '../cmps/StayMap'
import { StickyCard } from '../cmps/StickyCard'
import { DateRangePanel } from '../cmps/DateRangePanel'

import star from '../assets/logo/icons/star.svg'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNav, setShowNav] = useState(false)
  const [showCardLink, setShowCardLink] = useState(false)
  const [dateRange, setDateRange] = useState({ checkIn: '', checkOut: '' })
  const galleryRef = useRef(null)
  const stickyRef = useRef(null)

  useEffect(() => {
    async function fetchStay() {
      setIsLoading(true)
      try {
        const stay = await stayService.getById(stayId)
        dispatch(getCmdSetStay(stay))
        setIsLoading(false)
      } catch (err) {
        setError('Failed to load stay details')
        setIsLoading(false)
        showErrorMsg('Cannot load stay details')
      }
    }
    fetchStay()
  }, [stayId, dispatch])

  useEffect(() => {
    function handleScroll() {
      if (galleryRef.current) {
        const rect = galleryRef.current.getBoundingClientRect()
        const shouldShow = rect.bottom <= 0
        setShowNav(shouldShow)
      }
      if (stickyRef.current) {
        const cr = stickyRef.current.getBoundingClientRect()
        const inView = cr.bottom > 0 && cr.top < window.innerHeight
        setShowCardLink(!inView)
      }
    }
    handleScroll()
    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('resize', handleScroll)
    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('resize', handleScroll)
    }
  }, [])

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }
  }

  function handleShare() {
    alert('share')
  }

  function handleSave() {
    setIsSaved(!isSaved)
    showSuccessMsg(isSaved ? 'Removed from saved' : 'Saved to favorites')
  }

  if (isLoading) return <div>Loading...</div>
  if (error) return <div>{error}</div>
  if (!stay) return <div>No stay found</div>

  const reviewsCount = stay.reviews?.length || 0
  const avgRate = reviewsCount ? (stay.reviews.reduce((acc, r) => acc + r.rate, 0) / reviewsCount) : 0

  return (
    <section className="stay-details">
      <nav className={`details-nav ${showNav ? 'shown' : ''}`}>
        <div className="details-nav-left">
          <a href="#photos"><span>Photos</span></a>
          <a href="#amenities"><span>Amenities</span></a>
          <a href="#reviews"><span>Reviews</span></a>
          <a href="#location"><span>Location</span></a>
        </div>
        {showCardLink && (
          <div className="details-nav-right">
            <div className="nav-right-text">
              <div className="title">Add dates for prices</div>
              <div className="sub">
                <img src={star} alt="" width={10} />
                <span className='reviews-avg'>{avgRate.toFixed(2)} · </span> 
                <span>{reviewsCount} reviews</span>
              </div>
            </div>
            <a href="#sticky-card" className="btn-link"><span>Check availability</span></a>
          </div>
        )}
      </nav>

      <div id="photos" ref={galleryRef}>
        <StayGallery stay={stay} onShare={handleShare} onSave={handleSave} isSaved={isSaved} />
      </div>

      <div className="stay-details-grid">
        <div className="left-col">
          <StayDescription stay={stay} />

          <div className='amenities-header' id="amenities">What this place offers</div>
          <StayAmenities stay={stay} />

          <hr className="divider" />

          <div className='date-picker-header'>
            <div>Select check-in date</div>
            <p>Add your travel dates for exact pricing</p>
          </div>
          <div className="date-picker-container">
            <DateRangePanel value={dateRange} onChange={setDateRange} />
          </div>

        </div>

        <div className="right-col" id="sticky-card" ref={stickyRef}>
          <StickyCard selectedDates={dateRange} />
        </div>
      </div>

      <hr className='divider-long' />

      <div id="reviews">
        <StayReviews stay={stay} />
      </div>

      <hr className='divider-long' />

      <div id="location">
        <StayMap stay={stay} />
      </div>



    </section>
  )
}