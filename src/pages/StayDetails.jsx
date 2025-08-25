import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { addStayMsg, getCmdSetStay } from '../store/actions/stay.actions'
import { stayService } from '../services/stay/stay.service.local'
import { StayGallery } from '../cmps/StayGallery'
import { StayDescription } from '../cmps/StayDescription'
import { StayAmenities } from '../cmps/StayAmenities'
export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)
  const dispatch = useDispatch()
  const [isSaved, setIsSaved] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(null)

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

  async function onAddStayMsg(stayId) {
    try {
      await addStayMsg(stayId, 'bla bla ' + parseInt(Math.random() * 10))
      showSuccessMsg(`Stay msg added`)
    } catch (err) {
      showErrorMsg('Cannot add stay msg')
    }
  }

  function handleShare() {
    alert('Share functionality to be implemented')
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
      <StayGallery stay={stay} onShare={handleShare} onSave={handleSave} isSaved={isSaved} />
      <StayDescription stay={stay} />

      <div className='amenities-header'>What this place offers</div>
      <StayAmenities stay={stay} />

    </section>
  )
}