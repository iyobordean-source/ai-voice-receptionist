import { useState } from "react";
import { Link } from "react-router-dom";
import Footer from "../components/Footer.jsx";
import "./Signup.css";

const FEATURES = [
  "Answers every incoming call",
  "Understands what the customer needs",
  "Creates orders and appointments automatically",
];

function Signup() {
  const [form, setForm] = useState({
    name: "",
    businessName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  }

  function handleSubmit(event) {
    event.preventDefault();

    const nextErrors = {};
    if (!form.name.trim()) {
      nextErrors.name = "Enter your full name";
    }
    if (!form.businessName.trim()) {
      nextErrors.businessName = "Enter your business name";
    }
    if (!form.email.trim()) {
      nextErrors.email = "Enter your email address";
    }
    if (!form.password) {
      nextErrors.password = "Create a password";
    } else if (form.password.length < 8) {
      nextErrors.password = "Password must be at least 8 characters";
    }
    if (form.confirmPassword !== form.password) {
      nextErrors.confirmPassword = "Passwords don't match";
    }
    setErrors(nextErrors);

    if (Object.keys(nextErrors).length === 0) {
      // Auth wiring comes later — this only validates the form for now.
      console.log("Signup form submitted", form);
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
            <h2 className="auth-brand__title">Set up your business in a few minutes.</h2>
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
            <h1 className="auth-form__title">Create your account</h1>
            <p className="auth-form__subtitle">Get your business ready to answer every call.</p>

            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                value={form.name}
                onChange={handleChange}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
              />
              {errors.name && (
                <span className="auth-field__error" id="name-error">
                  {errors.name}
                </span>
              )}
            </div>

            <div className="auth-field">
              <label htmlFor="businessName">Business name</label>
              <input
                id="businessName"
                name="businessName"
                type="text"
                autoComplete="organization"
                value={form.businessName}
                onChange={handleChange}
                aria-invalid={Boolean(errors.businessName)}
                aria-describedby={errors.businessName ? "businessName-error" : undefined}
              />
              {errors.businessName && (
                <span className="auth-field__error" id="businessName-error">
                  {errors.businessName}
                </span>
              )}
            </div>

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
                  autoComplete="new-password"
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

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                value={form.confirmPassword}
                onChange={handleChange}
                aria-invalid={Boolean(errors.confirmPassword)}
                aria-describedby={errors.confirmPassword ? "confirmPassword-error" : undefined}
              />
              {errors.confirmPassword && (
                <span className="auth-field__error" id="confirmPassword-error">
                  {errors.confirmPassword}
                </span>
              )}
            </div>

            <button type="submit" className="button button--primary auth-form__submit">
              Create account
            </button>

            <p className="auth-form__switch">
              Already have an account? <Link to="/login">Log in</Link>
            </p>
          </form>
        </main>
      </div>

      <Footer />
    </>
  );
}

export default Signup;