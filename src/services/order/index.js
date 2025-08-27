const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service'

import { orderService as local } from './order.service.local'
// import { orderService as remote } from './order.service.remote'

function getEmptyOrder() {
	return {
        _id: '',
		name:  makeLorem(3),
		price: getRandomIntInclusive(80, 240),
	}
}

function getDefaultFilter() {
    return {
        address: '',
        maxPrice: '',
        checkIn: '',
        checkOut: '',
        guests: {adults: 0, children: 0, infants: 0, pets: 0,},
        labels: [],
    }
}



const service = (VITE_LOCAL === 'true') ? local : local 
export const orderService = { getEmptyOrder, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.orderService = orderService
