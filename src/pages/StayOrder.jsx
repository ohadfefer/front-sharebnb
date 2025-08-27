import { useParams } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useState } from 'react'
import { showSuccessMsg } from '../services/event-bus.service.js'
import { orderService  } from '../services/order/order.service.local.js'

export function StayOrder() {

    const { stayId } = useParams()
    const [order, setOrder] = useState(null)
    const [isSaved, setIsSaved] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState(null)
    const [stay, setStay] = useState(null)

    // Debug logs to see what we're getting
    console.log('URL Params - stayId:', stayId)

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
            // Update order with stay data if order already exists
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
                                <h3>{stay.name}</h3>
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
                                <p><strong>Type:</strong> {stay.type}</p>
                                <p><strong>Price:</strong> €{stay.price}</p>
                                {stay.capacity && <p><strong>Capacity:</strong> {stay.capacity} guests</p>}
                                {stay.loc && <p><strong>Location:</strong> {stay.loc.city}, {stay.loc.country}</p>}
                                
                                {/* Debug: Show order info */}
                                {order && (
                                    <div style={{ marginTop: '1rem', padding: '0.5rem', backgroundColor: '#f0f0f0', borderRadius: '4px' }}>
                                        <p><strong>Order ID:</strong> {order._id}</p>
                                        <p><strong>Order Status:</strong> {order.status}</p>
                                        <p><strong>Total Price:</strong> €{order.totalPrice}</p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <p>Stay not found</p>
                        )}
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