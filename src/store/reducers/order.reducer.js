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
            return state
    }
}

