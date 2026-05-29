import { useState } from "react";
import { Banknote, ClipboardList, CreditCard, Landmark, LayoutDashboard, LogOut, Menu } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { titleCase } from "../../lib/format";
import { Dashboard } from "../../pages/Dashboard";
import { ApplyLoan } from "../../pages/ApplyLoan";
import { RepayLoan } from "../../pages/RepayLoan";
import { AdminLoans } from "../../pages/AdminLoans";

export function AppShell() {
  const { user, logout } = useAuth();
  const [view, setView] = useState("dashboard");
  const [menuOpen, setMenuOpen] = useState(false);

  const isAdmin = user?.role === "ADMIN";
  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
    !isAdmin && { id: "apply", label: "Apply", icon: Banknote },
    !isAdmin && { id: "repay", label: "Repay", icon: CreditCard },
    isAdmin && { id: "admin", label: "Admin Review", icon: ClipboardList },
  ].filter(Boolean);

  return (
    <main className="app-shell">
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>
        <div className="sidebar-brand">
          <div className="brand-mark">
            <Landmark size={22} />
          </div>
          <div>
            <strong>TemmyLoans</strong>
          </div>
        </div>

        <nav className="sidebar-nav" aria-label="Dashboard navigation">
          {navItems.map((item) => (
            <button
              key={item.id}
              type="button"
              className={view === item.id ? "active" : ""}
              onClick={() => {
                setView(item.id);
                setMenuOpen(false);
              }}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button className="logout-button" type="button" onClick={logout}>
          <LogOut size={18} /> Sign out
        </button>
      </aside>

      <section className="workspace">
        <header className="topbar">
          <button className="icon-button menu-button" type="button" onClick={() => setMenuOpen((current) => !current)} aria-label="Toggle menu">
            <Menu size={22} />
          </button>
          <div>
            <p className="eyebrow">Welcome back</p>
            <h1>{user?.fullName || user?.username || "Loan user"}</h1>
          </div>
          <div className="profile-chip">
            <span>{user?.email}</span>
            <strong>{titleCase(user?.role || "Borrower")}</strong>
          </div>
        </header>

        {view === "dashboard" && <Dashboard isAdmin={isAdmin} onNavigate={setView} />}
        {view === "apply" && <ApplyLoan />}
        {view === "repay" && <RepayLoan />}
        {view === "admin" && <AdminLoans />}
      </section>
    </main>
  );
}
