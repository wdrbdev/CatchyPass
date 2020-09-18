import React, { useEffect } from "react";
import logo from "../logo.png";

const Header = () => {
  /*
   * Activate navbar-burger
   * https://bulma.io/documentation/components/navbar/
   */
  useEffect(() => {
    document.addEventListener("DOMContentLoaded", () => {
      // Get all "navbar-burger" elements
      const $navbarBurgers = Array.prototype.slice.call(
        document.querySelectorAll(".navbar-burger"),
        0
      );

      // Check if there are any navbar burgers
      if ($navbarBurgers.length > 0) {
        // Add a click event on each of them
        $navbarBurgers.forEach((el) => {
          el.addEventListener("click", () => {
            // Get the target from the "data-target" attribute
            const target = el.dataset.target;
            const $target = document.getElementById(target);

            // Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
            el.classList.toggle("is-active");
            $target.classList.toggle("is-active");
          });
        });
      }
    });
  });

  return (
    <nav
      className="navbar is-primary container"
      role="navigation"
      aria-label="main navigation"
    >
      <div className="navbar-brand">
        <a className="navbar-item" href="/">
          <img src={logo} alt="CatchyPass" width="auto" height="100%" />
          <strong id="project-name" className="is-size-4 px-1">
            CatchyPass
          </strong>
        </a>
        <div className="navbar-burger burger" data-target="navMenu">
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
      <div id="navMenu" className="navbar-menu">
        <div className="navbar-start">
          <div className="navbar-item has-dropdown is-hoverable">
            <a className="navbar-link" href="#">
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
