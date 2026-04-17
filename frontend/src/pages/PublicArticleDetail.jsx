import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

import AdBanner from "../components/AdBanner";
import { apiRequest } from "../lib/api";

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

  return (
    <main className="min-h-screen px-4 py-6">
      <div className="mx-auto max-w-[980px] space-y-4">
        <Link to="/" className="inline-flex items-center rounded-lg border border-zinc-700 px-3 py-2 text-sm font-semibold text-zinc-200 hover:border-zinc-500">
          Volver al inicio
        </Link>

        {loading ? <p className="text-zinc-300">Cargando nota...</p> : null}
        {error ? <p className="error-text">{error}</p> : null}

        {article ? (
          <article className="overflow-hidden rounded-2xl border border-zinc-800 bg-zinc-950/70">
            <div className="aspect-[16/9] w-full bg-zinc-900">
              {article.cover_image ? (
                <img src={article.cover_image} alt={article.title} className="h-full w-full object-cover" />
              ) : null}
            </div>
            <div className="space-y-4 p-5">
              <h1 className="text-3xl font-black leading-tight text-white sm:text-4xl">{article.title}</h1>
              <p className="text-sm text-zinc-300">
                {new Date(article.published_at).toLocaleString("es-AR")}
              </p>
              <p className="whitespace-pre-wrap text-lg leading-relaxed text-zinc-100">
                {article.content}
              </p>
            </div>
          </article>
        ) : null}

        <AdBanner title="Publicidad en detalle" subtitle="Posicion premium para monetizacion" />
      </div>
    </main>
  );
}
