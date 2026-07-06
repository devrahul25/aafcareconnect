export default function ImageBlock({ url, caption }) {
  return (
    <figure className="space-y-2">
      <div className="rounded-xl overflow-hidden border border-slate-200 bg-slate-100">
        <img src={url} alt={caption || ""} loading="lazy" className="w-full h-48 sm:h-56 object-cover" />
      </div>
      {caption && <figcaption className="text-xs text-slate-400 text-center">{caption}</figcaption>}
    </figure>
  );
}