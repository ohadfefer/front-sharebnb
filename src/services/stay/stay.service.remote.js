import { httpService } from '../http.service'

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}

async function query(filterBy) {
    const f = { ...filterBy }

    // Only sum if guests is an object from the UI.
    if (f.guests && typeof f.guests === 'object') {
        const { adults = 0, children = 0 } = f.guests
        f.guests = (parseInt(adults, 10) || 0) + (parseInt(children, 10) || 0)
    }

    // If it’s a string from URL (?guests=8), make sure it’s numeric:
    if (typeof f.guests === 'string') f.guests = parseInt(f.guests, 10) || 0

    return httpService.get('stay', f)
    // if (filterBy.guests) {
    //     const sum = filterBy.guests.adults +
    //         filterBy.guests.children
    //     filterBy.guests = sum
    // }

    // return httpService.get(`stay`, filterBy)
}

function getById(stayId) {
    return httpService.get(`stay/${stayId}`)
}

async function remove(stayId) {
    return httpService.delete(`stay/${stayId}`)
}
async function save(stay) {
    var savedStay
    if (stay._id) {
        savedStay = await httpService.put(`stay/${stay._id}`, stay)
    } else {
        savedStay = await httpService.post('stay', stay)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    const savedMsg = await httpService.post(`stay/${stayId}/msg`, { txt })
    return savedMsg
}