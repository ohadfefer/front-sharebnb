import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'

import logo from '../assets/logo/icon-airbnb.png'
import hamburger from '../assets/logo/icons/hamburger.svg'
import language from '../assets/logo/icons/language.svg'

import { useHeaderControl } from '../customHooks/useHeaderControl.js'
import { StayFilter } from '../cmps/StayFilter.jsx'
import { useState } from 'react'
export function AppHeader() {

  const { filterBy } = useSelector(storeState => storeState.stayModule)

  const navigate = useNavigate()

  const isMini = useHeaderControl(80, { throttleMs: 80, hysteresisPx: 12 })

  return (
    <header className={`app-header ${isMini ? 'is-mini' : 'is-expanded'} full`}>
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

          {
            !isMini ?
              <div className="nav-links">
                <NavLink to="about">🏠 <span>Homes</span></NavLink>
                <NavLink to="stay">🪂 <span>Experiences</span></NavLink>
                <NavLink to="chat">🛎️ <span>Services</span></NavLink>
              </div> :
              ''
          }
          <div className='filter'>
            <StayFilter mini={isMini} filterBy={filterBy} />
          </div>
        </div>
      </nav>
    </header>
  )
}
