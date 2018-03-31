import React from "react";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

const NavLink = ({ label, to, activeOnlyWhenExact }) => (
  <Route
    path={to}
    exact={activeOnlyWhenExact}
    children={({ match }) => (
      <li className={match ? "active nav-item" : "nav-item"}>
        <Link to={to} className="nav-link">{label}</Link>
      </li>
    )}
  />
);
export default NavLink;
