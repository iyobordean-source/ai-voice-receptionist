import { useState } from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  const closeMenu = () => setMenuOpen(false);

  return (
    <nav className="navbar">
      <div className="navbar__inner">
        <Link to="/" className="navbar__brand" onClick={closeMenu}>
          AI Voice Receptionist
        </Link>

        <button
          className={`navbar__menu ${menuOpen ? "is-open" : ""}`}
          type="button"
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>

        <div className={`navbar__links ${menuOpen ? "is-open" : ""}`}>
          <a href="#how-it-works" onClick={closeMenu}>
            How it works
          </a>

          <a href="#who-its-for" onClick={closeMenu}>
            Who it's for
          </a>
        </div>

        <div className="navbar__actions">
          <Link to="/dashboard" className="navbar__dashboard">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;