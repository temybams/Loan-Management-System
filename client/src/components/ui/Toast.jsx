import { X } from "lucide-react";

export function Toast({ message, tone = "success", onClose }) {
  if (!message) return null;

  return (
    <div className={`toast ${tone}`}>
      <span>{message}</span>
      <button type="button" onClick={onClose} aria-label="Close notification">
        <X size={16} />
      </button>
    </div>
  );
}
