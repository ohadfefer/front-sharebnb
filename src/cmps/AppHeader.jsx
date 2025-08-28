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

  const [manualMini, setManualMini] = useState(null)
  const mini = manualMini ?? miniFromHook

  function handleRequestExpand() {
    setManualMini(false)
  }

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

        <div className="header-main">
          {!mini && (
            <div className="nav-links">
              <NavLink to="stay"><span className="nav-icon">🏠  </span><span className="nav-text">Homes</span></NavLink>
              <NavLink to="about"><span className="nav-icon">🪂  </span><span className="nav-text">Experiences</span></NavLink>
              <NavLink to="chat"><span className="nav-icon">🛎️  </span><span className="nav-text">Services</span></NavLink>
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
