import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import tichbLogo from "../assets/tichblogo.png";
import { apiRequest } from "../lib/api";
import { renderRichText } from "../lib/richText.jsx";

function stripBasicFormatting(value) {
  return (value || "").trim();
}

export default function PublicArticleDetail() {
  const { slug } = useParams();
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

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

  return (
    <main className="min-h-screen px-3 py-4 sm:px-4 sm:py-6">
      <div className="mx-auto w-full max-w-[460px] sm:max-w-[980px]">
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

              <h1 className="text-4xl font-black leading-[1.08] text-white sm:text-5xl">
                {article.title}
              </h1>

              <p className="font-serif text-xl italic leading-relaxed text-zinc-200 sm:max-w-4xl">
                {renderRichText(leadText)}
              </p>
            </div>

            <div className="flex w-full items-center justify-center">
              {article.cover_image ? (
                <img
                  src={article.cover_image}
                  alt={article.title}
                  className="h-auto max-h-[85vh] w-auto max-w-full rounded-lg object-contain"
                />
              ) : <div className="w-full rounded-lg border border-zinc-800 py-10 text-center text-sm text-zinc-500">Sin imagen</div>}
            </div>

            <div className="space-y-4 font-sans text-lg leading-relaxed text-zinc-100">
              <p>{renderRichText(article.content)}</p>
            </div>
          </article>
        ) : null}
      </div>
    </main>
  );
}
