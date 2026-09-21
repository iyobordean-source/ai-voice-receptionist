import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import "./Login.css";

const FEATURES = [
  "Answers every incoming call",
  "Understands what the customer needs",
  "Creates orders and appointments automatically",
];

function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address";
    }
    if (!form.password) {
      nextErrors.password = "Enter your password";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      // Auth wiring comes later — this only validates the form for now.
      console.log("Login form submitted", form);
    }
  }

  return (
    <>
      <div className="auth-page">
        <aside className="auth-brand">
          <Link to="/" className="auth-brand__logo">
            <span className="auth-brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            AI Voice Receptionist
          </Link>

          <div className="auth-brand__content">
            <h2 className="auth-brand__title">Every call answered. Every request handled.</h2>
            <ul className="auth-brand__list">
              {FEATURES.map((feature) => (
                <li key={feature}>
                  <span className="auth-brand__bullet" aria-hidden="true" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>
        </aside>

        <main className="auth-form-wrap">
          <Link to="/" className="auth-form-wrap__logo">
            <span className="auth-brand__mark" aria-hidden="true">
              <span />
              <span />
              <span />
              <span />
            </span>
            AI Voice Receptionist
          </Link>

          <form className="auth-form" onSubmit={handleSubmit} noValidate>
            <h1 className="auth-form__title">Log in</h1>
            <p className="auth-form__subtitle">Welcome back — enter your details to continue.</p>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                value={form.email}
                onChange={handleChange}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={errors.email ? "email-error" : undefined}
              />
              {errors.email && (
                <span className="auth-field__error" id="email-error">
                  {errors.email}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="auth-field__password">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={form.password}
                  onChange={handleChange}
                  aria-invalid={Boolean(errors.password)}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  className="auth-field__toggle"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && (
                <span className="auth-field__error" id="password-error">
                  {errors.password}
                </span>
              )}
            </div>

            <div className="auth-form__row">
              <label className="auth-checkbox">
                <input type="checkbox" name="remember" />
                Remember me
              </label>
              <a href="#" className="auth-form__forgot">
                Forgot password?
              </a>
            </div>

            <button type="submit" className="button button--primary auth-form__submit">
              Log in
            </button>

            <p className="auth-form__switch">
              Don't have an account? <Link to="/signup">Sign up</Link>
            </p>
          </form>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Login;