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

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)
  const [showNav, setShowNav] = useState(false)
  const galleryRef = useRef(null)

  useEffect(() => {
    async function fetchStay() {
      setIsLoading(true)
      try {
        const stay = await stayService.getById(stayId)
        console.log('Fetched stay:', stay) // Debug
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
      if (!galleryRef.current) return
      const rect = galleryRef.current.getBoundingClientRect()
      // show header when the gallery bottom is above the top of the viewport
      const shouldShow = rect.bottom <= 0
      setShowNav(shouldShow)
    }
    // run once to set initial state
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

  return (
    <section className="stay-details">
      {/* sticky in-page navigation header */}
      <nav className={`details-nav ${showNav ? 'shown' : ''}`}>
        <a href="#photos">Photos</a>
        <a href="#amenities">Amenities</a>
        <a href="#reviews">Reviews</a>
        <a href="#location">Location</a>
      </nav>

      <div id="photos" ref={galleryRef}>
        <StayGallery stay={stay} onShare={handleShare} onSave={handleSave} isSaved={isSaved} />
      </div>

      <div className="stay-details-grid">
        <div className="left-col">
          <StayDescription stay={stay} />

          <div className='amenities-header' id="amenities">What this place offers</div>
          <StayAmenities stay={stay} />

          <div className='date-picker-header'>Select check-in date</div>
          <div className="date-picker-container">
            <DateRangePanel />
          </div>
          
        </div>

        <div className="right-col">
          <StickyCard />
        </div>
      </div>

      <hr className='divider-long' />

      <div id="reviews">
        <StayReviews stay={stay} />
      </div>

      <hr className='divider-long' />

      <div id="location">
        <StayMap stay={stay}/>
      </div>


    </section>
  )
}