// store/reducers/order.reducer.js
export const ADD_ORDER = 'ADD_ORDER'
export const REMOVE_ORDER = 'REMOVE_ORDER'
export const SET_ORDERS = 'SET_ORDERS'
export const SET_ORDER = 'SET_ORDER'
export const UPDATE_ORDER = 'UPDATE_ORDER'
export const ADD_ORDER_MSG = 'ADD_ORDER_MSG'
export const SET_FILTER_BY = 'SET_FILTER_BY'
export const SET_IS_LOADING = 'SET_IS_LOADING'

const initialState = {
    orders: [],
    isLoading: false,
    filterBy: {}, // NEW
}

export function orderReducer(state = initialState, action) {
    switch (action.type) {
        case SET_IS_LOADING:
            return { ...state, isLoading: action.isLoading }
        case SET_FILTER_BY: // NEW
            return { ...state, filterBy: { ...state.filterBy, ...action.filterBy } }
        case SET_ORDERS:
            return { ...state, orders: action.orders }
        case ADD_ORDER:
            return { ...state, orders: [action.order, ...state.orders] }
        case UPDATE_ORDER:
            return {
                ...state,
                orders: state.orders.map(o => o._id === action.order._id ? action.order : o)
            }
        case REMOVE_ORDER:
            return { ...state, orders: state.orders.filter(o => o._id !== action.orderId) }
        case ADD_ORDER_MSG:
            return state // (unused here)
        default:
            return state
    }
}
