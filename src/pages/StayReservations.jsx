// src/cmps/StayReservations.jsx
import { useEffect, useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import { NavLink } from 'react-router-dom'
import { loadOrders, updateOrderStatus } from '../store/actions/order.actions'
import { formatDateMMDDYYYY as fmtDate, formatMoney } from '../services/util.service'

const COLS = [
    { key: 'guest', label: 'Guest', get: r => (r.guest?.fullname || '').toLowerCase() },
    { key: 'startDate', label: 'Check-in', get: r => new Date(r.startDate || 0).getTime() },
    { key: 'endDate', label: 'Checkout', get: r => new Date(r.endDate || 0).getTime() },
    { key: 'listing', label: 'Listing', get: r => (r.stay?.name || '').toLowerCase() },
    { key: 'payout', label: 'Total Payout', get: r => Number(r.totalPrice) || 0 },
    { key: 'status', label: 'Status', get: r => r.status || '' },
    { key: 'todo', label: 'To do', get: null },
]

const STATUS = {
    pending: { cls: 'pending', label: 'Pending' },
    approved: { cls: 'ok', label: 'Approved' },
    completed: { cls: 'ok', label: 'Approved' },
    rejected: { cls: 'bad', label: 'Rejected' },
}

const initials = (name = '') =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('')

export function StayReservations() {
    const { orders = [], isLoading } = useSelector(s => s.orderModule)
    const [sort, setSort] = useState({ by: 'startDate', dir: 'asc' })

    useEffect(() => { loadOrders() }, [])

    function toggleSort(key) {
        if (key === 'todo') return
        setSort(s => s.by === key ? { by: key, dir: s.dir === 'asc' ? 'desc' : 'asc' } : { by: key, dir: 'asc' })
    }

    const sorted = useMemo(() => {
        const col = COLS.find(c => c.key === sort.by)
        const get = col?.get
        const mul = sort.dir === 'asc' ? 1 : -1
        const list = [...orders]
        if (get) {
            list.sort((a, b) => {
                const va = get(a), vb = get(b)
                if (va < vb) return -1 * mul
                if (va > vb) return 1 * mul
                return 0
            })
        }
        return list
    }, [orders, sort])

    return (
        <section className="reservations-page">
            <header className="listings-header">
                <nav className="listings-nav">
                    <NavLink to="/hosting/listings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Create listing</NavLink>
                    <NavLink to="/dashboard/listings" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Listings</NavLink>
                    <NavLink to="/dashboard/reservations" className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}>Reservations</NavLink>
                </nav>
            </header>

            <h2 className="res-title">{isLoading ? 'Loading…' : `${sorted.length} reservations`}</h2>

            <div className="res-card">
                <table className="res-table">
                    <thead>
                        <tr>
                            {COLS.map(c => (
                                <th
                                    key={c.key}
                                    className={`col-${c.key} ${!c.get ? 'no-sort' : ''}`}
                                    onClick={() => toggleSort(c.key)}
                                >
                                    <span>{c.label}</span>
                                    {c.get && <i className={`sort ${sort.by === c.key ? sort.dir : ''}`} />}
                                </th>
                            ))}
                        </tr>
                    </thead>

                    <tbody>
                        {!isLoading && sorted.map(o => {
                            const s = STATUS[o.status] || STATUS.pending
                            return (
                                <tr key={o._id} className="reservation-row">
                                    {/* Guest */}
                                    <td className="col-guest">
                                        <div className="guest-cell">
                                            {o.guest?.imgUrl
                                                ? <img className="avatar" src={o.guest.imgUrl} alt={o.guest.fullname} />
                                                : <div className="avatar avatar-fallback">{initials(o.guest?.fullname)}</div>}
                                            <span className="guest-name" title={o.guest?.fullname}>{o.guest?.fullname || '—'}</span>
                                        </div>
                                    </td>

                                    {/* Dates */}
                                    <td className="col-startDate">{fmtDate(o.startDate)}</td>
                                    <td className="col-endDate">{fmtDate(o.endDate)}</td>

                                    {/* Listing */}
                                    <td className="col-listing">
                                        <span className="listing-name" title={o.stay?.name || '—'}>{o.stay?.name || '—'}</span>
                                    </td>

                                    {/* Total Payout */}
                                    <td className="col-payout">{formatMoney(o.totalPrice, 'USD')}</td>

                                    {/* Status */}
                                    <td className="col-status">
                                        <span className={`status-pill ${s.cls}`}>{s.label}</span>
                                    </td>

                                    {/* To do */}
                                    <td className="col-todo">
                                        <div className="todo-actions">
                                            <button
                                                className="btn-approve"
                                                onClick={() => updateOrderStatus(o._id, 'approved')}
                                                disabled={o.status === 'approved' || o.status === 'completed'}
                                            >
                                                Approve
                                            </button>
                                            <button
                                                className="btn-reject"
                                                onClick={() => updateOrderStatus(o._id, 'rejected')}
                                                disabled={o.status === 'rejected'}
                                            >
                                                Reject
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )
                        })}

                        {(!isLoading && sorted.length === 0) && (
                            <tr><td colSpan={COLS.length} className="empty">No reservations yet.</td></tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
