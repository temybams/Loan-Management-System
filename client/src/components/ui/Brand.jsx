import { Landmark } from "lucide-react";

export function Brand({ compact = false }) {
  return (
    <div className={compact ? "brand-lockup compact" : "brand-lockup"}>
      <div className="brand-mark">
        <Landmark size={compact ? 20 : 23} />
      </div>
      <span>TemmyLoans</span>
    </div>
  );
}
