import {
  BadgeCheck,
  CalendarClock,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  WalletCards,
} from "lucide-react";
import { Brand } from "../ui/Brand";

export function LandingPage({ onAuth }) {
  return (
    <main className="landing-page">
      <nav className="public-nav">
        <Brand compact />
        <div className="public-nav-links">
          <a href="#benefits">Benefits</a>
          <a href="#trust">Trust</a>
          <button className="button ghost" type="button" onClick={() => onAuth("login")}>
            Login
          </button>
          <button className="button primary" type="button" onClick={() => onAuth("signup")}>
            Sign up
          </button>
        </div>
      </nav>

      <section className="landing-hero">
        <div className="hero-story">
          <p className="eyebrow">Fast credit for everyday Nigerians</p>
          <h1>Instant loan decisions, flexible repayments, and clean money tracking.</h1>
          <p>
            TemmyLoans helps customers apply for credit, track repayment schedules, and build a
            stronger borrowing profile without paperwork, queues, or confusing fees.
          </p>
          <div className="hero-actions">
            <button className="button light" type="button" onClick={() => onAuth("signup")}>
              <Sparkles size={18} /> Get started
            </button>
            <button className="button outline-light" type="button" onClick={() => onAuth("login")}>
              Login
            </button>
            <span className="hero-note">No collateral. Simple schedules. Built for local lending.</span>
          </div>
        </div>

        <div className="phone-showcase" aria-label="TemmyLoans app preview">
          <div className="money-card main-card">
            <span>Available loan</span>
            <strong>₦850,000</strong>
            <small>Approval estimate: 5 mins</small>
          </div>
          <div className="app-phone">
            <div className="phone-bar" />
            <div className="phone-balance">
              <span>Wallet balance</span>
              <strong>₦124,600</strong>
            </div>
            <div className="quick-grid">
              <span>Apply</span>
              <span>Repay</span>
              <span>Schedule</span>
              <span>Support</span>
            </div>
            <div className="repayment-mini">
              <span>Next repayment</span>
              <strong>₦28,400</strong>
              <small>Due 12 Jun</small>
            </div>
          </div>
          <div className="money-card floating-card">
            <span>Credit score</span>
            <strong>742</strong>
            <small>Limit grows with timely repayment</small>
          </div>
        </div>
      </section>

      <section className="landing-section" id="benefits">
        <div className="benefit-card">
          <ShieldCheck size={22} />
          <h3>Secure borrower access</h3>
          <p>JWT-backed sessions and role-based flows for borrowers and admins.</p>
        </div>
        <div className="benefit-card">
          <CalendarClock size={22} />
          <h3>Flexible repayment plans</h3>
          <p>Clear repayment schedules, partial payments, and loan balance tracking.</p>
        </div>
        <div className="benefit-card">
          <BadgeCheck size={22} />
          <h3>Admin approval workflow</h3>
          <p>Review applications, approve loans, and manage lifecycle statuses.</p>
        </div>
      </section>

      <section className="trust-strip" id="trust" aria-label="Trust signals">
        <div>
          <strong>₦3m</strong>
          <span>Loan ceiling concept</span>
        </div>
        <div>
          <strong>5 min</strong>
          <span>Fast decision cue</span>
        </div>
        <div>
          <strong>CBN-ready</strong>
          <span>Compliance-first design</span>
        </div>
        <div>
          <strong>24/7</strong>
          <span>Digital access</span>
        </div>
      </section>

      <section className="money-band">
        <div>
          <p className="eyebrow">Built for a real loan backend</p>
          <h2>From application to repayment, every state has a clean screen.</h2>
        </div>
        <div className="money-band-icons" aria-label="Product capabilities">
          <span>
            <WalletCards size={20} /> Loans
          </span>
          <span>
            <TrendingUp size={20} /> Limits
          </span>
          <span>
            <CalendarClock size={20} /> Schedules
          </span>
        </div>
      </section>
    </main>
  );
}
