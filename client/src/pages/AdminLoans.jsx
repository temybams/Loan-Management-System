import { useEffect, useState } from "react";
import { ClipboardList } from "lucide-react";
import { LOAN_STATUSES } from "../constants/loan";
import { api } from "../lib/api";
import { formatCurrency, formatDate, titleCase } from "../lib/format";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingPanel } from "../components/ui/LoadingPanel";
import { StatusPill } from "../components/ui/StatusPill";
import { Toast } from "../components/ui/Toast";

export function AdminLoans() {
  const [loans, setLoans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ message: "", tone: "success" });

  async function loadLoans() {
    setLoading(true);
    try {
      const response = await api.getAllLoans();
      setLoans(response.data || []);
    } catch (err) {
      setToast({ message: err.message, tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans();
  }, []);

  async function updateStatus(loanId, status) {
    try {
      await api.updateLoanStatus(loanId, status);
      setToast({ message: `Loan marked as ${titleCase(status)}.`, tone: "success" });
      loadLoans();
    } catch (err) {
      setToast({ message: err.message, tone: "error" });
    }
  }

  if (loading) return <LoadingPanel text="Loading admin queue..." />;

  return (
    <section className="admin-layout">
      <Toast {...toast} onClose={() => setToast({ message: "", tone: "success" })} />
      <div className="panel primary-panel">
        <div>
          <p className="eyebrow">Admin review</p>
          <h2>Loan approval queue</h2>
          <p>Review borrower requests, inspect payment exposure, and update lifecycle status from one operational view.</p>
        </div>
      </div>

      {loans.length === 0 ? (
        <EmptyState title="No loan records" text="Loan applications will appear here once borrowers submit requests." icon={ClipboardList} />
      ) : (
        <div className="admin-list">
          {loans.map((loan) => (
            <article className="admin-card" key={loan.id}>
              <div className="admin-card-main">
                <div>
                  <p className="eyebrow">{loan.user?.fullName || "Borrower"}</p>
                  <h3>{formatCurrency(loan.amount)}</h3>
                  <span>{loan.tenureMonths} tenure units at {loan.interestRate}% interest</span>
                </div>
                <StatusPill status={loan.status} />
              </div>
              <div className="admin-card-meta">
                <span>{loan.user?.email}</span>
                <span>Applied {formatDate(loan.createdAt)}</span>
                <span>{loan.payments?.length || 0} payments</span>
              </div>
              <div className="status-actions">
                {LOAN_STATUSES.map((status) => (
                  <button
                    type="button"
                    key={status}
                    className={loan.status === status ? "active" : ""}
                    onClick={() => updateStatus(loan.id, status)}
                  >
                    {titleCase(status)}
                  </button>
                ))}
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
