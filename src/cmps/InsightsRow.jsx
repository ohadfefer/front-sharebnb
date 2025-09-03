// src/cmps/InsightsRow.jsx
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts'
import { buildNext30Occupancy, leadTimeBuckets, revenueByListing } from '../services/analytics.service'

// Simple color set for the donut
const donutColors = ['#93c5fd', '#60a5fa', '#3b82f6', '#2563eb', '#1d4ed8']

export function InsightsRow({ orders = [] }) {
    const occ = buildNext30Occupancy(orders)
    const lead = leadTimeBuckets(orders)
    const top5 = revenueByListing(orders)

    const hasAny = (arr) => Array.isArray(arr) && arr.length && arr.some(x => (x.v ?? x.total ?? x.occ) > 0)

    return (
        <section className="insights-grid">
            {/* Occupancy strip */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Next 30 nights</h3>
                    <p>Green = booked</p>
                </header>
                {occ?.length ? (
                    <div className="occ-strip" aria-label="Occupancy next 30 nights">
                        {occ.map((d, i) => (
                            <span key={i} className={d.occ ? 'box on' : 'box'} title={`${d.label} — ${d.occ ? 'Booked' : 'Free'}`} />
                        ))}
                    </div>
                ) : (
                    <EmptyState />
                )}
            </article>

            {/* Booking window donut */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Booking window</h3>
                    <p>How far ahead guests book</p>
                </header>

                {hasAny(lead) ? (
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={200}>
                            <PieChart>
                                <Pie data={lead} dataKey="v" innerRadius={55} outerRadius={80} paddingAngle={2}>
                                    {lead.map((_, i) => <Cell key={i} fill={donutColors[i % donutColors.length]} />)}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </article>

            {/* Revenue by listing */}
            <article className="insight-card">
                <header className="insight-head">
                    <h3>Top revenue by listing</h3>
                    <p>This month to date</p>
                </header>

                {hasAny(top5) ? (
                    <div className="chart-wrap">
                        <ResponsiveContainer width="100%" height={240}>
                            <BarChart data={top5} layout="vertical" margin={{ left: 8, right: 8 }}>
                                <XAxis type="number" hide />
                                <YAxis type="category" dataKey="name" width={130} />
                                <Tooltip formatter={(v) => [`$${Number(v).toLocaleString()}`, 'Revenue']} />
                                <Bar dataKey="total" radius={[6, 6, 6, 6]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                ) : (
                    <EmptyState />
                )}
            </article>
        </section>
    )
}

function EmptyState() {
    return <div className="insight-empty">No data yet.</div>
}
