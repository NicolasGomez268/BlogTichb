function formatArticleDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function NewsPreviewCard({ article, actions, fallbackImage }) {
  const title = article?.title || "Titulo de la noticia";
  const dateLabel = formatArticleDate(article?.published_at);
  const status = article?.status || "draft";
  const imageUrl = article?.cover_image || fallbackImage || null;

  return (
    <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900">
      <div className="relative aspect-[16/9] w-full bg-zinc-950">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-zinc-500">
            Sin portada
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />
        <span className="absolute left-3 top-3 rounded bg-[#E34234]/90 px-2 py-1 text-[11px] font-bold uppercase tracking-[0.08em] text-white">
          Liga Federal
        </span>
        <span className="absolute right-3 top-3 rounded-full bg-black/70 px-2 py-1 text-xs font-bold uppercase tracking-wide text-zinc-200">
          {status}
        </span>
        <div className="absolute bottom-0 left-0 right-0 p-4">
          <h3 className="max-h-16 overflow-hidden text-xl font-extrabold leading-snug text-white">
            {title}
          </h3>
          <p className="mt-1 text-sm text-zinc-300">{dateLabel}</p>
        </div>
      </div>

      <div className="space-y-3 p-4">
        {actions ? <div className="flex gap-2">{actions}</div> : null}
      </div>
    </article>
  );
}
