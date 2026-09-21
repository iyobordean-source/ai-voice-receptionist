import { Link } from "react-router-dom";
import "./Navbar.css";

function Navbar() {
  return (
    <header className="navbar">
      <div className="container navbar__inner">
        <Link to="/" className="navbar__brand">
          <span className="navbar__mark" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
          AI Voice Receptionist
        </Link>

        <nav className="navbar__links" aria-label="Primary">
          <a href="#how-it-works">How it works</a>
          <a href="#capabilities">What it does</a>
        </nav>

        <div className="navbar__actions">
          <Link to="/login" className="navbar__login">
            Log in
          </Link>
          <Link to="/signup" className="navbar__cta">
            Get started
          </Link>
        </div>
      </div>
    </header>
  );
}

export default Navbar;