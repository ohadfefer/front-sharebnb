export function makeId(length = 6) {
    var txt = ''
    var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'

    for (var i = 0; i < length; i++) {
        txt += possible.charAt(Math.floor(Math.random() * possible.length))
    }

    return txt
}

export function makeLorem(size = 100) {
    var words = ['The sky', 'above', 'the port', 'was', 'the color of television', 'tuned', 'to', 'a dead channel', '.', 'All', 'this happened', 'more or less', '.', 'I', 'had', 'the story', 'bit by bit', 'from various people', 'and', 'as generally', 'happens', 'in such cases', 'each time', 'it', 'was', 'a different story', '.', 'It', 'was', 'a pleasure', 'to', 'burn']
    var txt = ''
    while (size > 0) {
        size--
        txt += words[Math.floor(Math.random() * words.length)] + ' '
    }
    return txt
}

export function getRandomIntInclusive(min, max) {
    min = Math.ceil(min)
    max = Math.floor(max)
    return Math.floor(Math.random() * (max - min + 1)) + min
}


export function randomPastTime() {
    const HOUR = 1000 * 60 * 60
    const DAY = 1000 * 60 * 60 * 24
    const WEEK = 1000 * 60 * 60 * 24 * 7

    const pastTime = getRandomIntInclusive(HOUR, WEEK)
    return Date.now() - pastTime
}

export function debounce(func, timeout = 300) {
    let timer
    return (...args) => {
        clearTimeout(timer)
        timer = setTimeout(() => { func.apply(this, args) }, timeout)
    }
}

export function saveToStorage(key, value) {
    localStorage.setItem(key, JSON.stringify(value))
}

export function loadFromStorage(key) {
    const data = localStorage.getItem(key)
    return (data) ? JSON.parse(data) : undefined
}

// util.service.js

// Turn the current filter into URLSearchParams
export function buildSearchParams(filter = {}) {
    const params = new URLSearchParams();

    const { address, checkIn, checkOut, guests } = filter;

    if (address) params.set("address", address);
    if (checkIn) params.set("checkIn", checkIn);
    if (checkOut) params.set("checkOut", checkOut);

    // ---- flatten guests ----
    // support either a number (legacy “total”) or an object
    if (typeof guests === "number") {
        if (guests > 0) params.set("adults", String(guests));
    } else if (guests && typeof guests === "object") {
        for (const [k, v] of Object.entries(guests)) {
            const n = Number(v) || 0;
            if (n > 0) params.set(k, String(n)); // k: adults|children|infants|pets|...; omit zeros
        }
    }

    return params;
}

export function parseSearchParams(searchParams) {
    const sp = searchParams instanceof URLSearchParams
        ? searchParams
        : new URLSearchParams(searchParams)

    const filter = {}
    const val = (k) => sp.get(k) || ""

    if (val("address")) filter.address = val("address")
    if (val("checkIn")) filter.checkIn = val("checkIn")
    if (val("checkOut")) filter.checkOut = val("checkOut")

    const keys = ["adults", "children", "infants", "pets"]
    const guests = {}
    for (const k of keys) {
        const v = sp.get(k)
        if (v != null && v !== "" && Number(v) > 0) guests[k] = Number(v)
    }

    const legacyTotal = sp.get("guests")
    if (!Object.keys(guests).length && legacyTotal && Number(legacyTotal) > 0) {
        guests.adults = Number(legacyTotal)
    }

    if (Object.keys(guests).length) filter.guests = guests

    return filter
}

export function formatGuestsLabel(guests) {
    if (!guests) return "Add guests";
    if (typeof guests === "number") return guests ? `${guests} guests` : "Add guests"
    const total = Object.values(guests).reduce((a, b) => a + (Number(b) || 0), 0)
    return total ? `${total} guest${total > 1 ? "s" : ""}` : "Add guests"
}
