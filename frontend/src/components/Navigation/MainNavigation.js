import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";

const mainNavigation = props => (
  <header className="main-navigation">
    <div className="main-navigation__logo">
      <h1>EasyEvent</h1>
    </div>
    <nav>
      <ul className="main-navigation__items">
        <li className="main-navigation__item">
          <NavLink to="/auth">Authenticate</NavLink>
        </li>
        <li className="main-navigation__item">
          <NavLink to="/events">Events</NavLink>
        </li>
        <li className="main-navigation__item">
          <NavLink to="/bookings">Bookings</NavLink>
        </li>
      </ul>
    </nav>
  </header>
);

export default mainNavigation;
