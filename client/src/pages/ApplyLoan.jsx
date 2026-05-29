import { useState } from "react";
import { Banknote, Check, Loader2 } from "lucide-react";
import { api } from "../lib/api";
import { Toast } from "../components/ui/Toast";

export function ApplyLoan() {
  const [form, setForm] = useState({ amount: "", tenureMonths: "" });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ message: "", tone: "success" });

  function updateField(event) {
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setLoading(true);
    setToast({ message: "", tone: "success" });

    try {
      await api.applyForLoan({
        amount: Number(form.amount),
        tenureMonths: Number(form.tenureMonths),
      });
      setForm({ amount: "", tenureMonths: "" });
      setToast({ message: "Loan application submitted successfully.", tone: "success" });
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
        <p className="eyebrow">New application</p>
        <h2>Apply for a loan</h2>
        <p>Submit an amount and preferred tenure. The backend will calculate interest, validate your limit, and create schedules.</p>
        <form onSubmit={handleSubmit} className="action-form">
          <label>
            Amount
            <input name="amount" type="number" min="1" value={form.amount} onChange={updateField} required />
          </label>
          <label>
            Tenure
            <input name="tenureMonths" type="number" min="1" value={form.tenureMonths} onChange={updateField} required />
          </label>
          <button className="button primary" type="submit" disabled={loading}>
            {loading ? <Loader2 className="spin" size={18} /> : <Check size={18} />}
            Submit application
          </button>
        </form>
      </div>
      <div className="insight-panel">
        <Banknote size={28} />
        <h3>Backend rules</h3>
        <p>Interest is currently fixed at 10%, and outstanding loan exposure is checked before a new loan is created.</p>
      </div>
    </section>
  );
}
