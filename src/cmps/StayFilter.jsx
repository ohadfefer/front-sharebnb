// StayFilter.jsx
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux"
import { useNavigate, useSearchParams } from "react-router-dom"
import { setFilter } from "../store/actions/stay.actions"
import { useFieldControl } from "../customHooks/useFieldControl.js"
import { DynamicPanel } from "./DynamicPanel"
import { PANELS_BY_KEY } from "../services/helpers/registry.jsx"
import { parseISO, isValid, format as formatDate } from "date-fns"
import { buildSearchParams, parseSearchParams, formatGuestsLabel } from "../services/util.service.js"
import searchIcon from "../assets/logo/icons/search.svg"

function formatDateForDisplay(isoString) {
  if (!isoString) return ""
  const date = parseISO(isoString)
  return isValid(date) ? formatDate(date, "MMM d") : ""
}

export function StayFilter({ mini, onRequestExpand, onPopoverComplete }) {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()

  const storeFilter = useSelector((state) => state.stayModule.filterBy)
  const [filterByToEdit, setfilterByToEdit] = useState(storeFilter)

  // Handle serch from mini to large
  useEffect(() => {
    if (!mini) setfilterByToEdit(storeFilter)
  }, [mini])

  // Keep filterByToEdit in sync while collapsed
  useEffect(() => {
    if (mini) setfilterByToEdit(storeFilter)
  }, [storeFilter])

  const fieldOrder = ["where", "checkin", "checkout", "who"]
  const {
    activeFilterCell,
    getCellProps,
    clearActiveFilterCell,
    pillElementRef,
    popoverElementRef,
    setActiveFilterCell,
    goToNextCell,
  } = useFieldControl(fieldOrder, { enableOutsideClickClose: true })


  // Render values: in mini show committed (store), in expanded show filterByToEdit
  const view = mini ? storeFilter : filterByToEdit
  const { address, checkIn, checkOut, guests } = view

  const guestsLabel = (() => {
    if (typeof guests === "number") return guests ? `${guests} guests` : "Add guests"
    const total = Object.values(guests || {}).reduce((a, b) => a + (Number(b) || 0), 0)
    return total ? `${total} guests` : "Add guests"
  })()

  // Mutate *filterByToEdit* only
  function handleInputChange(event) {
    const { name, type } = event.target
    let { value } = event.target
    if (type === "number") value = Number(value) || ""
    setfilterByToEdit(prev => ({ ...prev, [name]: value }))
  }

  // Commit filterByToEdit -> Redux + URL only on submit
  function handleSubmit(ev) {
    ev.preventDefault()
    setFilter(filterByToEdit)
    const params = buildSearchParams(filterByToEdit)
    setSearchParams(params)
    clearActiveFilterCell()
    onPopoverComplete?.()
  }

  return (
    <div className={`search-bar ${mini ? "mini" : "expanded"}`}>
      {mini ? (
        <div className="filter-pill">
          <button
            type="button"
            className="chip"
            onClick={() => { onRequestExpand?.(); setActiveFilterCell("where") }}
          >
            <span className="icon">🏠</span> {storeFilter.address ? storeFilter.address : "Anywhere"}
          </button>

          <button
            type="button"
            className="chip"
            onClick={() => { onRequestExpand?.(); setActiveFilterCell("checkin") }}
          >
            {formatDateForDisplay(storeFilter.checkIn) || "Anytime"}
          </button>

          <div className="who-serach">
            <button
              type="button"
              className="chip"
              onClick={() => { onRequestExpand?.(); setActiveFilterCell("who") }}
            >
              {formatGuestsLabel(storeFilter.guests)}
            </button>

            <button
              type="button"
              className="search-btn"
              onClick={() => { onRequestExpand?.(); setActiveFilterCell("who") }}
              aria-label="Search"
            >
              <img src={searchIcon} alt="search icon" className="loupe" width={14} />
            </button>
          </div>
        </div>
      ) : (
        <form ref={pillElementRef} className="filter-pill" onSubmit={handleSubmit}>
          {/* WHERE */}
          <label {...getCellProps("where")}>
            <span className="title">Where</span>
            <input
              className="place-holder"
              type="text"
              placeholder="Search destinations"
              name="address"
              value={address || ""}
              onChange={handleInputChange}
              onFocus={() => getCellProps("where").onMouseDown(new MouseEvent("mousedown"))}
              autoComplete="off"
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  setfilterByToEdit(prev => ({ ...prev, address: e.currentTarget.value }));
                  goToNextCell();
                }
              }}

            />
          </label>

          {/* CHECK-IN */}
          <div {...getCellProps("checkin")}>
            <span className="title">Check in</span>
            <span className="place-holder">
              {formatDateForDisplay(checkIn) || "Add date"}
            </span>
          </div>

          {/* CHECK-OUT */}
          <div {...getCellProps("checkout")}>
            <span className="title">Check out</span>
            <span className="place-holder">
              {formatDateForDisplay(checkOut) || "Add date"}
            </span>
          </div>

          {/* WHO + Search */}
          <div {...getCellProps("who")}>
            <div className="who-search">
              <div className="cell who">
                <span className="title">Who</span>
                <span className="place-holder">{formatGuestsLabel(guests)}</span>
              </div>
              <button className="search-btn" type="submit" aria-label="Search">
                <img src={searchIcon} alt="search icon" className="loupe" width={14} />
                <span className="label">Search</span>
              </button>
            </div>
          </div>
        </form>
      )}

      {!mini && activeFilterCell && (
        <div ref={popoverElementRef} className="filter-popover">
          <DynamicPanel
            activeKey={activeFilterCell}
            registry={PANELS_BY_KEY}
            panelProps={{
              // IMPORTANT: pass the *filterByToEdit* into panels
              value: filterByToEdit,
              // Panels only update the filterByToEdit (not Redux)
              onChange: (partial) => setfilterByToEdit(prev => ({ ...prev, ...partial })),
              // Close only; do not commit here
              onAdvance: goToNextCell,
            }}
          />
        </div>
      )}
    </div>
  )
}
