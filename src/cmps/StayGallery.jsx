import heart from '../assets/logo/icons/heart.svg'

export function StayGallery({ stay, onShare, onSave, isSaved }) {
  
  return (
    <section className="stay-gallery">
      <div className="stay-gallery-container">
        <div className="stay-header">
          <h1>Welcome to {stay.name}</h1>
          <div className="stay-actions">
            <button className="share-btn" onClick={onShare}>
              Share
            </button>
            <button className="save-btn" onClick={onSave}>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
        <div className="gallery-grid">
          {stay.imgUrls && stay.imgUrls.length > 0 ? (
            <>
              <img
                src={stay.imgUrls[0]}
                alt="Main stay"
                className="main-img"
              />
              {stay.imgUrls.slice(1, 5).map((imgUrl, idx) => (
                <img
                  key={idx}
                  src={imgUrl}
                  alt={`Stay ${idx + 1}`}
                  className={`side-img side-img-${idx}`}
                />
              ))}
            </>
          ) : (
            <p>No images available</p>
          )}
        </div>
      </div>
    </section>
  )
}