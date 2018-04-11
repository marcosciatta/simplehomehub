import React from 'react'
import { Link } from 'react-router-dom'
import NavLink from './utils/navLink'

// The Header creates links that can be used to navigate
// between routes.
const Header = () => (
  <header>
    <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
      <a className="navbar-brand" href="#">Simple Home Hub</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav mr-auto">
          <NavLink activeOnlyWhenExact={true} to="/" label="Home Control"/>
          <NavLink to="/components" label="Components"/>
          <NavLink to="/test" label="About"/>
        </ul>
      </div>
    </nav>
  </header>
)

export default Header
