import { orderService } from '../../services/order/index.js'

export const SET_ORDERS = 'SET_ORDERS'
export const SET_ORDER = 'SET_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const ADD_ORDER = 'ADD_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const ADD_ORDER_MSG = 'ADD_ORDER_MSG'

export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    orders: [],
    order: null,
    filterBy: orderService.getDefaultFilter(),
    isLoading: false,
}

export function orderReducer(state = initialState, action) {
    switch (action.type) {
        case SET_ORDERS:
            return { ...state, orders: action.orders }

        case SET_ORDER:
            return { ...state, order: action.order }

        case REMOVE_ORDER: {
            const lastRemovedOrder =
                state.orders.find(o => o._id === action.orderId) || null
            const nextOrders = state.orders.filter(o => o._id !== action.orderId)
            return { ...state, orders: nextOrders, lastRemovedOrder }
        }

        case ADD_ORDER:
            return { ...state, orders: [...state.orders, action.order] }

        case UPDATE_ORDER: {
            const nextOrders = state.orders.map(o =>
                o._id === action.order._id ? action.order : o
            )
            return { ...state, orders: nextOrders }
        }

        case ADD_ORDER_MSG: {
            const nextOrders = state.orders.map(o =>
                o._id === action.orderId
                    ? { ...o, msgs: [...(o.msgs || []), action.msg] }
                    : o
            )
            return { ...state, orders: nextOrders }
        }

        case SET_FILTER_BY:
            return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }

        case SET_IS_LOADING:
            return { ...state, isLoading: action.isLoading }

        default:
    }
    return state
}


function unitTestReducer() {
    var state = initialState
    const order1 = { _id: 'b101', name: 'Order ' + parseInt('' + Math.random() * 10), price: 12, host: null, msgs: [] }
    const order2 = { _id: 'b102', name: 'Order ' + parseInt('' + Math.random() * 10), price: 13, host: null, msgs: [] }

    state = orderReducer(state, { type: SET_ORDERS, orders: [order1] })
    // console.log('After SET_ORDERS:', state)

    state = orderReducer(state, { type: ADD_ORDER, order: order2 })
    // console.log('After ADD_ORDER:', state)

    state = orderReducer(state, { type: UPDATE_ORDER, order: { ...order2, name: 'Good' } })
    // console.log('After UPDATE_ORDER:', state)

    state = orderReducer(state, { type: REMOVE_ORDER, orderId: order2._id })
    // console.log('After REMOVE_ORDER:', state)

    state = orderReducer(state, { type: SET_ORDER, order: order1 })
    // console.log('After SET_ORDER:', state)

    const msg = { id: 'm' + parseInt('' + Math.random() * 100), txt: 'Some msg', by: { _id: 'u123', fullname: 'test' } }
    state = orderReducer(state, { type: ADD_ORDER_MSG, orderId: order1._id, msg })
    // console.log('After ADD_ORDER_MSG:', state)
}

