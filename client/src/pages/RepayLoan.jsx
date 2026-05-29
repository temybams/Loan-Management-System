import { useEffect, useState } from "react";
import { CircleDollarSign, CreditCard, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { formatCurrency, titleCase } from "../lib/format";
import { EmptyState } from "../components/ui/EmptyState";
import { Toast } from "../components/ui/Toast";

export function RepayLoan() {
  const [loans, setLoans] = useState([]);
  const [form, setForm] = useState({ loanId: "", amount: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "success" });

  useEffect(() => {
    api.getMyLoans().then((response) => {
      const nextLoans = response.data || [];
      setLoans(nextLoans);
      setForm((current) => ({ ...current, loanId: nextLoans[0]?.loanId || "" }));
    });
  }, []);

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setToast({ message: "", tone: "success" });

    try {
      await api.repayLoan({
        loanId: form.loanId,
        amount: Number(form.amount),
      });
      setForm((current) => ({ ...current, amount: "" }));
      setToast({ message: "Repayment processed successfully.", tone: "success" });
    } catch (err) {
      setToast({ message: err.message, tone: "error" });
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="flow-layout">
      <Toast {...toast} onClose={() => setToast({ message: "", tone: "success" })} />
      <div className="panel form-panel">
        <p className="eyebrow">Repayment</p>
        <h2>Make a payment</h2>
        <p>Payments are applied to the earliest unpaid schedule first, including partial schedule payments.</p>
        {loans.length === 0 ? (
          <EmptyState title="No loans to repay" text="Apply for a loan first, then come back to make repayments." icon={CreditCard} />
        ) : (
          <form onSubmit={handleSubmit} className="action-form">
            <label>
              Loan
              <select name="loanId" value={form.loanId} onChange={updateField} required>
                {loans.map((loan) => (
                  <option value={loan.loanId} key={loan.loanId}>
                    {formatCurrency(loan.amount)} - {titleCase(loan.status)}
                  </option>
                ))}
              </select>
            </label>
            <label>
              Amount
              <input name="amount" type="number" min="1" value={form.amount} onChange={updateField} required />
            </label>
            <button className="button primary" type="submit" disabled={loading}>
              {loading ? <Loader2 className="spin" size={18} /> : <CreditCard size={18} />}
              Process repayment
            </button>
          </form>
        )}
      </div>
      <div className="insight-panel green">
        <CircleDollarSign size={28} />
        <h3>Smart allocation</h3>
        <p>The API updates paid amounts across schedules and marks the full loan as paid when every schedule is cleared.</p>
      </div>
    </section>
  );
}
