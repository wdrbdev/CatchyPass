import React, { useState } from "react";
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
          <img src={logo} alt="CatchyPass" width="100%" height="48px" />
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
              <a
                className="navbar-item"
                href="https://bulma.io/documentation/overview/start/"
              >
                Tutorial
              </a>
              <a
                className="navbar-item"
                href="https://bulma.io/documentation/overview/modifiers/"
              >
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
