import { httpService } from '../http.service'

export const orderService = {
    query,
    getById,
    save,
    getStayById,
    createOrder
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

async function getStayById(stayId) {
    // Import stay service dynamically to avoid circular dependency
    const { stayService } = await import('../stay')
    return await stayService.getById(stayId)
}

async function createOrder(stayId, stayData) {
    try {
        const newOrder = {
            hostId: stayData?.host?._id || 'u102',
            guest: {
                _id: 'u101',
                fullname: 'User 1',
            },
            totalPrice: stayData?.price || 205.33,
            startDate: '2025/10/15',
            endDate: '2025/10/17',
            guests: {
                adults: 1,
                kids: 0,
            },
            order: {
                _id: stayId,
                name: stayData?.name || 'Stay Name',
                price: stayData?.price || 0,
            },
            msgs: [],
            status: 'pending',
            createdAt: Date.now()
        }
        
        const savedOrder = await save(newOrder)
        return savedOrder
    } catch (err) {
        console.error('Error creating order:', err)
        throw err
    }
}

