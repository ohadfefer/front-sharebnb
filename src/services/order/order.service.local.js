// src/services/order/order.service.local.js
import { storageService } from '../async-storage.service'
import { stayService } from '../stay/stay.service.local'
import { makeId } from '../util.service'

const ORDER_KEY = 'order'

// seed once
seedDemoOrders()

export const orderService = {
    query,
    getById,
    save,
    remove,
    addOrderMsg,
    updateStatus,
    getDefaultFilter,
    getEmptyOrder,
    getStayById,
    createOrder,
}

async function query(filterBy = getDefaultFilter()) {
    // (filters can be added later)
    return storageService.query(ORDER_KEY)
}

function getById(orderId) {
    return storageService.get(ORDER_KEY, orderId)
}

async function save(order) {
    const normalized = normalizeOrder(order)
    if (normalized._id) {
        return storageService.put(ORDER_KEY, normalized)
    } else {
        normalized._id = makeId()
        return storageService.post(ORDER_KEY, normalized)
    }
}

async function remove(orderId) {
    return storageService.remove(ORDER_KEY, orderId)
}

async function addOrderMsg(orderId, text) {
    const curr = await getById(orderId)
    if (!curr) return null
    const msg = { id: makeId(), txt: text, at: Date.now() }
    curr.msgs = Array.isArray(curr.msgs) ? [...curr.msgs, msg] : [msg]
    await storageService.put(ORDER_KEY, curr)
    return msg
}

async function updateStatus(orderId, nextStatus) {
    const curr = await getById(orderId)
    if (!curr) return null
    const updated = { ...curr, status: nextStatus }
    await storageService.put(ORDER_KEY, updated)
    return updated
}

function getDefaultFilter() {
    return {}
}

function getEmptyOrder() {
    return {
        _id: '',
        hostId: { _id: '', fullname: '', imgUrl: '' },
        guest: { _id: '', fullname: '' },
        totalPrice: 0,
        startDate: '',
        endDate: '',
        guests: { adults: 1, kids: 0, infants: 0, pets: 0 },
        stay: { _id: '', name: '', price: 0 },
        msgs: [],
        status: 'pending',
        bookedAt: new Date().toISOString().slice(0, 10),
    }
}

function normalizeOrder(order) {
    const base = getEmptyOrder()
    const listing = order.stay || order.order || base.stay
    return {
        ...base,
        ...order,
        stay: {
            _id: listing?._id ?? base.stay._id,
            name: listing?.name ?? base.stay.name,
            price: +listing?.price || 0,
        },
        msgs: Array.isArray(order.msgs) ? order.msgs : [],
        status: order.status || 'pending',
    }
}

async function getStayById(stayId) {
    return stayService.getById(stayId)
}

async function createOrder(stayId, stayData, overrides = {}) {
    const draft = {
        hostId: stayData?.host?._id
            ? { _id: stayData.host._id, fullname: stayData.host.fullname || 'Host' }
            : { _id: 'u102', fullname: 'bob' },
        guest: { _id: 'u101', fullname: 'User 1' },
        totalPrice: stayData?.price || 205.33,
        startDate: '2025/10/15',
        endDate: '2025/10/17',
        guests: { adults: 1, kids: 0 },
        stay: { _id: stayId, name: stayData?.name || 'Stay Name', price: stayData?.price || 0 },
        msgs: [],
        status: 'pending',
    }
    const merged = {
        ...draft,
        ...overrides,
        stay: { ...draft.stay, ...(overrides.stay || {}) },
    }
    // If dates were provided, recompute total if caller didn't set it explicitly
    if (!('totalPrice' in overrides) && merged.stay?.price && merged.startDate && merged.endDate) {
        const nights = Math.max(1, Math.round(
            (new Date(merged.endDate) - new Date(merged.startDate)) / (1000 * 60 * 60 * 24)
        ))
        merged.totalPrice = merged.stay.price * nights
    }
    return save(merged)
}

function seedDemoOrders() {
    try {
        const raw = localStorage.getItem(ORDER_KEY)
        const existing = raw ? JSON.parse(raw) : null
        if (existing && Array.isArray(existing) && existing.length) return

        const demo = [
            {
                _id: 'o1001',
                hostId: { _id: 'u103', fullname: 'Maria Gomez', imgUrl: '' },
                guest: { _id: 'u201', fullname: 'Alex Cohen' },
                totalPrice: 750,
                startDate: '2025/09/13',
                endDate: '2025/09/16',
                guests: { adults: 2, kids: 1, infants: 0, pets: 0 },
                stay: { _id: 's102', name: 'Sea Breeze Villa', price: 250 },
                msgs: [],
                status: 'completed',
                bookedAt: '2025-08-01',
            },
            {
                _id: 'o1002',
                hostId: { _id: 'u105', fullname: 'Lars Eriksson', imgUrl: '' },
                guest: { _id: 'u202', fullname: 'Dana Levi' },
                totalPrice: 240,
                startDate: '2025/02/01',
                endDate: '2025/02/03',
                guests: { adults: 2, kids: 0, infants: 0, pets: 0 },
                stay: { _id: 's103', name: 'Mountain Escape Cabin', price: 120 },
                msgs: [],
                status: 'completed',
                bookedAt: '2025-01-09',
            },
            {
                _id: 'o1003',
                hostId: { _id: 'u107', fullname: 'Akira Tanaka', imgUrl: '' },
                guest: { _id: 'u203', fullname: 'Noa Amit' },
                totalPrice: 450,
                startDate: '2025/03/10',
                endDate: '2025/03/13',
                guests: { adults: 1, kids: 1, infants: 0, pets: 0 },
                stay: { _id: 's104', name: 'City Center Loft', price: 150 },
                msgs: [],
                status: 'completed',
                bookedAt: '2025-02-15',
            },
            {
                _id: 'o1004',
                hostId: { _id: 'u109', fullname: 'Sophie Laurent', imgUrl: '' },
                guest: { _id: 'u204', fullname: 'John Smith' },
                totalPrice: 270,
                startDate: '2025/06/22',
                endDate: '2025/06/25',
                guests: { adults: 2, kids: 1, infants: 0, pets: 0 },
                stay: { _id: 's105', name: 'Countryside B&B', price: 90 },
                msgs: [],
                status: 'completed',
                bookedAt: '2025-06-11',
            },
            {
                _id: 'o1005',
                hostId: { _id: 'u111', fullname: 'Mohammed Ali', imgUrl: '' },
                guest: { _id: 'u205', fullname: 'Ella Green' },
                totalPrice: 540,
                startDate: '2025/11/05',
                endDate: '2025/11/08',
                guests: { adults: 2, kids: 0, infants: 0, pets: 0 },
                stay: { _id: 's106', name: 'Desert Dome Stay', price: 180 },
                msgs: [],
                status: 'pending',
                bookedAt: '2025-10-20',
            },
        ]
        localStorage.setItem(ORDER_KEY, JSON.stringify(demo))
    } catch (err) {
        console.error('Failed to seed demo orders:', err)
    }
}
