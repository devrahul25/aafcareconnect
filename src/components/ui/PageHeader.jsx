export default function PageHeader({ title = undefined, subtitle = undefined, breadcrumb = undefined, actions = undefined, children = undefined }) {
  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div>
        {breadcrumb && <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">{breadcrumb}</p>}
        <h1 className="font-heading font-bold text-2xl text-slate-900 leading-tight">{title}</h1>
        {subtitle && <p className="text-sm text-slate-500 mt-1">{subtitle}</p>}
        {children}
      </div>
      {actions && <div className="flex items-center gap-2 flex-shrink-0 flex-wrap">{actions}</div>}
    </div>
  );
}