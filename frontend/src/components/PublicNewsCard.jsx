import { useEffect, useMemo, useState } from "react";
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
  const category = article?.category || "Liga Federal de Basquet";
  const imageList = useMemo(() => {
    if (Array.isArray(article?.images) && article.images.length > 0) {
      return article.images;
    }

    return article?.cover_image ? [article.cover_image] : [];
  }, [article]);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const imageUrl = imageList[currentImageIndex] || "";
  const excerptSource = article?.lead || article?.content || "";
  const excerpt = excerptSource.replace(/\*\*/g, "").slice(0, 170);
  const dateLabel = formatDate(article?.published_at);
  const slug = article?.slug || "";

  const cardClass =
    variant === "hero"
      ? "min-h-[360px] sm:min-h-[420px]"
      : variant === "side"
        ? "min-h-[240px] lg:min-h-[175px]"
        : "min-h-[240px]";

  const titleClass =
    variant === "hero"
      ? "text-2xl sm:text-4xl leading-tight"
      : variant === "side"
        ? "text-xl leading-tight"
        : "text-lg leading-snug";

  const excerptClass = variant === "hero" ? "text-sm sm:text-base" : "text-sm";

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [article?.slug]);

  useEffect(() => {
    if (imageList.length <= 1) {
      return;
    }

    const intervalId = window.setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
    }, 1000);

    return () => window.clearInterval(intervalId);
  }, [imageList]);

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
          {category}
        </p>
        <h3 className={`mt-3 break-words font-extrabold text-white ${titleClass}`}>{title}</h3>
        {variant === "hero" ? (
          <p className={`mt-2 max-w-3xl text-zinc-200 ${excerptClass}`}>{excerpt}</p>
        ) : null}
        <p className="mt-3 text-sm text-zinc-300">{dateLabel}</p>
      </div>
    </Link>
  );
}
