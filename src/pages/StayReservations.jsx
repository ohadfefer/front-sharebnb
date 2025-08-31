// src/cmps/StayReservations.jsx
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { loadOrders, updateOrderStatus, removeOrder } from '../store/actions/order.actions'

function formatDate(dateStamp) {
    if (!dateStamp) return '—'
    const date = new Date(dateStamp)
    if (isNaN(date)) return '—'
    const mm = String(date.getMonth() + 1).padStart(2, '0')
    const dd = String(date.getDate()).padStart(2, '0')
    const yy = date.getFullYear()
    return `${mm}/${dd}/${yy}`
}

function formatMoney(num, currency = 'USD') {
    try {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency }).format(Number(num) || 0)
    } catch {
        return `$${Number(num || 0).toFixed(2)}`
    }
}

function nameInitials(name = '') {
    return name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('')
}

const HEADERS = [
    { key: 'guest', label: 'Guest' },
    { key: 'startDate', label: 'Check-in' },
    { key: 'endDate', label: 'Checkout' },
    { key: 'bookedAt', label: 'Booked' },
    { key: 'listing', label: 'Listing' },
    { key: 'payout', label: 'Total Payout' },
    { key: 'status', label: 'Status' },
    { key: 'todo', label: 'To do' },
]

export function StayReservations() {
    const { orders, isLoading } = useSelector(order => order.orderModule)
    const [sort, setSort] = useState({ by: 'startDate', dir: 'asc' })

    useEffect(() => {
        loadOrders()
    }, [])

    const rows = useMemo(
        () =>
            (orders || []).map(order => ({
                ...order,
                listing: order.stay?.name || '—',
                payout: order.totalPrice ?? 0,
            })),
        [orders]
    )

    function toggleSort(by) {
        setSort(curr => (curr.by === by ? { by, dir: curr.dir === 'asc' ? 'desc' : 'asc' } : { by, dir: 'asc' }))
    }

    const sorted = useMemo(() => {
        const { by, dir } = sort
        const mul = dir === 'asc' ? 1 : -1
        const getVal = (order) => {
            switch (by) {
                case 'guest': return order.guest?.fullname || ''
                case 'startDate': return new Date(order.startDate || 0).getTime()
                case 'endDate': return new Date(order.endDate || 0).getTime()
                case 'bookedAt': return new Date(order.bookedAt || 0).getTime()
                case 'listing': return order.listing || ''
                case 'payout': return Number(order.payout) || 0
                case 'status': return order.status || ''
                default: return ''
            }
        }
        return [...rows].sort((a, b) => {
            const valueA = getVal(a)
            const valueB = getVal(b)
            if (valueA < valueB) return -1 * mul
            if (valueA > valueB) return 1 * mul
            return 0
        })
    }, [rows, sort])

    return (
        <section className="reservations-page">
            <h2 className="res-title">
                {isLoading ? 'Loading…' : `${rows.length} reservations`}
            </h2>

            <div className="res-card">
                <table className="res-table">
                    <thead>
                        <tr>
                            {HEADERS.map(head => (
                                <th
                                    key={head.key}
                                    className={`col-${head.key} ${head.key === 'todo' ? 'no-sort' : ''}`}
                                    onClick={() => head.key !== 'todo' && toggleSort(head.key)}
                                >
                                    <span>{head.label}</span>
                                    {head.key !== 'todo' && (
                                        <i className={`sort ${sort.by === head.key ? sort.dir : ''}`} />
                                    )}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {!isLoading && sorted.map(order => (
                            <tr key={order._id} className='reservation-row'>
                                {/* Guest */}
                                <td className="col-guest">
                                    <div className="guest-cell">
                                        {order.guest?.imgUrl ? (
                                            <img className="avatar" src={order.guest.imgUrl} alt={order.guest.fullname} />
                                        ) : (
                                            <div className="avatar avatar-fallback">{nameInitials(order.guest?.fullname)}</div>
                                        )}
                                        <span className="guest-name" title={order.guest?.fullname}>
                                            {order.guest?.fullname || '—'}
                                        </span>
                                    </div>
                                </td>

                                {/* Dates */}
                                <td className="col-startDate">{formatDate(order.startDate)}</td>
                                <td className="col-endDate">{formatDate(order.endDate)}</td>
                                <td className="col-bookedAt">{formatDate(order.bookedAt)}</td>

                                {/* Listing */}
                                <td className="col-listing">
                                    <span className="listing-name" title={order.listing}>{order.listing}</span>
                                </td>

                                {/* Total Payout */}
                                <td className="col-payout">{formatMoney(order.payout)}</td>

                                {/* Status */}
                                <td className="col-status">
                                    <span
                                        className={`status-pill ${order.status === 'approved' ? 'ok'
                                                : order.status === 'rejected' ? 'bad'
                                                    : order.status === 'completed' ? 'ok'
                                                        : 'pending'
                                            }`}
                                    >
                                        {order.status === 'pending' ? 'Pending'
                                            : order.status === 'approved' ? 'Completed'
                                                : order.status === 'completed' ? 'Completed'
                                                    : 'Rejected'}
                                    </span>
                                </td>

                                {/* To do */}
                                <td className="col-todo">
                                    <div className="todo-actions">
                                        <button
                                            className="btn-approve"
                                            onClick={() => updateOrderStatus(order._id, 'approved')}
                                            disabled={order.status === 'approved' || order.status === 'completed'}
                                        >
                                            Approve
                                        </button>
                                        <button
                                            className="btn-reject"
                                            onClick={() => updateOrderStatus(order._id, 'rejected')}
                                            disabled={order.status === 'rejected'}
                                        >
                                            Reject
                                        </button>
                                        <button
                                            className="btn-delete"
                                            onClick={() => removeOrder(order._id)}
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}

                        {(!isLoading && sorted.length === 0) && (
                            <tr><td colSpan={HEADERS.length} className="empty">No reservations yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
