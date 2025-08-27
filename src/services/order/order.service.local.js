import { storageService } from '../async-storage.service'
import { stayService } from '../stay/stay.service.local'

import { makeId } from '../util.service'

const ORDER_KEY = 'order'
// createOrders()

export const orderService = {
    getById,
    save,
    getStayById,
    createOrder
}

window.cs = orderService

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
    return await stayService.getById(stayId)
}

function createOrders() {
    let orders = JSON.parse(localStorage.getItem(ORDER_KEY))
    if (!orders || !orders.length) {
        const orders = [
            {
                _id: 'o1225',
                hostId: { _id: 'u102', fullname: "bob", imgUrl: "..." },
                guest: {
                    _id: 'u101',
                    fullname: 'User 1',
                },
                totalPrice: 160,
                startDate: '2025/10/15',
                endDate: '2025/10/17',
                guests: {
                    adults: 1,
                    kids: 2,
                },
                order: {
                    _id: 'h102',
                    name: 'House Of Uncle My',
                    price: 80.0,
                },
                msgs: [],
                status: 'pending',
            }
        ]
        localStorage.setItem(ORDER_KEY, JSON.stringify(orders))
    }
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
        console.error('Error creating order:', err)
        throw err
    }
}