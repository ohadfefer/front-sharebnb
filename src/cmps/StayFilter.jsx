import { setFilter } from '../store/actions/stay.actions'
import { useState } from 'react'

export function StayFilter({ mini, filterBy, onSetFilter }) {
  const [filterByToEdit, setFilterByToEdit] = useState({ ...filterBy })

  function handleChange({ target }) {
    let { value, name: field, type } = target
    if (type === 'select-multiple') {
      value = Array.from(
        target.selectedOptions,
        option => option.value || []
      )
    }
    value = type === 'number' ? +value || '' : value
    setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value }))
  }

  function onSetFilter(filterBy) {
    setFilter(filterBy)
  }

  function onSubmitFilter(ev) {
    ev.preventDefault()
    onSetFilter(filterByToEdit)
  }

  const { address, checkIn, checkOut, guests } = filterByToEdit

  return (
    <div className={`search-bar ${mini ? 'mini' : 'expanded'}`}>
      <form className="filter-pill" onSubmit={onSubmitFilter}>
        {!mini && (
          <>
            <label className="cell where">
              <span className="title">Where</span>
              <input
                type="text"
                placeholder="Search destinations"
                value={address}
                onChange={handleChange}
                name="address"
              />
            </label>

            <label className="cell checkin">
              <span className="title">Check in</span>
              <input
                type="date"
                value={checkIn}
                onChange={handleChange}
              />
            </label>

            <label className="cell checkout">
              <span className="title">Check out</span>
              <input
                type="date"
                value={checkOut}
                onChange={handleChange}
              />
            </label>

            <label className="cell who">
              <span className="title">Who</span>
              <input
                type="number"
                min="1"
                value={guests}
                onChange={handleChange}
                placeholder="Add guests"
              />
            </label>
          </>
        )}

        {mini && (
          <>
            <button type="button" className="chip">
              <span className="icon">🏠</span> Anywhere
            </button>
            <button type="button" className="chip">Anytime</button>
            <button type="button" className="chip">Add guests</button>
          </>
        )}

        <button className="search-btn" aria-label="Search" type="submit">
          <span className="loupe">🔍</span>
        </button>
      </form>
    </div>
  )
}
