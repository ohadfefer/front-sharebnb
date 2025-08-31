import { useState, useEffect } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { stayService } from '../services/stay/stay.service.local.js'

export function StayListings() {
    const [stays, setStays] = useState([])
    const [sortedStays, setSortedStays] = useState([])
    const [sortConfig, setSortConfig] = useState({ field: null, direction: null })
    const navigate = useNavigate()

    useEffect(() => {
        loadStays()
    }, [])

    useEffect(() => {
        setSortedStays(stays)
    }, [stays])

    async function loadStays() {
        try {

            if (typeof stayService.createStays === 'function') {
                stayService.createStays()
            }
            
            const staysData = await stayService.query()
            setStays(staysData)
        } catch (error) {
            console.error('Error loading stays:', error)
        }
    }

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A'
        const date = new Date(dateString)
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        })
    }

    const handleListingClick = (stayId) => {
        navigate(`/stay/${stayId}`)
    }

    const handleSort = (field) => {
        let newDirection = 'asc'
        let newStays = [...stays]

        if (sortConfig.field === field) {
            if (sortConfig.direction === 'asc') {
                newDirection = 'desc'
            } else if (sortConfig.direction === 'desc') {
                newDirection = null
                setSortConfig({ field: null, direction: null })
                setSortedStays(stays)
                return
            }
        }

        if (newDirection === 'asc') {
            newStays.sort((a, b) => {
                const aVal = a[field] || 0
                const bVal = b[field] || 0
                return aVal - bVal
            })
        } else if (newDirection === 'desc') {
            newStays.sort((a, b) => {
                const aVal = a[field] || 0
                const bVal = b[field] || 0
                return bVal - aVal
            })
        }

        setSortConfig({ field, direction: newDirection })
        setSortedStays(newStays)
    }

    const getSortIcon = (field) => {
        if (sortConfig.field !== field) return <span class="sort-icon">&#8597;</span>
        if (sortConfig.direction === 'asc') return  <span class="sort-icon">&#x25BE;</span>
        if (sortConfig.direction === 'desc') return  <span class="sort-icon">&#x25B4;</span>
        return  <span class="sort-icon">&#8597;</span>
    }

    return (
        <div className="stay-listings-page">
            {/* header navigation */}
            <header className="listings-header">
                <nav className="listings-nav">
                    <NavLink to="/dashboard/stay/edit" className="nav-link">
                        Create listing
                    </NavLink>
                    <NavLink to="/dashboard/listings" className="nav-link active">
                        Listings
                    </NavLink>
                    <NavLink to="/dashboard/reservations" className="nav-link">
                        Reservations
                    </NavLink>
                </nav>
            </header>

            {/* item count */}
            <div className="listings-count">
                <span>{sortedStays.length} items</span>
            </div>

            {/* stays grid */}
            <div className="stays-grid-container">
                <table className="stays-table">
                    <thead>
                        <tr>
                            <th>LISTING</th>
                            <th>TODO</th>
                            <th 
                                className="sortable-header"
                                onClick={() => handleSort('capacity')}
                                style={{ cursor: 'pointer' }}
                            >
                                CAPACITY {getSortIcon('capacity')}
                            </th>
                            <th 
                                className="sortable-header"
                                onClick={() => handleSort('rooms')}
                                style={{ cursor: 'pointer' }}
                            >
                                ROOMS {getSortIcon('rooms')}
                            </th>
                            <th 
                                className="sortable-header"
                                onClick={() => handleSort('bedrooms')}
                                style={{ cursor: 'pointer' }}
                            >
                                BEDROOMS {getSortIcon('bedrooms')}
                            </th>
                            <th 
                                className="sortable-header"
                                onClick={() => handleSort('price')}
                                style={{ cursor: 'pointer' }}
                            >
                                PRICE {getSortIcon('price')}
                            </th>
                            <th>LOCATION</th>
                            <th>DATE ADDED</th>
                        </tr>
                    </thead>
                    <tbody>
                        {sortedStays.map((stay) => (
                            <tr key={stay._id} className="stay-row">
                                <td className="listing-cell">
                                    <div 
                                        className="listing-info"
                                        onClick={() => handleListingClick(stay._id)}
                                    >
                                        <img 
                                            src={stay.imgUrls?.[0] || '/img/default-stay.jpg'} 
                                            alt={stay.name}
                                            className="stay-image"
                                        />
                                        <span className="stay-name">{stay.name}</span>
                                    </div>
                                </td>
                                <td className="todo-cell">
                                    <button className="update-btn">Update</button>
                                </td>
                                <td className="capacity-cell">
                                    {stay.capacity || 'N/A'}
                                </td>
                                <td className="rooms-cell">
                                    {stay.rooms || 'N/A'}
                                </td>
                                <td className="bedrooms-cell">
                                    {stay.bedrooms || 'N/A'}
                                </td>
                                <td className="price-cell">
                                    ${stay.price || 'N/A'}
                                </td>
                                <td className="location-cell">
                                    {stay.loc?.city}, {stay.loc?.country}
                                </td>
                                <td className="date-cell">
                                    {formatDate(stay.at)}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}