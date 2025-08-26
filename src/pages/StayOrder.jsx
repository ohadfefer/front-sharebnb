


export function StayOrder() {


    const handleMouseMove = (e) => {
        const button = e.currentTarget
        if (!button) return 

        const rect = button.getBoundingClientRect()
        console.log('rect:', rect)

        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100

        console.log('mouse % coords:', { x, y })

        button.style.setProperty('--mouse-x', `${x}%`)
        button.style.setProperty('--mouse-y', `${y}%`)
    }

    return (
        <div className="main-order">
            <header>
                <h1>Request to book</h1>
            </header>
            <div className="order-body">

                <div className="order-payment">
                    <div className="payment-method">

                        <div className="payment-details">
                            <h2>
                                1.Choose when to pay
                            </h2>
                        </div>

                        <label className="payment-option">
                            <h1 >
                                Pay € 205.33 now
                            </h1>
                            <input
                                type="radio"
                                name="payment"
                                value="pay-now"
                                className="payment-radio"
                            />
                        </label>

                        <hr />

                        <label className="payment-option">
                            <div >
                                <h1>
                                    Pay in 3 payments with Klarna
                                </h1>
                                <br />
                                <p>
                                    Split your purchase into 3 payments of € 68.44 (0% APR). More info
                                </p>
                            </div>
                            <input
                                type="radio"
                                name="payment"
                                value="klarna"
                                className="payment-radio"
                            />
                        </label>
                        <hr />
                        <div className="payment-btn">
                            <button ><span>Next</span></button>
                        </div>
                    </div>
                    <hr />
                    <div className="confirm">
                        <button onMouseMove={handleMouseMove} className="action-btn">
                            <p>
                            Confirm and pay
                            </p>
                            </button>
                    </div>
                </div>
                <div className="order-details">
                    <div className="preview-order">
                        <p>
                            photo / stay details
                        </p>
                    </div>
                    <div className="free-cancelation">
                        <p>
                            free cancelation
                        </p>
                    </div>
                    <div className="date-guests">
                        <p>
                            date & guests
                        </p>
                    </div>
                    <div className="price-details">
                        <p>
                            price details
                        </p>
                    </div>
                    <div className="total-price">
                        <p>
                            total price
                        </p>
                    </div>
                    <div>lower price</div>
                </div>
            </div>


        </div>
    )
}