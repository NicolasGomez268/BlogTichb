import { useEffect, useState } from "react";

import { useAuth } from "../auth/AuthContext";
import ArticleForm from "../components/ArticleForm";
import NewsPreviewCard from "../components/NewsPreviewCard";
import { apiRequest } from "../lib/api";

export default function AdminDashboard() {
  const { token, logout } = useAuth();
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [editingArticle, setEditingArticle] = useState(null);

  async function loadArticles() {
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await apiRequest("/articles/", {}, token);

      if (!response.ok) {
        throw new Error("No se pudo cargar la lista de noticias");
      }

      const data = await response.json();
      setArticles(data.results || []);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    loadArticles();
  }, []);

  async function handleDelete(slug) {
    const confirmed = window.confirm("Seguro que queres borrar esta noticia?");
    if (!confirmed) {
      return;
    }

    try {
      const response = await apiRequest(
        `/articles/${slug}/`,
        { method: "DELETE" },
        token
      );

      if (!response.ok && response.status !== 204) {
        throw new Error("No se pudo borrar la noticia");
      }

      setArticles((prev) => prev.filter((article) => article.slug !== slug));
    } catch (error) {
      setErrorMessage(error.message);
    }
  }

  function handleSaved(savedArticle, isEditing) {
    setArticles((prev) => {
      if (!isEditing) {
        return [savedArticle, ...prev];
      }

      return prev.map((article) => {
        const isTarget =
          article.slug === savedArticle.slug || article.slug === editingArticle?.slug;
        return isTarget ? savedArticle : article;
      });
    });

    setEditingArticle(null);
    setShowForm(false);
  }

  function openCreateForm() {
    setEditingArticle(null);
    setShowForm(true);
  }

  function openEditForm(article) {
    setEditingArticle(article);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function handleFormCancel() {
    setEditingArticle(null);
    setShowForm(false);
  }

  return (
    <main className="min-h-screen px-4 py-8">
      <header className="mx-auto mb-4 flex w-full max-w-5xl flex-col items-start justify-between gap-3 sm:flex-row sm:items-center">
        <div>
          <p className="eyebrow">Panel privado</p>
          <h1 className="mt-1 text-3xl font-semibold">Administrador de noticias</h1>
        </div>

        <button className="btn-secondary" onClick={logout}>
          Cerrar sesion
        </button>
      </header>

      <section className="mx-auto mb-4 w-full max-w-5xl">
        <button className="btn-primary big" onClick={openCreateForm}>
          Nueva Noticia
        </button>
      </section>

      {showForm ? (
        <ArticleForm
          token={token}
          initialArticle={editingArticle}
          onSaved={handleSaved}
          onCancel={handleFormCancel}
        />
      ) : null}

      <section className="panel-card max-w-5xl">
        <h2 className="panel-title">Noticias cargadas</h2>

        {isLoading ? <p>Cargando noticias...</p> : null}
        {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

        {!isLoading && articles.length === 0 ? <p>No hay noticias cargadas.</p> : null}

        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <li key={article.slug}>
              <NewsPreviewCard
                article={article}
                actions={
                  <>
                    <button
                      className="btn-outline"
                      type="button"
                      onClick={() => openEditForm(article)}
                    >
                      Editar
                    </button>
                    <button
                      className="btn-danger"
                      type="button"
                      onClick={() => handleDelete(article.slug)}
                    >
                      Borrar
                    </button>
                  </>
                }
              />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
