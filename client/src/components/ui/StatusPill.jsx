import { titleCase } from "../../lib/format";

export function StatusPill({ status }) {
  return <span className={`status-pill ${String(status).toLowerCase()}`}>{titleCase(status)}</span>;
}
