import { useEffect, useMemo, useState } from "react";
import { Banknote, ChevronRight, CircleDollarSign, CreditCard, WalletCards } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency, formatDate } from "../lib/format";
import { EmptyState } from "../components/ui/EmptyState";
import { LoadingPanel } from "../components/ui/LoadingPanel";
import { Metric } from "../components/ui/Metric";
import { StatusPill } from "../components/ui/StatusPill";
import { Toast } from "../components/ui/Toast";

export function BorrowerDashboard({ onNavigate }) {
  const [loans, setLoans] = useState([]);
  const [selectedLoanId, setSelectedLoanId] = useState("");
  const [summary, setSummary] = useState(null);
  const [schedule, setSchedule] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  async function loadLoans() {
    setLoading(true);
    setError("");
    try {
      const response = await api.getMyLoans();
      const nextLoans = response.data || [];
      setLoans(nextLoans);
      setSelectedLoanId((current) => current || nextLoans[0]?.loanId || "");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLoans();
  }, []);

  useEffect(() => {
    async function loadDetails() {
      if (!selectedLoanId) {
        setSummary(null);
        setSchedule(null);
        return;
      }

      try {
        const [summaryResponse, scheduleResponse] = await Promise.all([
          api.getLoanSummary(selectedLoanId),
          api.getLoanSchedule(selectedLoanId),
        ]);
        setSummary(summaryResponse.data);
        setSchedule(scheduleResponse.data);
      } catch (err) {
        setError(err.message);
      }
    }

    loadDetails();
  }, [selectedLoanId]);

  const totals = useMemo(() => {
    return loans.reduce(
      (acc, loan) => ({
        totalBorrowed: acc.totalBorrowed + Number(loan.totalAmount || 0),
        totalRemaining: acc.totalRemaining + Number(loan.amountLeft || 0),
      }),
      { totalBorrowed: 0, totalRemaining: 0 }
    );
  }, [loans]);

  if (loading) return <LoadingPanel text="Loading borrower dashboard..." />;

  return (
    <div className="dashboard-grid">
      <Toast message={error} tone="error" onClose={() => setError("")} />

      <section className="metric-row">
        <Metric icon={WalletCards} label="Active loans" value={loans.length} />
        <Metric icon={CircleDollarSign} label="Total borrowed" value={formatCurrency(totals.totalBorrowed)} />
        <Metric icon={CreditCard} label="Outstanding" value={formatCurrency(totals.totalRemaining)} />
      </section>

      <section className="panel primary-panel">
        <div>
          <p className="eyebrow">Borrower command center</p>
          <h2>Apply, repay, and stay ahead of upcoming dues.</h2>
          <p>Your loan activity is summarized here with schedule and balance information pulled directly from the backend.</p>
        </div>
        <div className="panel-actions">
          <button className="button primary" type="button" onClick={() => onNavigate("apply")}>
            <Banknote size={18} /> Apply for loan
          </button>
          <button className="button secondary" type="button" onClick={() => onNavigate("repay")}>
            <CreditCard size={18} /> Make repayment
          </button>
        </div>
      </section>

      {loans.length === 0 ? (
        <EmptyState title="No loans yet" text="Apply for your first loan to generate repayment schedules and summaries." icon={Banknote} />
      ) : (
        <section className="content-grid">
          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Loan portfolio</p>
                <h2>Your loans</h2>
              </div>
            </div>

            <div className="loan-list">
              {loans.map((loan) => (
                <button
                  type="button"
                  key={loan.loanId}
                  className={selectedLoanId === loan.loanId ? "loan-row active" : "loan-row"}
                  onClick={() => setSelectedLoanId(loan.loanId)}
                >
                  <div>
                    <strong>{formatCurrency(loan.amount)}</strong>
                    <span>{formatCurrency(loan.amountLeft)} remaining</span>
                  </div>
                  <StatusPill status={loan.status} />
                  <ChevronRight size={18} />
                </button>
              ))}
            </div>
          </div>

          <div className="panel">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Selected loan</p>
                <h2>Summary</h2>
              </div>
              {summary && <StatusPill status={summary.status} />}
            </div>

            {summary && (
              <div className="summary-stack">
                <Metric label="Remaining balance" value={formatCurrency(summary.remainingBalance)} compact />
                <Metric label="Amount paid" value={formatCurrency(summary.amountPaid)} compact />
                <Metric label="Next due" value={formatDate(summary.nextPaymentDueDate)} compact />
                <Metric label="Next amount" value={formatCurrency(summary.nextPaymentAmount)} compact />
              </div>
            )}
          </div>
        </section>
      )}

      {schedule?.repaymentSchedules?.length > 0 && (
        <section className="panel full-width">
          <div className="panel-header">
            <div>
              <p className="eyebrow">Repayment schedule</p>
              <h2>Upcoming installments</h2>
            </div>
          </div>
          <div className="schedule-table">
            <div className="table-head">
              <span>Due date</span>
              <span>Amount</span>
              <span>Paid</span>
              <span>Status</span>
            </div>
            {schedule.repaymentSchedules.map((item) => (
              <div className="table-row" key={item.id}>
                <span>{formatDate(item.dueDate)}</span>
                <span>{formatCurrency(item.amount)}</span>
                <span>{formatCurrency(item.paidAmount)}</span>
                <StatusPill status={item.status} />
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
