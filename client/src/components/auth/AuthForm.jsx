import { useState } from "react";
import { ArrowLeft, ArrowRight, Loader2, ShieldCheck, UserPlus } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { INITIAL_SIGNUP_FORM } from "../../constants/loan";
import { Brand } from "../ui/Brand";

export function AuthForm({ initialMode = "login", onBack }) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState(initialMode);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState(INITIAL_SIGNUP_FORM);

  function updateField(event) {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (mode === "login") {
        await login({
          email: form.email,
          password: form.password,
        });
      } else {
        await signup(form);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="auth-page">
      <nav className="public-nav auth-nav">
        <Brand compact />
        <button className="button ghost" type="button" onClick={onBack}>
          <ArrowLeft size={18} /> Back
        </button>
      </nav>

      <section className="auth-panel centered">
        <div className="auth-panel-heading">
          <p className="eyebrow">{mode === "login" ? "Welcome back" : "Start borrowing"}</p>
          <h1>{mode === "login" ? "Sign in to TemmyLoans" : "Create your TemmyLoans profile"}</h1>
          <p>
            {mode === "login"
              ? "Access your loans, schedules, repayments, and admin tools."
              : "Create a borrower profile so eligibility, schedules, and repayments can be managed cleanly."}
          </p>
        </div>

        <div className="segmented-control" aria-label="Authentication mode">
          <button className={mode === "login" ? "active" : ""} onClick={() => setMode("login")} type="button">
            <ShieldCheck size={16} /> Login
          </button>
          <button className={mode === "signup" ? "active" : ""} onClick={() => setMode("signup")} type="button">
            <UserPlus size={16} /> Sign up
          </button>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          {mode === "signup" && (
            <>
              <label>
                Full name
                <input name="fullName" value={form.fullName} onChange={updateField} required />
              </label>
              <label>
                Username
                <input name="username" value={form.username} onChange={updateField} required />
              </label>
            </>
          )}

          <label>
            Email
            <input type="email" name="email" value={form.email} onChange={updateField} required />
          </label>
          <label>
            Password
            <input type="password" name="password" value={form.password} onChange={updateField} required />
          </label>

          {mode === "signup" && (
            <>
              <div className="form-grid">
                <label>
                  Date of birth
                  <input type="date" name="dateOfBirth" value={form.dateOfBirth} onChange={updateField} required />
                </label>
                <label>
                  Phone number
                  <input name="phoneNumber" placeholder="+2348012345678" value={form.phoneNumber} onChange={updateField} required />
                </label>
              </div>
              <label>
                Street
                <input name="street" value={form.street} onChange={updateField} />
              </label>
              <div className="form-grid">
                <label>
                  City
                  <input name="city" value={form.city} onChange={updateField} />
                </label>
                <label>
                  State
                  <input name="state" value={form.state} onChange={updateField} />
                </label>
              </div>
            </>
          )}

          {error && <p className="form-error">{error}</p>}

          <button className="button primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <ArrowRight size={18} />}
            {mode === "login" ? "Enter dashboard" : "Create borrower account"}
          </button>
        </form>
      </section>
    </main>
  );
}
