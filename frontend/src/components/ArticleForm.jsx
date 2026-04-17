import { useEffect, useState } from "react";

import { apiRequest } from "../lib/api";
import NewsPreviewCard from "./NewsPreviewCard";

const initialFormState = {
  title: "",
  content: "",
  status: "draft",
};

export default function ArticleForm({ token, initialArticle, onSaved, onCancel }) {
  const isEditing = Boolean(initialArticle?.slug);
  const [formData, setFormData] = useState(initialFormState);
  const [coverFile, setCoverFile] = useState(null);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!initialArticle) {
      setFormData(initialFormState);
      setCoverFile(null);
      setPreviewImageUrl("");
      return;
    }

    setFormData({
      title: initialArticle.title || "",
      content: initialArticle.content || "",
      status: initialArticle.status || "draft",
    });
    setCoverFile(null);
    setPreviewImageUrl(initialArticle.cover_image || "");
  }, [initialArticle]);

  useEffect(() => {
    if (!coverFile) {
      return;
    }

    const objectUrl = URL.createObjectURL(coverFile);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [coverFile]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("content", formData.content);
      payload.append("status", formData.status);

      if (coverFile) {
        payload.append("cover_image", coverFile);
      }

      const endpoint = isEditing ? `/articles/${initialArticle.slug}/` : "/articles/";
      const method = isEditing ? "PATCH" : "POST";

      const response = await apiRequest(
        endpoint,
        {
          method,
          body: payload,
        },
        token
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        const firstError = Object.values(errorData)[0];
        const normalizedError = Array.isArray(firstError) ? firstError[0] : firstError;
        throw new Error(normalizedError || "No se pudo guardar la noticia");
      }

      const savedArticle = await response.json();

      if (!isEditing) {
        setFormData(initialFormState);
        setCoverFile(null);
        setPreviewImageUrl("");
      }

      onSaved(savedArticle, isEditing);
    } catch (error) {
      setErrorMessage(error.message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="panel-card" onSubmit={handleSubmit}>
      <h2 className="panel-title">{isEditing ? "Editar noticia" : "Nueva noticia"}</h2>

      <label className="field-label" htmlFor="title">
        Titulo
      </label>
      <input
        id="title"
        name="title"
        className="field-input"
        value={formData.title}
        onChange={handleChange}
        required
      />

      <label className="field-label" htmlFor="cover_image">
        Portada
      </label>
      <input
        id="cover_image"
        name="cover_image"
        className="field-input"
        type="file"
        accept="image/*"
        onChange={(event) => setCoverFile(event.target.files?.[0] || null)}
        required={!isEditing}
      />

      <label className="field-label" htmlFor="content">
        Contenido
      </label>
      <textarea
        id="content"
        name="content"
        className="field-textarea"
        value={formData.content}
        onChange={handleChange}
        required
      />

      <label className="field-label" htmlFor="status">
        Estado
      </label>
      <select
        id="status"
        name="status"
        className="field-input"
        value={formData.status}
        onChange={handleChange}
      >
        <option value="draft">Borrador</option>
        <option value="published">Publicado</option>
      </select>

      {errorMessage ? <p className="error-text">{errorMessage}</p> : null}

      <div className="mt-1 flex flex-wrap gap-2">
        <button className="btn-primary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Guardando..." : isEditing ? "Guardar cambios" : "Guardar noticia"}
        </button>
        <button className="btn-secondary" type="button" onClick={onCancel}>
          Cancelar
        </button>
      </div>

      <div className="mt-2 rounded-xl border border-zinc-800 bg-zinc-950/60 p-4">
        <p className="mb-3 text-sm font-semibold text-zinc-300">Vista previa de card publica</p>
        <NewsPreviewCard
          article={{
            title: formData.title || "Titulo de la noticia",
            published_at: new Date().toISOString(),
            status: formData.status,
            cover_image: coverFile ? previewImageUrl : previewImageUrl || initialArticle?.cover_image,
          }}
        />
      </div>
    </form>
  );
}
