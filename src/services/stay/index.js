const { DEV, VITE_LOCAL } = import.meta.env

import { getRandomIntInclusive, makeLorem } from '../util.service'

import { stayService as local } from './stay.service.local'
import { stayService as remote } from './stay.service.remote'

function getEmptyStay() {
	return {
        _id: '',
		name:  makeLorem(3),
		price: getRandomIntInclusive(80, 240),
		msgs: [],
	}
}

function getDefaultFilter() {
    return {
        txt: '',
        minPrice: '',
        sortField: '',
        sortDir: '',
    }
}

const service = (VITE_LOCAL === 'true') ? local : remote
export const stayService = { getEmptyStay, getDefaultFilter, ...service }

// Easy access to this service from the dev tools console
// when using script - dev / dev:local

if (DEV) window.stayService = stayService
