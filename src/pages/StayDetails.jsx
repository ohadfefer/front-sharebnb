import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service'
import { loadStays, addStayMsg } from '../store/actions/stay.actions'

export function StayDetails() {
  const { stayId } = useParams()
  const stay = useSelector((storeState) => storeState.stayModule.stay)
  const [isSaved, setIsSaved] = useState(false)

  useEffect(() => {
    loadStays(stayId)
  }, [stayId])

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

  return (
    <section className="stay-details">
      {/* <Link to="/stay" className="back-link">Back to list</Link> */}
      {stay && (
        <div className="stay-details-container">
          <div className="stay-header">
            <h1>Welcome to {stay.name}</h1>
            <div className="stay-actions">
              <button className="share-btn" onClick={handleShare}>
                Share
              </button>
              <button className="save-btn" onClick={handleSave}>
                {isSaved ? 'Saved' : 'Save'}
              </button>
            </div>
          </div>
          <div className="stay-gallery">
            {stay.imgUrls && stay.imgUrls.length > 0 ? (
              <div className="gallery-grid">
                <img src={stay.imgUrls[0]} alt="Main stay" className="main-img" />
                {stay.imgUrls.slice(1, 5).map((imgUrl, idx) => (
                  <img key={idx} src={imgUrl} alt={`Stay ${idx + 1}`} className="side-img" />
                ))}
              </div>
            ) : (
              <p>No images available</p>
            )}
          </div>
          <button onClick={() => onAddStayMsg(stay._id)}>Add stay msg</button>
          <pre>{JSON.stringify(stay, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}