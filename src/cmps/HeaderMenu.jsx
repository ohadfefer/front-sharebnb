// src/cmps/HeaderMenu.jsx
import { useEffect, useRef } from "react"
import { useNavigate } from 'react-router-dom'
import homeIcon from '../assets/imgs/home-airbnb.png'

export function HeaderMenu({ open, onClose, anchorRef }) {
    const ref = useRef(null)
    const navigate = useNavigate()

    // Close on outside click / Esc
    useEffect(() => {
        if (!open) return
        const onDown = (event) => {
            if (ref.current?.contains(event.target)) return
            if (anchorRef?.current?.contains(event.target)) return
            onClose?.()
        }
        return () => {
            document.removeEventListener("mousedown", onDown)
        }
    }, [open, onClose, anchorRef])

    if (!open) return null

    return (
        <div ref={ref} className="header-menu" role="menu" id="header-menu">
            <div className="menu-header">
                <span className="menu-icon">?</span>
                <span className="menu-header-text">Help Center</span>
            </div>

            <hr />

            <button className="menu-row" role="menuitem" onClick={onClose}>
                <div className="menu-row-text">
                    <div className="menu-title">Become a host</div>
                    <div className="menu-sub">It's easy to start hosting and earn extra income.</div>
                </div>
                <img src={homeIcon} alt="" />
            </button>

            <hr />

            <button className="menu-row" role="menuitem" onClick={onClose}>Refer a Host</button>
            <button className="menu-row" role="menuitem" onClick={onClose}>Find a co-host</button>
            <button className="menu-row" role="menuitem" onClick={onClose}>Gift cards</button>

            <hr />

            <div className="menu-auth-rows">
                <button className="menu-row" role="menuitem" onClick={() => { navigate('/auth/login'); onClose?.() }}>Log in</button>
                <button className="menu-row" role="menuitem" onClick={() => { navigate('/auth/signup'); onClose?.() }}>Sign up</button>
            </div>
        </div>
    );
}
