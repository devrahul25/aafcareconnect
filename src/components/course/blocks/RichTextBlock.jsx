export default function RichTextBlock({ text, title }) {
  return (
    <div className="space-y-2">
      {title && <h3 className="font-heading font-bold text-slate-900 text-lg">{title}</h3>}
      {text.split("\n").map((p, i) => (
        <p key={i} className="text-sm text-slate-600 leading-relaxed">{p}</p>
      ))}
    </div>
  );
}