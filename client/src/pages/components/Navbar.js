import React from "react"
import { Link } from "react-router-dom"

const Navbar = () => {
  return (
    <nav className="navbar navbar-fixed-bottom navbar-light bg-light fixed-bottom justify-content-center">
      <ul className="nav">
        <li className="nav-item">
          <Link to="/" className="nav-link">
            {/* <RiHomeLine /> Home */} Home
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/explore" className="nav-link">
            {/* <RiCompass3Line /> Explore */} Explore
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/upload" className="nav-link">
            {/* <RiAddLine /> Upload */} Upload
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/notifications" className="nav-link">
            {/* <RiHeartLine /> Notifications */} Notifications
          </Link>
        </li>
        <li className="nav-item">
          <Link to="/profile" className="nav-link">
            {/* <RiUserLine /> Profile */} Profile
          </Link>
        </li>
      </ul>
    </nav>
  )
}

export default Navbar
