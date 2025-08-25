import { Link, NavLink } from 'react-router-dom'
import { useNavigate } from 'react-router'
import { useSelector } from 'react-redux'
import { showErrorMsg, showSuccessMsg } from '../services/event-bus.service'
import { logout } from '../store/actions/user.actions'
import logo from '../assets/logo/icon-airbnb.png'
import { useHeaderControl } from '../customHooks/useHeaderControl.js'
import { StayFilter } from '../cmps/StayFilter.jsx'

export function AppHeader() {
  const user = useSelector(store => store.userModule.user)
  const navigate = useNavigate()
  const isMini = useHeaderControl(80)

  async function onLogout() {
    try {
      await logout()
      navigate('/')
      showSuccessMsg('Bye now')
    } catch (err) {
      showErrorMsg('Cannot logout')
    }
  }

  return (
    <header className={`app-header ${isMini ? 'is-mini' : 'is-expanded'} full`}>
      <nav className="nav-bar">
        <NavLink to="/stay" className="logo">
          <img src={logo} alt="" width="30" height="30" />
          <span className="brand">Sharebnb</span>
        </NavLink>

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
          <StayFilter mini={isMini} />
        </div>

        <div className="auth-link">
          {user?.isAdmin && <NavLink to="/admin" className="admin-link">Admin</NavLink>}
          {!user && <NavLink to="auth/login" className="login-link">Login</NavLink>}
          {user && (
            <div className="user-info">
              <Link to={`user/${user._id}`}>
                {user.imgUrl && <img src={user.imgUrl} alt="" />}
                {user.fullname}
              </Link>
              {user.score != null && <span className="score">{user.score.toLocaleString()}</span>}
              <button onClick={onLogout}>Logout</button>
            </div>
          )}
        </div>
      </nav>
    </header>
  )
}
