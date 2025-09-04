import clsx from 'clsx'
import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getSortedRowModel,
    getPaginationRowModel,
    useReactTable,
} from '@tanstack/react-table'
import { formatDateMMDDYYYY as fmtDate, formatMoney } from '../services/util.service'
import { updateOrderStatus } from '../store/actions/order.actions'

const STATUS = {
    pending: { cls: 'pending', label: 'Pending' },
    approved: { cls: 'ok', label: 'Approved' },
    completed: { cls: 'ok', label: 'Completed' },
    rejected: { cls: 'bad', label: 'Rejected' },
}
const columnHelper = createColumnHelper()

const initials = (name = '') =>
    name.split(/\s+/).filter(Boolean).slice(0, 2).map(s => s[0]?.toUpperCase()).join('')

export function ReservationsTable({ rows, isLoading }) {
    console.log(rows)
    const columns = [
        columnHelper.accessor(r => r.guest?.fullname || '—', {
            id: 'guest',
            header: 'Guest',
            sortingFn: 'alphanumeric',
            cell: info => {
                const row = info.row.original
                return (
                    <div className="guest-cell">
                        {row.guest?.imgUrl
                            ? <img className="avatar" src={row.guest.imgUrl} alt={row.guest.fullname} />
                            : <div className="avatar avatar-fallback">{initials(row.guest?.fullname)}</div>}
                        <span className="guest-name" title={row.guest?.fullname}>{row.guest?.fullname || '—'}</span>
                    </div>
                )
            },
        }),
        columnHelper.accessor(r => new Date(r.startDate || 0).getTime(), {
            id: 'startDate',
            header: 'Check-in',
            sortingFn: 'basic',
            meta: { center: true },
            cell: info => fmtDate(info.row.original.startDate),
        }),
        columnHelper.accessor(r => new Date(r.endDate || 0).getTime(), {
            id: 'endDate',
            header: 'Checkout',
            sortingFn: 'basic',
            meta: { center: true },
            cell: info => fmtDate(info.row.original.endDate),
        }),
        columnHelper.accessor(r => r.stay?.name || '—', {
            id: 'listing',
            header: 'Listing',
            sortingFn: 'alphanumeric',
            cell: info => <span className="listing-name" title={info.getValue()}>{info.getValue()}</span>,
        }),
        columnHelper.accessor(r => Number(r.totalPrice) || 0, {
            id: 'payout',
            header: 'Total Payout',
            sortingFn: 'basic',
            meta: { right: true },
            cell: info => <div className="mono">{formatMoney(info.getValue(), 'USD')}</div>,
        }),
        columnHelper.accessor(r => r.status || 'pending', {
            id: 'status',
            header: 'Status',
            sortingFn: 'alphanumeric',
            meta: { center: true },
            cell: info => {
                const s = STATUS[info.getValue()] || STATUS.pending
                return <span className={clsx('status-pill', s.cls)}>{s.label}</span>
            },
        }),
        columnHelper.display({
            id: 'todo',
            header: 'To do',
            enableSorting: false,
            meta: { center: true },
            cell: info => {
                const o = info.row.original
                return (
                    <div className="todo-actions">
                        <button
                            className="btn-approve"
                            onClick={() => updateOrderStatus(o._id, 'approved')}
                            disabled={o.status === 'approved' || o.status === 'completed'}
                        >Approve</button>
                        <button
                            className="btn-reject"
                            onClick={() => updateOrderStatus(o._id, 'rejected')}
                            disabled={o.status === 'rejected'}
                        >Reject</button>
                    </div>
                )
            },
        }),
    ]

    const table = useReactTable({
        data: rows,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        initialState: { pagination: { pageIndex: 0, pageSize: 7 }, sorting: [{ id: 'startDate', desc: false }] },
    })

    return (
        <>
            <table className="res-table">
                <thead>
                    {table.getHeaderGroups().map(hg => (
                        <tr key={hg.id}>
                            {hg.headers.map(h => (
                                <th
                                    key={h.id}
                                    className={clsx(
                                        `col-${h.column.id}`,
                                        !h.column.getCanSort() && 'no-sort',
                                        h.column.columnDef.meta?.center && 'is-center',
                                        h.column.columnDef.meta?.right && 'is-right',
                                    )}
                                    onClick={h.column.getToggleSortingHandler()}
                                >
                                    <span>{flexRender(h.column.columnDef.header, h.getContext())}</span>
                                    {h.column.getCanSort() && (
                                        <i className={clsx(
                                            'sort',
                                            h.column.getIsSorted() === 'asc' && 'asc',
                                            h.column.getIsSorted() === 'desc' && 'desc'
                                        )} />
                                    )}
                                </th>
                            ))}
                        </tr>
                    ))}
                </thead>

                <tbody>
                    {isLoading ? (
                        <tr><td colSpan={columns.length} className="empty">Loading…</td></tr>
                    ) : table.getRowModel().rows.length ? (
                        table.getRowModel().rows.map(r => (
                            <tr key={r.id} className="reservation-row">
                                {r.getVisibleCells().map(c => (
                                    <td
                                        key={c.id}
                                        className={clsx(
                                            `col-${c.column.id}`,
                                            c.column.columnDef.meta?.center && 'is-center',
                                            c.column.columnDef.meta?.right && 'is-right',
                                        )}
                                    >
                                        {flexRender(c.column.columnDef.cell, c.getContext())}
                                    </td>
                                ))}
                            </tr>
                        ))
                    ) : (
                        <tr><td colSpan={columns.length} className="empty">No reservations yet.</td></tr>
                    )}
                </tbody>
            </table>

            <Pager table={table} />
        </>
    )
}

/** Pretty pagination bar */
function Pager({ table }) {
    const state = table.getState().pagination
    const canPrev = table.getCanPreviousPage()
    const canNext = table.getCanNextPage()
    const totalPages = table.getPageCount() || 1

    return (
        <div className="pager">
            <div className="pager__left">
                <button className="pager__btn" onClick={() => table.firstPage()} disabled={!canPrev} aria-label="First page">«</button>
                <button className="pager__btn" onClick={() => table.previousPage()} disabled={!canPrev} aria-label="Previous page">‹</button>
            </div>

            <div className="pager__center">
                <span className="pager__label">Page</span>
                <input
                    className="pager__input"
                    value={state.pageIndex + 1}
                    onChange={e => {
                        const n = Math.max(1, Math.min(Number(e.target.value) || 1, totalPages))
                        table.setPageIndex(n - 1)
                    }}
                />
                <span className="pager__label">of {totalPages}</span>
            </div>

            <div className="pager__right">
                <select
                    className="pager__select"
                    value={state.pageSize}
                    onChange={e => table.setPageSize(Number(e.target.value))}
                >
                    {[10, 20, 50].map(s => <option key={s} value={s}>{s} / page</option>)}
                </select>
                <button className="pager__btn" onClick={() => table.nextPage()} disabled={!canNext} aria-label="Next page">›</button>
                <button className="pager__btn" onClick={() => table.lastPage()} disabled={!canNext} aria-label="Last page">»</button>
            </div>
        </div>
    )
}
