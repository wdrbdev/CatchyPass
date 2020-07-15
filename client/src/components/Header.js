import React from "react";
import logo from "../logo.png";

const Header = () => {
  return (
    <nav
      className="navbar is-primary container"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={logo} alt="CatchyPass" width="auto" height="100%" />
          <strong className="is-size-4 px-1">CatchyPass</strong>
        </a>
        <div className="navbar-burger burger">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
            <a
              className="navbar-link"
              href="https://bulma.io/documentation/overview/start/"
            >
              Docs
            </a>
            <div className="navbar-dropdown">
              <a className="navbar-item" href="/tutorial">
                Tutorial
              </a>
              <a className="navbar-item" href="/about">
                About
              </a>
            </div>
          </div>
        </div>
        <div className="navbar-end"></div>
      </div>
    </nav>
  );
};

export default Header;
