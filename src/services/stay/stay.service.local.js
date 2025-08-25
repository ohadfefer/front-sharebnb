
import { storageService } from '../async-storage.service'
import { makeId } from '../util.service'
import { userService } from '../user'

const STORAGE_KEY = 'stay'
createStays()

export const stayService = {
    query,
    getById,
    save,
    remove,
    addStayMsg
}
window.cs = stayService


async function query(filterBy = { address: '', maxPrice: 0 }) {
    var stays = await storageService.query(STORAGE_KEY)
    const { address, maxPrice, sortField, sortDir } = filterBy

    if (address) {
        const regex = new RegExp(filterBy.address, 'i')
        stays = stays.filter(stay => regex.test(stay.name) || regex.test(stay.loc.country) || regex.test(stay.loc.city))
    }
    if (maxPrice) {
        stays = stays.filter(stay => stay.price >= maxPrice)
    }
    if (sortField === 'name') {
        stays.sort((stay1, stay2) =>
            stay1[sortField].localeCompare(stay2[sortField]) * +sortDir)
    }
    if (sortField === 'price') {
        stays.sort((stay1, stay2) =>
            (stay1[sortField] - stay2[sortField]) * +sortDir)
    }

    stays = stays.map(({ _id, name, price, owner }) => ({ _id, name, price, owner }))
    return stays
}

function getById(stayId) {
    return storageService.get(STORAGE_KEY, stayId)
}

async function remove(stayId) {
    // throw new Error('Nope')
    await storageService.remove(STORAGE_KEY, stayId)
}

async function save(stay) {
    var savedStay
    if (stay._id) {
        const stayToSave = {
            _id: stay._id,
            price: stay.price
        }
        savedStay = await storageService.put(STORAGE_KEY, stayToSave)
    } else {
        const stayToSave = {
            name: stay.name,
            price: stay.price,
            // Later, owner is set by the backend
            owner: userService.getLoggedinUser(),
            msgs: []
        }
        savedStay = await storageService.post(STORAGE_KEY, stayToSave)
    }
    return savedStay
}

async function addStayMsg(stayId, txt) {
    // Later, this is all done by the backend
    const stay = await getById(stayId)

    const msg = {
        id: makeId(),
        by: userService.getLoggedinUser(),
        txt
    }
    stay.msgs.push(msg)
    await storageService.put(STORAGE_KEY, stay)

    return msg
}

function createStays() {
    let stays = JSON.parse(localStorage.getItem(STORAGE_KEY))
    if (!stays || !stays.length) {
        stays = [
            {
                _id: 's102',
                name: 'Sea Breeze Villa',
                type: 'Villa',
                imgUrls: ['https://villa-sea.com/sea1.jpg', 'https://villa-sea.com/sea2.jpg'],
                price: 250.0,
                summary: 'Luxury villa with private pool and ocean view.',
                capacity: 6,
                night: 2,
                amenities: ['Pool', 'Wifi', 'Air conditioning', 'Kitchen', 'Parking'],
                labels: ['Luxury', 'Beachfront', 'Family Friendly'],
                host: {
                    _id: 'u103',
                    fullname: 'Maria Gomez',
                    imgUrl: 'https://a0.muscache.com/im/pictures/maria.jpg',
                },
                loc: {
                    country: 'Spain',
                    countryCode: 'ES',
                    city: 'Barcelona',
                    address: '45 Carrer de la Mar',
                    lat: 41.3851,
                    lng: 2.1734,
                },
                reviews: [
                    {
                        id: 'r101',
                        txt: 'Amazing location, perfect for families.',
                        rate: 5,
                        by: {
                            _id: 'u104',
                            fullname: 'Chris Evans',
                            imgUrl: '/img/chris.jpg',
                        },
                    },
                ],
                likedByUsers: ['user3', 'user4'],
            },
            {
                _id: 's103',
                name: 'Mountain Escape Cabin',
                type: 'Cabin',
                imgUrls: ['https://mountain.com/cabin1.jpg', 'https://mountain.com/cabin2.jpg'],
                price: 120.0,
                summary: 'Rustic cabin in the mountains with fireplace.',
                capacity: 4,
                amenities: ['Fireplace', 'Wifi', 'Kitchen', 'Heating'],
                labels: ['Cozy', 'Nature', 'Hiking'],
                host: {
                    _id: 'u105',
                    fullname: 'Lars Eriksson',
                    imgUrl: 'https://a0.muscache.com/im/pictures/lars.jpg',
                },
                loc: {
                    country: 'Norway',
                    countryCode: 'NO',
                    city: 'Bergen',
                    address: '12 Fjord Lane',
                    lat: 60.39299,
                    lng: 5.32415,
                },
                reviews: [
                    {
                        id: 'r102',
                        txt: 'So peaceful, loved the fireplace!',
                        rate: 5,
                        by: {
                            _id: 'u106',
                            fullname: 'Emma Stone',
                            imgUrl: '/img/emma.jpg',
                        },
                    },
                ],
                likedByUsers: ['user2'],
            },
            {
                _id: 's104',
                name: 'City Center Loft',
                type: 'Apartment',
                imgUrls: ['https://cityloft.com/loft1.jpg', 'https://cityloft.com/loft2.jpg'],
                price: 150.0,
                summary: 'Modern loft in the heart of the city.',
                capacity: 2,
                night: 3,
                amenities: ['Wifi', 'Kitchen', 'Workspace', 'Elevator'],
                labels: ['Business', 'Trendy', 'Central'],
                host: {
                    _id: 'u107',
                    fullname: 'Akira Tanaka',
                    imgUrl: 'https://a0.muscache.com/im/pictures/akira.jpg',
                },
                loc: {
                    country: 'Japan',
                    countryCode: 'JP',
                    city: 'Tokyo',
                    address: '5 Chiyoda',
                    lat: 35.6895,
                    lng: 139.6917,
                },
                reviews: [
                    {
                        id: 'r103',
                        txt: 'Perfect for a short stay, very central.',
                        rate: 4,
                        by: {
                            _id: 'u108',
                            fullname: 'Mark Lee',
                            imgUrl: '/img/mark.jpg',
                        },
                    },
                ],
                likedByUsers: ['user5'],
            },
            {
                _id: 's105',
                name: 'Countryside B&B',
                type: 'Bed & Breakfast',
                imgUrls: ['https://bnb.com/bnb1.jpg', 'https://bnb.com/bnb2.jpg'],
                price: 90.0,
                summary: 'Charming countryside stay with homemade breakfast.',
                capacity: 3,
                night: 2,
                amenities: ['Breakfast included', 'Wifi', 'Parking', 'Garden'],
                labels: ['Charming', 'Relaxing', 'Countryside'],
                host: {
                    _id: 'u109',
                    fullname: 'Sophie Laurent',
                    imgUrl: 'https://a0.muscache.com/im/pictures/sophie.jpg',
                },
                loc: {
                    country: 'France',
                    countryCode: 'FR',
                    city: 'Lyon',
                    address: '78 Rue de la Campagne',
                    lat: 45.764,
                    lng: 4.8357,
                },
                reviews: [
                    {
                        id: 'r104',
                        txt: 'Delicious breakfast, lovely garden.',
                        rate: 5,
                        by: {
                            _id: 'u110',
                            fullname: 'Anna Petrova',
                            imgUrl: '/img/anna.jpg',
                        },
                    },
                ],
                likedByUsers: ['mini-user'],
            },
            {
                _id: 's106',
                name: 'Desert Dome Stay',
                type: 'Unique Stay',
                imgUrls: ['https://desertdome.com/dome1.jpg', 'https://desertdome.com/dome2.jpg'],
                price: 180.0,
                summary: 'Sleep under the stars in a desert dome.',
                capacity: 2,
                night: 1,
                amenities: ['AC', 'Private bathroom', 'Stargazing deck'],
                labels: ['Unique', 'Adventure', 'Romantic'],
                host: {
                    _id: 'u111',
                    fullname: 'Mohammed Ali',
                    imgUrl: 'https://a0.muscache.com/im/pictures/mohammed.jpg',
                },
                loc: {
                    country: 'Morocco',
                    countryCode: 'MA',
                    city: 'Merzouga',
                    address: 'Sahara Desert Camp',
                    lat: 31.0994,
                    lng: -4.0127,
                },
                reviews: [
                    {
                        id: 'r105',
                        txt: 'Unforgettable experience, sky was breathtaking!',
                        rate: 5,
                        by: {
                            _id: 'u112',
                            fullname: 'David Chen',
                            imgUrl: '/img/david.jpg',
                        },
                    },
                ],
                likedByUsers: ['user6', 'user7'],
            },
        ]
        localStorage.setItem(STORAGE_KEY, JSON.stringify(stays))
    }
}

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
        stay: {
            // mini-stay
            _id: 'h102',
            name: 'House Of Uncle My',
            price: 80.0,
        },
        msgs: [], // host - guest chat
        status: 'pending', // approved / rejected
    },
]

const users = [
    {
        _id: 'u101',
        fullname: 'User 1',
        imgUrl: '/img/img1.jpg',
        username: 'user1',
        password: 'secret',
        reviews: [
            {
                id: 'madeId',
                txt: 'Quiet guest...',
                rate: 4,
                by: {
                    _id: 'u102',
                    fullname: 'user2',
                    imgUrl: '/img/img2.jpg',
                },
            },
        ],
    },
    {
        _id: 'u102',
        fullname: 'User 2',
        imgUrl: '/img/img2.jpg',
        username: 'user2',
        password: 'secret',
    },
]