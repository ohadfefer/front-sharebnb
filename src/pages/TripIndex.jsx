import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loadOrders, setFilter } from "../store/actions/order.actions.js"

function formatDate(iso) {
  if (!iso) return "—"
  const d = new Date(iso)
  if (isNaN(d)) return "—"
  const mm = String(d.getMonth() + 1).padStart(2, "0")
  const dd = String(d.getDate()).padStart(2, "0")
  const yyyy = d.getFullYear()
  return `${mm}/${dd}/${yyyy}`
}

function formatMoney(value, currency = "USD") {
  const n = Number(value ?? 0)
  try {
    return new Intl.NumberFormat("en-US", { style: "currency", currency }).format(n)
  } catch {
    return `$${n.toFixed(2)}`
  }
}

function capFirst(txt = "") {
  return txt ? txt.charAt(0).toUpperCase() + txt.slice(1) : ""
}

export function TripIndex() {
  const navigate = useNavigate()

  const loggedInUser = useSelector(s => s.userModule.user)
  const { orders, isLoading } = useSelector(s => s.orderModule)

  console.log('TripIndex - loggedInUser:', loggedInUser)
  console.log('TripIndex - orders:', orders)

  // Set the backend filter to the logged-in user's id (guest) and load orders.
  useEffect(() => {
    // Handle guest mode - if no user is logged in, use a default guest user ID
    const userId = loggedInUser?._id || 'guest-user-id'
    console.log('TripIndex - setting filter with userId:', userId)
    setFilter({ userId: userId }) // backend aliases userId -> guestId
    loadOrders()
  }, [loggedInUser?._id])

  function handleRowClick(stayId) {
    if (stayId) navigate(`/stay/${stayId}`)
  }

  if (!loggedInUser?._id) {
    return (
      <section className="trips-page">
        <h2 className="trips-title">My Trips</h2>
        <div className="trips-card">
          <p>Please sign in to see your trips.</p>
        </div>
      </section>
    )
  }

  return (
    <section className="trips-page">
      <h2 className="trips-title">
        {isLoading ? "Loading…" : `My Trips (${orders?.length || 0})`}
      </h2>

      <div className="trips-card">
        <table className="trips-table">
          <thead>
            <tr>
              <th className="col-destination">Destination</th>
              <th className="col-in">Check-in</th>
              <th className="col-out">Checkout</th>
              <th className="col-booked">Booked</th>
              <th className="col-total">Total</th>
              <th className="col-status">Status</th>
            </tr>
          </thead>

          <tbody>
            {!isLoading && Array.isArray(orders) && orders.length > 0 && orders.map((o, idx) => {
              const stayName = o?.stay?.name || o?.stay?.title || o?.name || "—"
              const stayThumb = o?.stay?.imgUrls?.[0] || o?.stay?.imgUrl || "https://via.placeholder.com/72?text=%20"
              const checkIn = formatDate(o?.startDate || o?.checkIn || o?.from)
              const checkOut = formatDate(o?.endDate || o?.checkOut || o?.to)
              const bookedAt = formatDate(o?.createdAt || o?.bookedAt)
              const total = formatMoney(o?.totalPrice ?? o?.price ?? 0)
              const status = capFirst(o?.status || "pending")

              return (
                <tr
                  key={o._id}
                  className={idx % 2 ? "zebra" : ""}
                  onClick={() => handleRowClick(o?.stay?._id)}
                  role="button"
                >
                  <td className="col-destination">
                    <div className="dest-cell">
                      <img
                        src={stayThumb}
                        alt=""
                        className="dest-thumb"
                        width={72}
                        height={72}
                        loading="lazy"
                      />
                      <span className="dest-name">{stayName}</span>
                    </div>
                  </td>

                  <td className="col-in">{checkIn}</td>
                  <td className="col-out">{checkOut}</td>
                  <td className="col-booked">{bookedAt}</td>
                  <td className="col-total">{total}</td>
                  <td className="col-status">
                    <span className={`status-pill ${status.toLowerCase()}`}>
                      {status}
                    </span>
                  </td>
                </tr>
              )
            })}

            {!isLoading && (!orders || orders.length === 0) && (
              <tr>
                <td colSpan={6} className="empty">No trips yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}
// import { useEffect, useMemo, useState } from "react"
// import { useSelector } from "react-redux"
// import { useNavigate } from "react-router-dom"

// import { loadOrders } from "../store/actions/order.actions.js"
// import { stayService } from "../services/stay/stay.service.local.js"
// import { userService } from "../services/user/index.js"

// function formatDate(iso) {
//     if (!iso) return "—"
//     const date = new Date(iso)
//     if (isNaN(date)) return "—"
//     const mm = String(date.getMonth() + 1).padStart(2, "0")
//     const dd = String(date.getDate()).padStart(2, "0")
//     const yyyy = date.getFullYear()
//     return `${mm}/${dd}/${yyyy}`
// }

// function formatMoney(value, currency = "USD") {
//     try {
//         return new Intl.NumberFormat("en-US", { style: "currency", currency })
//             .format(Number(value || 0))
//     } catch {
//         return `$${Number(value || 0).toFixed(2)}`
//     }
// }

// export function TripIndex() {
//     const navigate = useNavigate()

//     const orders = useSelector(selector => selector.orderModule.orders)
//     const isLoading = useSelector(selector => selector.orderModule.isLoading)

//     const [thumbMap, setThumbMap] = useState({})

//     useEffect(() => {
//         loadOrders()
//     }, [])

//     // Logged-in guest (filter list to "my trips"); if none, show all.
//     const me = userService.getLoggedinUser?.() || null

//     const myTrips = useMemo(() => {
//         const base = Array.isArray(orders) ? orders : []
//         const onlyMine = me?._id
//             ? base.filter(order => order.guest?._id === me._id)
//             : base

//         // normalize a few fields for the UI
//         return onlyMine.map(order => ({
//             ...order,
//             destination: order.stay?.name || "—",
//             hostName: order.hostId?.fullname || "—",
//             checkIn: order.startDate,
//             checkOut: order.endDate,
//             bookedAt: order.bookedAt || "",
//             total: order.totalPrice ?? 0,
//             statusUi: order.status === "completed" ? "approved" : (order.status || "pending"),
//         }))
//     }, [orders, me])

//     // fetch thumbnails for each order's stay (from your seeded stay data)
//     useEffect(() => {
//         let alive = true;
//         (async () => {
//             const ids = [...new Set(myTrips.map(trip => trip.stay?._id).filter(Boolean))]
//             const byId = {}
//             for (const id of ids) {
//                 try { byId[id] = await stayService.getById(id) } catch { }
//             }
//             const map = {}
//             for (const trip of myTrips) {
//                 map[trip._id] = byId[trip.stay?._id]?.imgUrls?.[0] || ""
//             }
//             // if (alive) setThumbMap(map)
//         })()
//         return () => { alive = false }
//     }, [myTrips])

//     function handleRowClick(stayId) {
//         if (!stayId) return
//         navigate(`/stay/${stayId}`)
//     }

//     return (
//         <section className="trips-page">
//             <h2 className="trips-title">
//                 {isLoading ? "Loading…" : `${myTrips.length} trips`}
//             </h2>

//             <div className="trips-card">
//                 <table className="trips-table">
//                     <thead>
//                         <tr>
//                             <th className="col-destination">Destination</th>
//                             <th className="col-host">Host</th>
//                             <th className="col-in">Check-in</th>
//                             <th className="col-out">Checkout</th>
//                             <th className="col-booked">Booked</th>
//                             <th className="col-total">Total Price</th>
//                             <th className="col-status">Status</th>
//                         </tr>
//                     </thead>

//                     <tbody>
//                         {!isLoading && myTrips.map((trip, idx) => (
//                             <tr
//                                 key={trip._id}
//                                 className={idx % 2 ? "zebra" : ""}
//                                 onClick={() => handleRowClick(trip.stay?._id)}
//                                 role="button"
//                             >
//                                 <td className="col-destination">
//                                     <div className="dest-cell">
//                                         <img
//                                             src={thumbMap[trip._id] || "https://via.placeholder.com/72?text=%20"}
//                                             alt=""
//                                             className="dest-thumb"
//                                             width={72}
//                                             height={72}
//                                             loading="lazy"
//                                         />
//                                         <span className="dest-name">{trip.destination}</span>
//                                     </div>
//                                 </td>

//                                 <td className="col-host">{trip.hostName}</td>
//                                 <td className="col-in">{formatDate(trip.checkIn)}</td>
//                                 <td className="col-out">{formatDate(trip.checkOut)}</td>
//                                 <td className="col-booked">{formatDate(trip.bookedAt)}</td>
//                                 <td className="col-total">{formatMoney(trip.total)}</td>

//                                 <td className="col-status">
//                                     <span className={
//                                         "status-pill " + (
//                                             trip.statusUi === "approved" ? "ok" :
//                                                 trip.statusUi === "rejected" ? "bad" : "pending")
//                                     }>
//                                         {trip.statusUi === "approved" ? "Completed" :
//                                             trip.statusUi === "rejected" ? "Rejected" : "Pending"}
//                                     </span>
//                                 </td>
//                             </tr>
//                         ))}

//                         {(!isLoading && myTrips.length === 0) && (
//                             <tr>
//                                 <td colSpan={7} className="empty">No trips yet.</td>
//                             </tr>
//                         )}
//                     </tbody>
//                 </table>
//             </div>
//         </section>
//     )
// }
