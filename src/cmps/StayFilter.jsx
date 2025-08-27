import { useDispatch, useSelector } from "react-redux"
import { setFilter } from "../store/actions/stay.actions"
import { useFieldControl } from "../customHooks/useFieldControl.js"
import { DynamicPanel } from "./DynamicPanel"
import { PANELS_BY_KEY } from "../services/helpers/registry.jsx"
import { parseISO, isValid, format as formatDate } from "date-fns"
import searchIcon from "../assets/logo/icons/search.svg"

function formatDateForDisplay(isoString) {
  if (!isoString) return ""
  const parsedDate = parseISO(isoString)
  return isValid(parsedDate) ? formatDate(parsedDate, "MMM d") : ""
}

export function StayFilter({ mini }) {
  const dispatch = useDispatch()
  const filterBy = useSelector((state) => state.stayModule.filterBy)
  const { address, checkIn, checkOut, guests } = filterBy

  const fieldOrder = ["where", "checkin", "checkout", "who"]
  const {
    activeFilterCell,
    getCellProps,
    clearActiveFilterCell,
    pillElementRef,
    popoverElementRef,
  } = useFieldControl(fieldOrder, { enableOutsideClickClose: true })

  function handleInputChange(event) {
    const { name, type } = event.target
    let { value } = event.target
    if (type === "number") value = Number(value) || ""
    dispatch(setFilter({ [name]: value }))
  }

  function handleSubmit(formEvent) {
    formEvent.preventDefault()
    // trigger search here if needed
  }

  return (
    <div className={`search-bar ${mini ? "mini" : "expanded"}`}>
        {mini ? (
          <div className="filter-pill">
            <button type="button" className="chip"><span className="icon">🏠</span> Anywhere</button>
            <button type="button" className="chip">Anytime</button>
            <button type="button" className="chip">Add guests</button>
            <button type="button" className="search-btn">
              <img src={searchIcon} alt="search icon" className="loupe" width={14} />
            </button>
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

            <div className="vertical-divider" />

            {/* CHECK-IN */}
            <div {...getCellProps("checkin")}>
              <span className="title">Check in</span>
              <span className="place-holder">
                {formatDateForDisplay(checkIn) || "Add date"}
              </span>
            </div>

            <div className="vertical-divider" />

            {/* CHECK-OUT */}
            <div {...getCellProps("checkout")}>
              <span className="title">Check out</span>
              <span className="place-holder">
                {formatDateForDisplay(checkOut) || "Add date"}
              </span>
            </div>

            <div className="vertical-divider" />

            {/* WHO + Search */}
            <div {...getCellProps("who")}>
              <div className="who-search">
                <div className="cell who">
                  <span className="title">Who</span>
                  <span className="place-holder">Add guests</span>
                </div>
                <button className="search-btn" type="submit" aria-label="Search">
                  <img src={searchIcon} alt="search icon" className="loupe" width={14} />
                  <span className="label">Search</span>
                </button>
              </div>
            </div>
          </form>
        )}

        {/* Popup under the pill */}
        {!mini && activeFilterCell && (
          <div ref={popoverElementRef} className="filter-popover">
            <DynamicPanel
              activeKey={activeFilterCell}
              registry={PANELS_BY_KEY}
              panelProps={{
                value: { checkIn, checkOut, guests, address },
                onChange: (partialFilter) => dispatch(setFilter(partialFilter)),
                onComplete: () => clearActiveFilterCell(),
              }}
            />
          </div>
        )}
      </div>
  )
}
