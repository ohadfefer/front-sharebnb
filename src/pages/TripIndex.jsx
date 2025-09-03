// TripIndex.jsx
import { useEffect } from "react"
import { useSelector } from "react-redux"
import { useNavigate } from "react-router-dom"
import { loadOrders, setFilter } from "../store/actions/order.actions.js" // EDIT

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

  // Only query when a user is actually logged in
  useEffect(() => {                            // EDIT
    if (!loggedInUser?._id) return             // NEW: no "guest-user-id" requests
    setFilter({ userId: loggedInUser._id })    // EDIT
    loadOrders()
  }, [loggedInUser?._id])                      // EDIT

  function handleRowClick(stayId) {
    if (stayId) navigate(`/stay/${stayId}`)
  }

  if (!loggedInUser?._id) {
    return (
      <section className="trips-page">
        <h2 className="trips-title">My Trips</h2>
        <div className="trips-card"><p>Please sign in to see your trips.</p></div>
      </section>
    )
  }

  return (
    <section className="trips-page">
      <div className="trips-container">
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
                  <tr key={o._id} className={idx % 2 ? "zebra" : ""} onClick={() => handleRowClick(o?.stay?._id)} role="button">
                    <td className="col-destination">
                      <div className="dest-cell">
                        <img src={stayThumb} alt="" className="dest-thumb" width={72} height={72} loading="lazy" />
                        <span className="dest-name">{stayName}</span>
                      </div>
                    </td>
                    <td className="col-in">{checkIn}</td>
                    <td className="col-out">{checkOut}</td>
                    <td className="col-booked">{bookedAt}</td>
                    <td className="col-total">{total}</td>
                    <td className="col-status"><span className={`status-pill ${status.toLowerCase()}`}>{status}</span></td>
                  </tr>
                )
              })}

              {!isLoading && (!orders || orders.length === 0) && (
                <tr><td colSpan={6} className="empty">No trips yet.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}
