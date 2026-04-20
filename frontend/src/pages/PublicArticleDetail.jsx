import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import easytechMobileImage from "../assets/Easytech2.png";
import tichbLogo from "../assets/tichblogo.png";
import AdBanner from "../components/AdBanner";
import { apiRequest, resolveMediaUrl } from "../lib/api";
import { renderRichText } from "../lib/richText.jsx";

function stripBasicFormatting(value) {
  return (value || "").trim();
}

export default function PublicArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [touchStartX, setTouchStartX] = useState(0);

  useEffect(() => {
    async function loadArticle() {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest(`/articles/${slug}/`);

        if (!response.ok) {
          throw new Error("No se pudo cargar la noticia");
        }

        const data = await response.json();
        setArticle(data);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticle();
  }, [slug]);

  const publishedLabel = article?.published_at
    ? new Date(article.published_at).toLocaleString("es-AR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      })
    : "Sin fecha";

  const leadText = stripBasicFormatting(article?.lead) || "Sin bajada";
  const imageList = Array.isArray(article?.images) && article.images.length > 0
    ? article.images.map((image) => resolveMediaUrl(image))
    : (article?.cover_image ? [resolveMediaUrl(article.cover_image)] : []);

  useEffect(() => {
    setCurrentImageIndex(0);
  }, [slug]);

  function showNextImage() {
    if (imageList.length <= 1) {
      return;
    }

    setCurrentImageIndex((prevIndex) => (prevIndex + 1) % imageList.length);
  }

  function showPrevImage() {
    if (imageList.length <= 1) {
      return;
    }

    setCurrentImageIndex((prevIndex) => (prevIndex - 1 + imageList.length) % imageList.length);
  }

  function handleTouchStart(event) {
    setTouchStartX(event.changedTouches[0].clientX);
  }

  function handleTouchEnd(event) {
    const delta = event.changedTouches[0].clientX - touchStartX;

    if (Math.abs(delta) < 40) {
      return;
    }

    if (delta < 0) {
      showNextImage();
    } else {
      showPrevImage();
    }
  }

  return (
    <main className="min-h-screen overflow-x-hidden px-3 py-4 sm:px-4 sm:py-6">
      <div className="grid w-full gap-4 xl:grid-cols-[170px_minmax(0,1fr)_170px]">
        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Tu marca" subtitle="Visible todo el dia" />
          <AdBanner orientation="vertical" title="Sponsor" subtitle="Alto impacto" />
        </aside>

        <div className="mx-auto w-full max-w-[460px] sm:max-w-[980px] xl:max-w-none">
          <div className="mb-3 flex items-start justify-between gap-3">
            <Link to="/" className="inline-flex items-center rounded-lg border border-zinc-700 px-3 py-2 text-xs font-semibold uppercase tracking-[0.08em] text-zinc-200 hover:border-zinc-500 sm:text-sm">
              Volver al inicio
            </Link>

            <img
              src={tichbLogo}
              alt="Tich Basketball"
              className="h-9 w-auto object-contain opacity-95 sm:h-10"
            />
          </div>

          {loading ? <p className="text-zinc-300">Cargando nota...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {article ? (
            <article className="space-y-5">
              <div className="space-y-4">
                <p className="text-xs text-zinc-300 sm:text-sm">{publishedLabel}</p>

                <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[#E06A1B] sm:text-base">
                  {article.category || "Liga Federal de Basquet"}
                </p>

                <h1 className="break-words text-4xl font-black leading-[1.08] text-white sm:text-5xl">
                  {article.title}
                </h1>

                <p className="break-words font-serif text-xl italic leading-relaxed text-zinc-200 sm:max-w-4xl">
                  {renderRichText(leadText)}
                </p>
              </div>

              <div className="relative flex w-full items-center justify-center">
                {imageList.length > 0 ? (
                  <img
                    src={imageList[currentImageIndex]}
                    alt={article.title}
                    className="h-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
                    onTouchStart={handleTouchStart}
                    onTouchEnd={handleTouchEnd}
                  />
                ) : <div className="w-full rounded-lg border border-zinc-800 py-10 text-center text-sm text-zinc-500">Sin imagen</div>}

                {imageList.length > 1 ? (
                  <>
                    <button
                      type="button"
                      onClick={showPrevImage}
                      className="absolute left-2 hidden h-9 w-9 items-center justify-center rounded-full border border-zinc-500 bg-black/55 text-lg font-bold text-white transition hover:border-zinc-300 hover:bg-black/70 md:flex"
                      aria-label="Foto anterior"
                    >
                      &lt;
                    </button>
                    <button
                      type="button"
                      onClick={showNextImage}
                      className="absolute right-2 hidden h-9 w-9 items-center justify-center rounded-full border border-zinc-500 bg-black/55 text-lg font-bold text-white transition hover:border-zinc-300 hover:bg-black/70 md:flex"
                      aria-label="Foto siguiente"
                    >
                      &gt;
                    </button>
                  </>
                ) : null}
              </div>

              {imageList.length > 1 ? (
                <div className="flex items-center justify-center gap-2">
                  {imageList.map((image, index) => (
                    <button
                      key={`${image}-${index}`}
                      type="button"
                      onClick={() => setCurrentImageIndex(index)}
                      className={`h-2.5 w-2.5 rounded-full ${index === currentImageIndex ? "bg-white" : "bg-zinc-600"}`}
                      aria-label={`Ver foto ${index + 1}`}
                    />
                  ))}
                </div>
              ) : null}

              <a
                href="https://www.instagram.com/easytechh_?igsh=MTE4a2RhbXp4ZHd3Zw=="
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full overflow-hidden rounded-xl border border-zinc-800 bg-zinc-950/40 md:hidden"
                aria-label="Publicidad"
              >
                <img
                  src={easytechMobileImage}
                  alt="Publicidad EasyTech"
                  className="h-auto w-full object-contain"
                />
              </a>

              <div className="space-y-4 break-words font-sans text-lg leading-relaxed text-zinc-100">
                <p>{renderRichText(article.content)}</p>
              </div>
            </article>
          ) : null}
        </div>

        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Campana" subtitle="Llegas a toda la audiencia" />
          <AdBanner orientation="vertical" title="Anuncia aqui" subtitle="En desktop queda siempre visible" />
        </aside>
      </div>
    </main>
  );
}
