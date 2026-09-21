import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link
          to="/"
          className="navbar__brand"
          onClick={closeMenu}
        >
          <span className="navbar__mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>

          <span className="navbar__brand-text">
            AI Voice Receptionist
          </span>
        </Link>

        <nav
          className={`navbar__links ${
            menuOpen ? "navbar__links--open" : ""
          }`}
          aria-label="Primary"
        >
          <a href="#how-it-works" onClick={closeMenu}>
            How it works
          </a>

          <a href="#capabilities" onClick={closeMenu}>
            What it does
          </a>

          <div className="navbar__mobile-actions">
            <Link
              to="/login"
              className="navbar__login"
              onClick={closeMenu}
            >
              Log in
            </Link>

            <Link
              to="/signup"
              className="navbar__cta"
              onClick={closeMenu}
            >
              Get started
            </Link>
          </div>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">
            Log in
          </Link>

          <Link to="/signup" className="navbar__cta">
            Get started
          </Link>
        </div>

        <button
          type="button"
          className={`navbar__menu ${
            menuOpen ? "navbar__menu--open" : ""
          }`}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </div>
    </header>
  );
}

export default Navbar;