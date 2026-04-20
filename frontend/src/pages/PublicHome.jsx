import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import easytechImage from "../assets/Easytech1.png";
import easytechDesktopImage from "../assets/Easytech2.png";
import kineImage from "../assets/KINE.png";
import rafakineImage from "../assets/rafakine.jpeg";
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
    <main className="min-h-screen overflow-x-hidden px-2 pb-10 pt-4 sm:px-4">
      <div className="mb-2 flex items-center justify-between px-2 sm:px-4">
        <a
          href="https://www.instagram.com/tichb_ok?igsh=b3JmZGhqZnFnMDg="
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Instagram de Tichb"
          className="text-zinc-400/75 transition hover:text-zinc-200"
        >
          <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4" aria-hidden="true">
            <path d="M7 2C4.239 2 2 4.239 2 7v10c0 2.761 2.239 5 5 5h10c2.761 0 5-2.239 5-5V7c0-2.761-2.239-5-5-5H7zm0 2h10c1.657 0 3 1.343 3 3v10c0 1.657-1.343 3-3 3H7c-1.657 0-3-1.343-3-3V7c0-1.657 1.343-3 3-3zm11.5 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zM12 7a5 5 0 100 10 5 5 0 000-10zm0 2a3 3 0 110 6 3 3 0 010-6z" />
          </svg>
        </a>
        <Link
          to="/login"
          className="rounded border border-zinc-600/40 bg-transparent px-2 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-zinc-400/70 transition hover:border-zinc-500/60 hover:text-zinc-300"
        >
          Iniciar sesion
        </Link>
      </div>

      <div className="mb-4 px-2 py-3 sm:px-4">
        <div className="flex flex-wrap items-center justify-center gap-3 text-center sm:flex-nowrap sm:gap-6 sm:text-left">
          <img
            src={tichbLogo}
            alt="Tich Basketball"
            className="h-16 w-auto object-contain sm:h-24"
          />
          <div>
            <p className="text-2xl font-black uppercase leading-none tracking-[0.06em] text-white sm:text-5xl sm:tracking-[0.08em]">
              Noticias
            </p>
            <p className="mt-1 text-2xl font-black uppercase leading-none tracking-[0.06em] text-[#E34234] sm:text-5xl sm:tracking-[0.08em]">
              Tichb
            </p>
            <p className="mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-zinc-300 sm:text-base sm:tracking-[0.16em]">
              Resistencia - CHACO
            </p>
          </div>
        </div>
      </div>

      <div className="grid w-full gap-4 xl:grid-cols-[170px_minmax(0,1fr)_170px]">
        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Tu marca" subtitle="Visible todo el dia" />
          <AdBanner orientation="vertical" title="Sponsor" subtitle="Alto impacto" />
        </aside>

        <section className="min-w-0 space-y-4">
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

          <a
            href="https://www.instagram.com/kine.rafaknezev?igsh=aGQzeWcyYWpvYms3&utm_source=qr"
            target="_blank"
            rel="noopener noreferrer"
            className="relative mx-auto block h-[250px] w-[380px] max-w-full overflow-hidden rounded-2xl border border-zinc-800 sm:h-[240px] lg:h-[200px] lg:w-full lg:max-w-[1000px]"
            aria-label="Publicidad"
          >
            <picture>
              <source media="(min-width: 1024px)" srcSet={kineImage} />
              <source media="(max-width: 1023px)" srcSet={rafakineImage} />
              <img
                src={rafakineImage}
                alt="Publicidad Rafakine"
                className="h-full w-full object-cover"
              />
            </picture>
          </a>

          <section>
            <div className="mb-3 flex items-center gap-2">
              <span className="h-6 w-1 bg-[#E34234]" />
              <h2 className="text-3xl font-black uppercase tracking-[0.04em]">Tendencia</h2>
            </div>

            <ul className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {feedArticles.flatMap((article, index) => {
                const items = [
                  <li key={article.slug || `trend-item-${index}`} className="space-y-4">
                    <PublicNewsCard article={article} variant="grid" />
                  </li>,
                ];

                if ((index + 1) % 6 === 0) {
                  items.push(
                    <li key={`trend-ad-${index}`} className="md:col-span-2 xl:col-span-3">
                      <a
                        href="https://www.instagram.com/easytechh_?igsh=MTE4a2RhbXp4ZHd3Zw=="
                        target="_blank"
                        rel="noopener noreferrer"
                        className="relative mx-auto block h-[250px] w-[380px] max-w-full overflow-hidden rounded-2xl border border-zinc-800 sm:h-[240px] md:hidden"
                        aria-label="Publicidad"
                      >
                        <img
                          src={easytechImage}
                          alt="Publicidad EasyTech"
                          className="h-full w-full object-cover"
                        />
                      </a>
                      <div className="hidden md:block">
                        <a
                          href="https://www.instagram.com/easytechh_?igsh=MTE4a2RhbXp4ZHd3Zw=="
                          target="_blank"
                          rel="noopener noreferrer"
                          className="relative mx-auto block h-[250px] w-[380px] max-w-full overflow-hidden rounded-2xl border border-zinc-800 sm:h-[240px] lg:h-[200px] lg:w-full lg:max-w-[1000px]"
                          aria-label="Publicidad"
                        >
                          <img
                            src={easytechDesktopImage}
                            alt="Publicidad EasyTech"
                            className="h-full w-full object-cover"
                          />
                        </a>
                      </div>
                    </li>,
                  );
                }

                return items;
              })}
            </ul>
          </section>

        </section>

        <aside className="hidden xl:flex xl:sticky xl:top-4 xl:h-fit xl:flex-col xl:gap-3">
          <AdBanner orientation="vertical" title="Campana" subtitle="Llegas a toda la audiencia" />
          <AdBanner orientation="vertical" title="Anuncia aqui" subtitle="En desktop queda siempre visible" />
        </aside>
      </div>

      <footer className="mt-8 pb-2 text-center text-sm text-zinc-300">
        <a
          href="https://www.easytech.ar/"
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-zinc-200 underline decoration-zinc-500/70 underline-offset-4 transition hover:text-white"
        >
          Desarrollado por EasyTech
        </a>
      </footer>
    </main>
  );
}
