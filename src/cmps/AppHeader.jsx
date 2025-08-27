import { NavLink } from "react-router-dom"
import { useSelector } from "react-redux"
import { useState } from "react"

import logo from '../assets/logo/icon-airbnb.png'
import hamburger from '../assets/logo/icons/hamburger.svg'
import language from '../assets/logo/icons/language.svg'

import { useHeaderControl } from '../customHooks/useHeaderControl.js'
import { StayFilter } from '../cmps/StayFilter.jsx'

export function AppHeader() {
  const { filterBy } = useSelector(state => state.stayModule)

  const { mini: miniFromHook, sticky } = useHeaderControl(80, {
    forceMiniOnMatch: "/stay/:id",
    hysteresisPx: 12,
  })

  // Manual override: when null, follow hook; when boolean, force value
  const [manualMini, setManualMini] = useState(null)
  const mini = manualMini ?? miniFromHook

  // Called by StayFilter when user clicks a mini chip
  function handleRequestExpand() {
    setManualMini(false)          // expand header
  }

  // When the popover finishes (user chosen/closed), give control back to the hook
  function handlePopoverComplete() {
    setManualMini(null)
  }

  return (
    <header className={`app-header ${mini ? 'is-mini' : 'is-expanded'} ${sticky ? 'is-sticky' : 'is-unset'} full`}>
      <nav className="nav-bar">
        <NavLink to="/stay" className="logo">
          <img src={logo} alt="" width={30} height={30} />
          <span className="brand">Sharebnb</span>
        </NavLink>

        <div className="side-links">
          <a>Become a host</a>
          <img src={language} alt="" width={40} className='language-btn' />
          <img src={hamburger} alt="" width={40} className='hamburger-btn' />
        </div>

        <div>
          {!mini && (
            <div className="nav-links">
              <NavLink to="about">🏠 <span>Homes</span></NavLink>
              <NavLink to="stay">🪂 <span>Experiences</span></NavLink>
              <NavLink to="chat">🛎️ <span>Services</span></NavLink>
            </div>
          )}

          <div className='filter'>
            <StayFilter
              mini={mini}
              filterBy={filterBy}
              onRequestExpand={handleRequestExpand}
              onPopoverComplete={handlePopoverComplete}
            />
          </div>
        </div>
      </nav>
    </header>
  )
}
