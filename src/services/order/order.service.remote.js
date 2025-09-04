// services/order/order.service.remote.js
import { httpService } from '../http.service'
import { userService } from '../user'

export const orderService = {
    query,
    getById,
    save,
    remove,
    getStayById,
    createOrder,
    updateStatus
}

function cleanFilter(params = {}) { // NEW
    const p = { ...params }
    const isHex24 = (s) => typeof s === 'string' && /^[a-fA-F0-9]{24}$/.test(s)
    if (p.userId && !isHex24(p.userId)) delete p.userId
    if (p.hostId && !isHex24(p.hostId)) delete p.hostId
    if (!p.status) delete p.status
    return p
}

async function query(filterBy = {}) {
    const params = Object.fromEntries(
        Object.entries(filterBy).filter(([_, v]) => v) // drop falsy values
    )
    return httpService.get('order', params)
}

function getById(orderId) {
    return httpService.get(`order/${orderId}`)
}

async function save(order) {
    if (order._id) return httpService.put(`order/${order._id}`, order)
    return httpService.post('order', order)
}

async function remove(orderId) {
    return await httpService.delete(`order/${orderId}`)
}

async function updateStatus(orderId, status) {
    const order = await getById(orderId)
    return await save({ ...order, status })
}

async function getStayById(stayId) {
    const { stayService } = await import('../stay')
    return stayService.getById(stayId)
}

async function createOrder(stayId, stayData, overrides = {}) {
    const { userService } = await import('../user')
    const loggedInUser = userService.getLoggedinUser()

    const userId = loggedInUser?._id || 'guest-user-id'
    let hostId = stayData?.host?._id || stayData?.hostId || stayData?.owner?._id || stayData?.ownerId || loggedInUser?._id || 'u102'

    const newOrder = {
        userId,
        stayId,
        hostId,
        totalPrice: overrides.totalPrice || stayData?.price || 0,
        startDate: overrides.startDate || new Date().toISOString(),
        endDate: overrides.endDate || new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
        guests: overrides.guests || { adults: 1, children: 0, infants: 0, pets: 0 },
        status: overrides.status || 'pending',
        createdAt: new Date().toISOString(),
        contactEmail: overrides.contactEmail || loggedInUser?.email || null, // EDIT
    }

    return save(newOrder)
}
