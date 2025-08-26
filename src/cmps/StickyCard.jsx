
export function StickyCard() {
    return (
        <aside className="sticky-card">
            <div className="sticky-card-inner">
                <div className="sticky-card-header">Add dates for prices</div>
                <div className="sticky-card-fields">
                    <div className="field">
                        <label>Check-in</label>
                        <div className="input like-input">Add date</div>
                    </div>
                    <div className="field">
                        <label>Check-out</label>
                        <div className="input like-input">Add date</div>
                    </div>
                    <div className="field">
                        <label>Guests</label>
                        <div className="input like-input">1 guest</div>
                    </div>
                </div>
                <button className="sticky-card-btn" type="button">Check availability</button>
            </div>
        </aside>
    )
}