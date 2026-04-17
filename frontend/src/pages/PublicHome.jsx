import { useEffect, useMemo, useState } from "react";

import tichbLogo from "../assets/tichblogo.png";
import AdBanner from "../components/AdBanner";
import PublicNewsCard from "../components/PublicNewsCard";
import { apiRequest } from "../lib/api";

export default function PublicHome() {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadArticles() {
      setLoading(true);
      setError("");

      try {
        const response = await apiRequest("/articles/");

        if (!response.ok) {
          throw new Error("No se pudieron cargar las noticias");
        }

        const data = await response.json();
        setArticles(data.results || []);
      } catch (requestError) {
        setError(requestError.message);
      } finally {
        setLoading(false);
      }
    }

    loadArticles();
  }, []);

  const featuredArticle = articles[0];
  const sideArticles = articles.slice(1, 3);
  const feedArticles = useMemo(() => articles.slice(3), [articles]);

  return (
    <main className="min-h-screen px-2 pb-10 pt-4 sm:px-4">
      <div className="mb-4 px-2 py-3 sm:px-4">
        <div className="flex items-center justify-center gap-4 text-left sm:gap-6">
          <img
            src={tichbLogo}
            alt="Tich Basketball"
            className="h-20 w-auto object-contain sm:h-24"
          />
          <div>
            <p className="text-3xl font-black uppercase leading-none tracking-[0.08em] text-white sm:text-5xl">
              Noticias
            </p>
            <p className="mt-1 text-3xl font-black uppercase leading-none tracking-[0.08em] text-[#E34234] sm:text-5xl">
              Tichb
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-300 sm:text-base">
              Resistencia - CHACO
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full gap-4 xl:grid-cols-[170px_minmax(0,1fr)_170px]">
        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Tu marca" subtitle="Visible todo el dia" />
          <AdBanner orientation="vertical" title="Sponsor" subtitle="Alto impacto" />
          <AdBanner orientation="vertical" title="Promocion" subtitle="Publicidad premium" />
        </aside>

        <section className="space-y-4">
          {loading ? <p className="text-zinc-300">Cargando noticias...</p> : null}
          {error ? <p className="error-text">{error}</p> : null}

          {!loading && !error && featuredArticle ? (
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)]">
              <PublicNewsCard article={featuredArticle} variant="hero" />
              <div className="grid gap-4">
                {sideArticles.map((article) => (
                  <PublicNewsCard key={article.slug} article={article} variant="side" />
                ))}
              </div>
            </div>
          ) : null}

          <AdBanner title="Envios rapidos y seguros" subtitle="Reserva este espacio en el home" />

          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-6 w-1 bg-[#E34234]" />
              <h2 className="text-3xl font-black uppercase tracking-[0.04em]">Tendencia</h2>
            </div>

            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {feedArticles.map((article, index) => (
                <li key={article.slug} className="space-y-4">
                  <PublicNewsCard article={article} variant="grid" />
                  {index === 1 ? (
                    <div className="xl:hidden">
                      <AdBanner title="Publicidad estrategica" subtitle="Aparece en medio del scroll" />
                    </div>
                  ) : null}
                </li>
              ))}
            </ul>
          </section>
        </section>

        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Campana" subtitle="Llegas a toda la audiencia" />
          <AdBanner orientation="vertical" title="Anuncia aqui" subtitle="En desktop queda siempre visible" />
          <AdBanner orientation="vertical" title="Tu negocio" subtitle="Consultanos por paquetes" />
        </aside>
      </div>
    </main>
  );
}
