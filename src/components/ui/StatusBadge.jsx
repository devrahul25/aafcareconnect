const VARIANTS = {
  // Course / enrolment
  published:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  draft:          "bg-amber-50  text-amber-700  border-amber-200",
  archived:       "bg-slate-100 text-slate-500  border-slate-200",
  enrolled:       "bg-blue-50   text-blue-700   border-blue-200",
  in_progress:    "bg-violet-50 text-violet-700 border-violet-200",
  completed:      "bg-emerald-50 text-emerald-700 border-emerald-200",
  failed:         "bg-red-50    text-red-700    border-red-200",
  // CPD
  valid:          "bg-emerald-50 text-emerald-700 border-emerald-200",
  expiring_soon:  "bg-amber-50  text-amber-700  border-amber-200",
  expired:        "bg-red-50    text-red-700    border-red-200",
  // General
  active:         "bg-emerald-50 text-emerald-700 border-emerald-200",
  inactive:       "bg-slate-100 text-slate-500  border-slate-200",
  mandatory:      "bg-red-50    text-red-700    border-red-200",
  optional:       "bg-slate-100 text-slate-600  border-slate-200",
  overdue:        "bg-red-50    text-red-700    border-red-200",
  pending:        "bg-amber-50  text-amber-700  border-amber-200",
  new:            "bg-blue-50   text-blue-700   border-blue-200",
};

const LABELS = {
  published: "Published", draft: "Draft", archived: "Archived",
  enrolled: "Enrolled", in_progress: "In Progress", completed: "Completed", failed: "Failed",
  valid: "Valid", expiring_soon: "Expiring Soon", expired: "Expired",
  active: "Active", inactive: "Inactive", mandatory: "Mandatory", optional: "Optional",
  overdue: "Overdue", pending: "Pending", new: "New",
};

export default function StatusBadge({ status = undefined, label = undefined, size = "sm" }) {
  const cls = VARIANTS[status] ?? "bg-slate-100 text-slate-600 border-slate-200";
  const text = label ?? LABELS[status] ?? status;
  return (
    <span className={`inline-flex items-center border font-semibold rounded-full ${size === "xs" ? "text-[10px] px-2 py-0" : "text-xs px-2.5 py-0.5"} ${cls}`}>
      {text}
    </span>
  );
}