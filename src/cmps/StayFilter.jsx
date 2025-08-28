import { useEffect, useRef } from "react"
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

  const filterBy = useSelector((state) => state.stayModule.filterBy)
  const { address, checkIn, checkOut, guests } = filterBy

  // On first render: hydrate Redux from URL (if present)
  useEffect(() => {
    if ([...searchParams.keys()].length === 0) return
    const fromUrl = parseSearchParams(searchParams)
    if (Object.keys(fromUrl).length) dispatch(setFilter(fromUrl))
  }, [])

  const fieldOrder = ["where", "checkin", "checkout", "who"]

  const {
    activeFilterCell,
    getCellProps,
    clearActiveFilterCell,
    pillElementRef,
    popoverElementRef,
    setActiveFilterCell,
  } = useFieldControl(fieldOrder, { enableOutsideClickClose: true })

  const guestsLabel = (() => {
    if (typeof guests === "number") return guests ? `${guests} guests` : "Add guests"
    const total = Object.values(guests || {}).reduce((a, b) => a + (Number(b) || 0), 0)
    return total ? `${total} guests` : "Add guests"
  })()


  function handleInputChange(event) {
    const { name, type } = event.target
    let { value } = event.target
    if (type === "number") value = Number(value) || ""
    dispatch(setFilter({ [name]: value }))
  }

  function handleSubmit(ev) {
    ev.preventDefault()
    const params = buildSearchParams(filterBy)
    setSearchParams(params)
    clearActiveFilterCell()
  }


  return (
    <div className={`search-bar ${mini ? "mini" : "expanded"}`}>
      {mini ? (
        <div className="filter-pill">
          <button type="button"
            className="chip"
            onClick={() => { onRequestExpand?.(); setActiveFilterCell("where"); }}>
            <span className="icon">🏠</span> Anywhere
          </button>

          <button type="button"
            className="chip"
            onClick={() => { onRequestExpand?.(); setActiveFilterCell("checkin"); }}>
            {formatDateForDisplay(checkIn) || "Anytime"}
          </button>

          <div className="who-serach">
            <button type="button"
              className="chip"
              onClick={() => {
                onRequestExpand?.()
                setActiveFilterCell("who")
              }}>
              {guestsLabel}
            </button>

            <button type="button"
              className="search-btn"
              onClick={() => { onRequestExpand?.(); setActiveFilterCell("who"); }}
              aria-label="Search">
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
              value: { checkIn, checkOut, guests, address },
              onChange: (partialFilter) => dispatch(setFilter(partialFilter)),
              onComplete: () => {
                clearActiveFilterCell()
                onPopoverComplete?.()   // tell header we're done; restore scroll control
              },
            }}
          />
        </div>
      )}
    </div>
  )
}
