import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { orderService } from '../services/order/index.js'
import viza from '../assets/logo/vize-card.png'
import arrow from '../assets/logo/arrow.png'
import { Link } from 'react-router-dom'

export function StayOrder() {

    const { stayId } = useParams()
    const [order, setOrder] = useState(null)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stay, setStay] = useState(null)


    useEffect(() => {
        if (stayId) {
            loadStay()
        }
    }, [stayId])

    useEffect(() => {
        if (stay && !order) {
            createOrderFromService()
        }
    }, [stay, order])

    useEffect(() => {
        console.log('Order state updated:', order)
    }, [order])


    async function loadStay() {
        try {
            setIsLoading(true)
            setError(null)
            if (!stayId) {
                setError('No stay ID provided')
                return
            }
            const stayData = await orderService.getStayById(stayId)
            if (!stayData) {
                setError('Stay not found')
                return
            }
            setStay(stayData)
            if (order) {
                updateOrderWithStayData(stayData)
            }
        } catch (err) {
            setError('Failed to load stay details')
            console.error('Error loading stay:', err)
        } finally {
            setIsLoading(false)
        }
    }

    async function updateOrderWithStayData(stayData) {
        if (!order) return

        try {
            const updatedOrder = {
                ...order,
                hostId: stayData.host?._id || order.hostId,
                totalPrice: stayData.price || order.totalPrice,
                order: {
                    ...order.order,
                    name: stayData.name,
                    price: stayData.price,
                }
            }

            const savedOrder = await orderService.save(updatedOrder)
            setOrder(savedOrder)
        } catch (err) {
            console.error('Error updating order with stay data:', err)
        }
    }

    async function createOrderFromService() {
        try {
            console.log('Creating new order for stay:', stayId)
            const savedOrder = await orderService.createOrder(stayId, stay)
            console.log('Order created:', savedOrder)
            setOrder(savedOrder)
        } catch (err) {
            setError('Failed to create order')
            console.error('Error creating order:', err)
        }
    }

    const handleMouseMove = (e) => {
        const button = e.currentTarget
        if (!button) return
        const rect = button.getBoundingClientRect()
        const x = ((e.clientX - rect.left) / rect.width) * 100
        const y = ((e.clientY - rect.top) / rect.height) * 100


        button.style.setProperty('--mouse-x', `${x}%`)
        button.style.setProperty('--mouse-y', `${y}%`)
    }

    function handleSave() {
        setIsSaved(!isSaved)
        showSuccessMsg(isSaved ? 'Removed from saved' : 'Saved to favorites')
    }



    return (
        <div className="main-order">
            <Link to={`/stay/${stayId} `}> <button className='arrow-btn'><img src={arrow} alt="" /></button></Link>
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
                                Pay $ 120 now
                            </h1>
                            <input
                                type="radio"
                                name="payment"
                                value="pay-now"
                                className="payment-radio"
                            />
                        </label>

                        <label className="payment-option">
                            <div >
                                <h1>
                                    Pay in 3 payments with Klarna
                                </h1>
                                <br />
                                <p>
                                    Split your purchase into 3 payments of $ 40.00 (0% APR). More info
                                </p>
                            </div>
                            <input
                                type="radio"
                                name="payment"
                                value="klarna"
                                className="payment-radio"
                            />
                        </label>

                    </div>

                    <div className="payment-card">
                        <p>Payment method</p>
                        <div className="payment-row">
                            <img src={viza} alt="Visa" />
                            <span>3867</span>
                        </div>
                    </div>

                    <hr />

                    <div className="confirm">
                        <button onClick={handleSave} onMouseMove={handleMouseMove} className="action-btn">
                            <p>
                                Confirm and pay
                            </p>
                        </button>
                    </div>
                </div>
                <div className="order-details">
                    <div className="preview-order">
                        {isLoading ? (
                            <p>Loading stay details...</p>
                        ) : error ? (
                            <p>{error}</p>
                        ) : stay ? (
                            <div>
                                <div className='order-title'>
                                    {stay.imgUrls && stay.imgUrls.length > 0 ? (
                                        <img
                                            src={stay.imgUrls[0]}
                                            alt={stay.name}
                                        />
                                    ) : (
                                        <div className="no-image-placeholder">
                                            <p>No image available</p>
                                        </div>
                                    )}
                                    <div className='title-txt'>
                                        <h3>{stay.name}</h3>
                                        <p>{stay.type}</p>
                                        <span><i className="fa-solid fa-star"></i>4.95 (199)</span>
                                    </div>

                                </div>
                                <div className="free-cancelation">
                                    <p className='item1'>
                                        Free cancelation
                                    </p>
                                    <p>
                                        Cancel before 11 Sept for a full refund.
                                    </p>
                                </div>

                                <hr />

                                <div className='date-guests'>
                                    <p className='date'>
                                        Dates & guests
                                    </p>
                                    <div className='guests'>
                                        <span>12-17 Sept 2025</span>
                                        <span>1 adult</span>

                                    </div>
                                </div>

                                <hr />

                                <div className='price'>
                                    <p>
                                        Price details
                                    </p>
                                    <span>
                                        5 nights for {stay.price}$
                                    </span>
                                </div>

                                <hr />
                                <div className='total-details'>
                                    <div className='total'>
                                        <p>Total</p>
                                        <p>{stay.price}$</p>
                                    </div>
                                    <p className='item'>Price breakdown</p>
                                </div>


                            </div>
                        ) : (
                            <p>Stay not found</p>
                        )}
                    </div>

                </div>
            </div>


        </div>
    )
}