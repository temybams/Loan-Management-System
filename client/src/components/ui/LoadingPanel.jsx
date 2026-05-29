import { Loader2 } from "lucide-react";

export function LoadingPanel({ text = "Loading workspace..." }) {
  return (
    <div className="loading-panel">
      <Loader2 className="spin" size={24} />
      <span>{text}</span>
    </div>
  );
}
