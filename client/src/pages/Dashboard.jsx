import { BorrowerDashboard } from "./BorrowerDashboard";
import { AdminLoans } from "./AdminLoans";

export function Dashboard({ isAdmin, onNavigate }) {
  return isAdmin ? <AdminLoans /> : <BorrowerDashboard onNavigate={onNavigate} />;
}
