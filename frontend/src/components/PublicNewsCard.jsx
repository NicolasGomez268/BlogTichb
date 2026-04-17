import { Link } from "react-router-dom";

function formatDate(value) {
  if (!value) {
    return "Sin fecha";
  }

  return new Date(value).toLocaleDateString("es-AR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

export default function PublicNewsCard({ article, variant = "grid" }) {
  const title = article?.title || "Noticia";
  const imageUrl = article?.cover_image || "";
  const excerpt = (article?.content || "").slice(0, 170);
  const dateLabel = formatDate(article?.published_at);
  const slug = article?.slug || "";

  const cardClass =
    variant === "hero"
      ? "min-h-[360px] sm:min-h-[420px]"
      : variant === "side"
        ? "min-h-[175px]"
        : "min-h-[240px]";

  const titleClass =
    variant === "hero"
      ? "text-3xl sm:text-5xl leading-tight"
      : variant === "side"
        ? "text-2xl leading-tight"
        : "text-xl leading-snug";

  return (
    <Link to={slug ? `/noticia/${slug}` : "#"} className={`group relative block overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-900 ${cardClass}`}>
      <div className="absolute inset-0">
        {imageUrl ? (
          <img src={imageUrl} alt={title} className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-zinc-950 text-zinc-500">Sin imagen</div>
        )}
      </div>

      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/45 to-black/10" />

      <div className="relative z-10 flex h-full flex-col justify-end p-4 sm:p-6">
        <p className="inline-flex w-fit rounded bg-[#E34234]/90 px-2 py-1 text-xs font-bold uppercase tracking-[0.1em] text-white">
          Liga Federal de Basquet
        </p>
        <h3 className={`mt-3 font-extrabold text-white ${titleClass}`}>{title}</h3>
        {variant === "hero" ? (
          <p className="mt-2 max-w-3xl text-base text-zinc-200">{excerpt}</p>
        ) : null}
        <p className="mt-3 text-sm text-zinc-300">{dateLabel}</p>
      </div>
    </Link>
  );
}
