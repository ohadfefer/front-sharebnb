// src/cmps/FilterSheet/FilterSheet.jsx
import { useEffect, useMemo, useRef, useState } from "react"
import { useDispatch } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setFilter } from "../store/actions/stay.actions"
import { buildSearchParams, formatGuestsLabel, toIsoDate, fromIsoDate, buildStayPathWithParams } from "../services/util.service"
import { AutoCompletePanel } from "../cmps/AutoCompletePanel.jsx"
import { loadGoogleMapsPlaces } from "../services/googleMapsLoader"

const clamp = (n, min, max) => Math.max(min, Math.min(max, n))

export function FilterSheet({ id = "filter-sheet", initial = {}, onClose }) {
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()

    // staged UI: 'where' | 'when' | 'who'
    const [stage, setStage] = useState("where")

    // local draft of the filter
    const [draft, setDraft] = useState(() => ({
        address: initial.address || "",
        placeId: initial.placeId || "",
        checkIn: initial.checkIn || "",
        checkOut: initial.checkOut || "",
        guests: { ...(typeof initial.guests === "number" ? { adults: initial.guests } : (initial.guests || {})) },
        loc: initial.loc || null, // {lat,lng,city,country}
    }))

    useEffect(() => {
        // close on ESC
        const onKey = (e) => e.key === "Escape" && onClose?.()
        window.addEventListener("keydown", onKey)
        return () => window.removeEventListener("keydown", onKey)
    }, [onClose])

    function updateGuests(key, diff) {
        setDraft(d => {
            const curr = Number(d.guests?.[key]) || 0
            const next = clamp(curr + diff, 0, 99)
            const guests = { ...d.guests, [key]: next }
            // clean zeros
            for (const k of Object.keys(guests)) if (!guests[k]) delete guests[k]
            return { ...d, guests }
        })
    }

    async function onPickPlace({ address, placeId }) {
        setDraft(d => ({ ...d, address, placeId }))
        // Try to enrich with lat/lng + city/country
        try {
            await loadGoogleMapsPlaces()
            const service = new window.google.maps.places.PlacesService(document.createElement('div'))
            await new Promise((resolve) => {
                service.getDetails(
                    { placeId, fields: ["geometry.location", "address_components"] },
                    (res) => {
                        if (res?.geometry?.location) {
                            const lat = res.geometry.location.lat()
                            const lng = res.geometry.location.lng()
                            const comps = Object.fromEntries(
                                (res.address_components || []).flatMap(c => c.types.map(t => [t, c.long_name]))
                            )
                            setDraft(d => ({
                                ...d,
                                loc: {
                                    lat, lng,
                                    city: comps.locality || comps.sublocality || "",
                                    country: comps.country || ""
                                }
                            }))
                        }
                        resolve()
                    }
                )
            })
            setStage("when")
        } catch {
            setStage("when")
        }
    }

    function onApply() {
        // Persist to Redux
        dispatch(setFilter({
            address: draft.address,
            placeId: draft.placeId,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            guests: draft.guests,
            loc: draft.loc
        }))

        // Navigate with params
        const params = buildSearchParams({
            address: draft.address,
            checkIn: draft.checkIn,
            checkOut: draft.checkOut,
            guests: draft.guests
        })
        const path = buildStayPathWithParams("", params) // goes to /stay?...
        navigate(path.replace(/\/$/, "/stay")) // ensure /stay when no id
        onClose?.()
    }

    function onClearAll() {
        setDraft({ address: "", placeId: "", checkIn: "", checkOut: "", guests: {}, loc: null })
    }

    const guestsLabel = formatGuestsLabel(draft.guests)

    return (
        <div id={id} className="m-sheet" role="dialog" aria-modal="true">
            <div className="m-sheet__panel">
                <div className="m-sheet__header">
                    <button className="sheet-back" onClick={onClose} aria-label="Close">✕</button>
                    <div className="sheet-tabs">
                        <button className={`tab ${stage === 'where' ? 'active' : ''}`} onClick={() => setStage('where')}>Where</button>
                        <button className={`tab ${stage === 'when' ? 'active' : ''}`} onClick={() => setStage('when')}>When</button>
                        <button className={`tab ${stage === 'who' ? 'active' : ''}`} onClick={() => setStage('who')}>Who</button>
                    </div>
                    <i aria-hidden />
                </div>

                {/* BODY */}
                <div className="m-sheet__body">
                    {stage === "where" && (
                        <section className="sheet-section">
                            <label className="field">
                                <input
                                    className="input"
                                    placeholder="Search destinations"
                                    value={draft.address}
                                    onChange={e => setDraft(d => ({ ...d, address: e.target.value }))}
                                />
                            </label>
                            {/* Suggestions */}
                            <AutoCompletePanel
                                value={{ address: draft.address }}
                                onChange={onPickPlace}
                                onAdvance={() => setStage("when")}
                            />
                        </section>
                    )}

                    {stage === "when" && (
                        <section className="sheet-section">
                            <div className="date-row">
                                <label>
                                    <span>Check-in</span>
                                    <input
                                        type="date"
                                        value={toIsoDate(fromIsoDate(draft.checkIn)) || draft.checkIn}
                                        onChange={e => setDraft(d => ({ ...d, checkIn: e.target.value }))}
                                    />
                                </label>
                                <label>
                                    <span>Checkout</span>
                                    <input
                                        type="date"
                                        value={toIsoDate(fromIsoDate(draft.checkOut)) || draft.checkOut}
                                        onChange={e => setDraft(d => ({ ...d, checkOut: e.target.value }))}
                                    />
                                </label>
                            </div>
                            <div className="hint">We'll plug your calendar picker later—these native inputs work now.</div>
                        </section>
                    )}

                    {stage === "who" && (
                        <section className="sheet-section">
                            <CounterRow
                                title="Adults"
                                sub="Ages 13 or above"
                                value={Number(draft.guests?.adults) || 0}
                                onDec={() => updateGuests("adults", -1)}
                                onInc={() => updateGuests("adults", +1)}
                            />
                            <CounterRow
                                title="Children"
                                sub="Ages 2–12"
                                value={Number(draft.guests?.children) || 0}
                                onDec={() => updateGuests("children", -1)}
                                onInc={() => updateGuests("children", +1)}
                            />
                            <CounterRow
                                title="Infants"
                                sub="Under 2"
                                value={Number(draft.guests?.infants) || 0}
                                onDec={() => updateGuests("infants", -1)}
                                onInc={() => updateGuests("infants", +1)}
                            />
                            <CounterRow
                                title="Pets"
                                sub=" "
                                value={Number(draft.guests?.pets) || 0}
                                onDec={() => updateGuests("pets", -1)}
                                onInc={() => updateGuests("pets", +1)}
                            />
                        </section>
                    )}
                </div>

                {/* FOOTER */}
                <div className="m-sheet__footer">
                    <button className="link" onClick={onClearAll}>Clear all</button>
                    <button className="cta" onClick={onApply}>
                        <span className="cta-title">Search</span>
                        <span className="cta-sub">
                            {(draft.checkIn && draft.checkOut) ? "Dates • " : ""}
                            {guestsLabel !== "Add guests" ? guestsLabel : "Add guests"}
                        </span>
                    </button>
                </div>
            </div>
        </div>
    )
}

function CounterRow({ title, sub, value, onDec, onInc }) {
    return (
        <div className="counter-row">
            <div className="counter-texts">
                <div className="title">{title}</div>
                {sub && <div className="sub">{sub}</div>}
            </div>
            <div className="counter-controls">
                <button className="btn" onClick={onDec} disabled={value <= 0}>-</button>
                <span className="val">{value}</span>
                <button className="btn" onClick={onInc}>+</button>
            </div>
        </div>
    )
}
