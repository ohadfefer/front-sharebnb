import { useEffect, useMemo, useState } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"

import { loadOrders } from "../store/actions/order.actions.js"
import { stayService } from "../services/stay/stay.service.local.js"
import { userService } from "../services/user/index.js"

function formatDate(iso) {
    if (!iso) return "—"
    const date = new Date(iso)
    if (isNaN(date)) return "—"
    const mm = String(date.getMonth() + 1).padStart(2, "0")
    const dd = String(date.getDate()).padStart(2, "0")
    const yyyy = date.getFullYear()
    return `${mm}/${dd}/${yyyy}`
}

function formatMoney(value, currency = "USD") {
    try {
        return new Intl.NumberFormat("en-US", { style: "currency", currency })
            .format(Number(value || 0))
    } catch {
        return `$${Number(value || 0).toFixed(2)}`
    }
}

export function TripIndex() {
    const navigate = useNavigate()

    const orders = useSelector(selector => selector.orderModule.orders)
    const isLoading = useSelector(selector => selector.orderModule.isLoading)

    const [thumbMap, setThumbMap] = useState({})

    useEffect(() => {
        loadOrders()
    }, [])

    // Logged-in guest (filter list to "my trips"); if none, show all.
    const me = userService.getLoggedinUser?.() || null

    const myTrips = useMemo(() => {
        const base = Array.isArray(orders) ? orders : []
        const onlyMine = me?._id
            ? base.filter(order => order.guest?._id === me._id)
            : base

        // normalize a few fields for the UI
        return onlyMine.map(order => ({
            ...order,
            destination: order.stay?.name || "—",
            hostName: order.hostId?.fullname || "—",
            checkIn: order.startDate,
            checkOut: order.endDate,
            bookedAt: order.bookedAt || "",
            total: order.totalPrice ?? 0,
            statusUi: order.status === "completed" ? "approved" : (order.status || "pending"),
        }))
    }, [orders, me])

    // fetch thumbnails for each order's stay (from your seeded stay data)
    useEffect(() => {
        let alive = true;
        (async () => {
            const ids = [...new Set(myTrips.map(trip => trip.stay?._id).filter(Boolean))]
            const byId = {}
            for (const id of ids) {
                try { byId[id] = await stayService.getById(id) } catch { }
            }
            const map = {}
            for (const trip of myTrips) {
                map[trip._id] = byId[trip.stay?._id]?.imgUrls?.[0] || ""
            }
            if (alive) setThumbMap(map)
        })()
        return () => { alive = false }
    }, [myTrips])

    function handleRowClick(stayId) {
        if (!stayId) return
        navigate(`/stay/${stayId}`)
    }

    return (
        <section className="trips-page">
            <h2 className="trips-title">
                {isLoading ? "Loading…" : `${myTrips.length} trips`}
            </h2>

            <div className="trips-card">
                <table className="trips-table">
                    <thead>
                        <tr>
                            <th className="col-destination">Destination</th>
                            <th className="col-host">Host</th>
                            <th className="col-in">Check-in</th>
                            <th className="col-out">Checkout</th>
                            <th className="col-booked">Booked</th>
                            <th className="col-total">Total Price</th>
                            <th className="col-status">Status</th>
                        </tr>
                    </thead>

                    <tbody>
                        {!isLoading && myTrips.map((trip, idx) => (
                            <tr
                                key={trip._id}
                                className={idx % 2 ? "zebra" : ""}
                                onClick={() => handleRowClick(trip.stay?._id)}
                                role="button"
                            >
                                <td className="col-destination">
                                    <div className="dest-cell">
                                        <img
                                            src={thumbMap[trip._id] || "https://via.placeholder.com/72?text=%20"}
                                            alt=""
                                            className="dest-thumb"
                                            width={72}
                                            height={72}
                                            loading="lazy"
                                        />
                                        <span className="dest-name">{trip.destination}</span>
                                    </div>
                                </td>

                                <td className="col-host">{trip.hostName}</td>
                                <td className="col-in">{formatDate(trip.checkIn)}</td>
                                <td className="col-out">{formatDate(trip.checkOut)}</td>
                                <td className="col-booked">{formatDate(trip.bookedAt)}</td>
                                <td className="col-total">{formatMoney(trip.total)}</td>

                                <td className="col-status">
                                    <span className={
                                        "status-pill " + (
                                            trip.statusUi === "approved" ? "ok" :
                                                trip.statusUi === "rejected" ? "bad" : "pending")
                                    }>
                                        {trip.statusUi === "approved" ? "Completed" :
                                            trip.statusUi === "rejected" ? "Rejected" : "Pending"}
                                    </span>
                                </td>
                            </tr>
                        ))}

                        {(!isLoading && myTrips.length === 0) && (
                            <tr>
                                <td colSpan={7} className="empty">No trips yet.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </section>
    )
}
