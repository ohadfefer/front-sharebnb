import { httpService } from '../http.service'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
    createOrder,
    updateStatus
}

function query(params) {
  return httpService.get('order', params)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function save(order) {
    var savedOrder
    if (order._id) {
        savedOrder = await httpService.put(`order/${order._id}`, order)
    } else {
        savedOrder = await httpService.post('order', order)
    }
    return savedOrder
}

async function remove(orderId) {
    return await httpService.delete(`order/${orderId}`)
}

async function updateStatus(orderId, status) {
    try {
        const order = await getById(orderId)
        const updatedOrder = { ...order, status }
        return await save(updatedOrder)
    } catch (err) {
        console.error('Error updating order status:', err)
        throw err
    }
}

async function getStayById(stayId) {
    // Import stay service dynamically to avoid circular dependency
    const { stayService } = await import('../stay')
    return await stayService.getById(stayId)
}

async function createOrder(stayId, stayData, overrides = {}) {
    try {
        // Get current user
        const { userService } = await import('../user')
        const loggedInUser = userService.getLoggedinUser()
        
        if (!loggedInUser) {
            throw new Error('User not logged in')
        }

        const newOrder = {
            userId: loggedInUser._id,
            stayId: stayId,
            hostId: stayData?.host?._id || stayData?.hostId || 'u102',
            totalPrice: overrides.totalPrice || stayData?.price || 205.33,
            startDate: overrides.startDate || new Date().toISOString(),
            endDate: overrides.endDate || new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            guests: overrides.guests || {
                adults: 1,
                children: 0,
                infants: 0,
                pets: 0
            },
            status: overrides.status || 'pending',
            createdAt: new Date().toISOString()
        }
        
        const savedOrder = await save(newOrder)
        return savedOrder
    } catch (err) {
        console.error('Error creating order:', err)
        throw err
    }
}

