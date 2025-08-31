// src/services/order/order.service.local.js
import { storageService } from '../async-storage.service'
import { stayService } from '../stay/stay.service.local.js'

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
    
    const orderToSave = {
        _id: order._id || makeId(),
        hostId: order.hostId,
        guest: order.guest,
        totalPrice: order.totalPrice,
        startDate: order.startDate,
        endDate: order.endDate,
        guests: order.guests,
        order: order.order,
        msgs: order.msgs || [],
        status: order.status || 'pending'
    }

    const savedOrder = await storageService.post(ORDER_KEY, orderToSave)
    console.log('from service',order);
    
    return savedOrder
}

async function getStayById(stayId) {
    return stayService.getById(stayId)
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
        }
        
        const savedOrder = await save(newOrder)
        return savedOrder
    } catch (err) {
        console.error('Failed to seed demo orders:', err)
    }
}
