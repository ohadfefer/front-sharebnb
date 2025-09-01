// src/cmps/AppHeader/AppHeaderMobile.jsx
import { useSelector } from "react-redux"
import { useState, useEffect } from "react"
import { useLocation, NavLink } from "react-router-dom"

import { formatGuestsLabel } from "../services/util.service"
import logo from '../assets/logo/sharebnb-logo.svg'
import hamburger from '../assets/logo/icons/hamburger.svg'
import { FilterSheet } from "./FilterSheet.jsx"


function useCenterActiveTab() {
    const { pathname } = useLocation()
    useEffect(() => {
        const scroller = document.querySelector(".nav-links")
        const active = document.querySelector(".nav-links a.active")
        if (!scroller || !active) return
        active.scrollIntoView({ behavior: "instant", inline: "center", block: "nearest" })
    }, [pathname])
}

export function AppHeaderMobile() {
    const filterBy = useSelector(s => s.stayModule.filterBy)
    const user = useSelector(s => s.userModule.user)
    const [open, setOpen] = useState(false)

    const address = filterBy?.address || "Anywhere"
    const dates = (filterBy?.checkIn && filterBy?.checkOut)
        ? new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' })
            .formatRange(new Date(filterBy.checkIn), new Date(filterBy.checkOut))
        : "Anytime"
    const guests = formatGuestsLabel(filterBy?.guests) || "Add guests"

    return (
        <header className="m-header full">
            <nav className="m-header__bar">
                <img src={logo} alt="Sharebnb" className="m-header__logo" width={28} height={28} />

                <button
                    type="button"
                    className="m-search-pill"
                    onClick={() => setOpen(true)}
                    aria-expanded={open ? "true" : "false"}
                    aria-controls="filter-sheet"
                >
                    <span className="pill-primary">{address}</span>
                    <span className="pill-dot">•</span>
                    <span className="pill-secondary">{dates}</span>
                    <span className="pill-dot">•</span>
                    <span className="pill-secondary">{guests}</span>
                </button>

                <button type="button" className="m-header__menu">
                    {user?.imgUrl
                        ? <img src={user.imgUrl} alt="" className="m-header__avatar" />
                        : <img src={hamburger} alt="" width={22} height={22} />}
                </button>
            </nav>

            {open && (
                <FilterSheet
                    id="filter-sheet"
                    initial={filterBy}
                    onClose={() => setOpen(false)}
                />
            )}
            <div className="nav-links">
                <NavLink to="stay">
                    <img
                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/b5a7ef95-2d3a-4aaa-b9d7-6f8c4a91aa2d.png"
                        alt=""
                        className="nav-icon"
                    />
                    <span className="nav-text">Homes</span>
                </NavLink>

                <NavLink to="about">
                    <img
                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/02579423-5d4b-4c71-bedb-0ea18cd293f8.png"
                        alt=""
                        className="nav-icon"
                    />
                    <span className="nav-text">Experiences</span>
                </NavLink>

                <NavLink to="chat">
                    <img
                        src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-ActivitySetup/original/1de966ec-197f-4b72-bbb1-cf4c91876dfa.png"
                        alt=""
                        className="nav-icon"
                    />
                    <span className="nav-text">Services</span>
                </NavLink>
            </div>
        </header>
    )
}
