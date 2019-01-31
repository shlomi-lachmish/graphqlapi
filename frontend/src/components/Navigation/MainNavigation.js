import React from "react";
import { NavLink } from "react-router-dom";
import "./MainNavigation.css";
import AuthContext from "./../../context/auth-context";

const mainNavigation = props => (
  <AuthContext.Consumer>
    {context => {
      return (
        <header className="main-navigation">
          <div className="main-navigation__logo">
            <h1>EasyEvent</h1>
          </div>
          <nav className="top-navigation">
            <ul className="main-navigation__items">
              {!context.token && (
                <li className="main-navigation__item">
                  <NavLink to="/auth">Authenticate</NavLink>
                </li>
              )}
              <li className="main-navigation__item">
                <NavLink to="/events">Events</NavLink>
              </li>
              {context.token && (
                <li className="main-navigation__item">
                  <NavLink to="/bookings">Bookings</NavLink>
                </li>
              )}
            </ul>
            {context.token && (
              <button
                className="main-navigation__item"
                onClick={context.logout}
              >
                LogOut
              </button>
            )}
          </nav>
        </header>
      );
    }}
  </AuthContext.Consumer>
);

export default mainNavigation;
