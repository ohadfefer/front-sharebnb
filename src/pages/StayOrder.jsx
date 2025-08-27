export function StayOrder() {
    return (
        <div className="main-order">
            <header>
                <h1>confirm</h1>
            </header>
            <div className="order-body">

                <div className="order-payment">
                    <div className="payment-method">

                        <div className="payment-details">
                            choose when to pay
                        </div>
                        <hr />
                        <label className="payment-option">
                            <input
                                type="radio"
                                name="payment"
                                value="205.33"
                                className="payment-radio"
                            />
                            <div className="payment-details">
                                Pay € 205.33 now
                            </div>
                            <hr />
                            <div className="payment-details">
                                Pay in 3 payments with Klarna
                                Split your purchase into 3 payments of € 68.44 (0% APR). More info
                            </div>
                        </label>
                    </div>
                    <div className="steps">
                        <div className="step">2. Add a payment method</div>
                        <div className="step">3. Review your request</div>
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