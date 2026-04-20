import { useEffect, useState } from "react";

import { apiRequest } from "../lib/api";
import NewsPreviewCard from "./NewsPreviewCard";

const initialFormState = {
  title: "",
  category: "Liga Federal de Basquet",
  lead: "",
  content: "",
  status: "draft",
};

export default function ArticleForm({ token, initialArticle, onSaved, onCancel }) {
  const isEditing = Boolean(initialArticle?.slug);
  const [formData, setFormData] = useState(initialFormState);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [previewImageUrl, setPreviewImageUrl] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    if (!initialArticle) {
      setFormData(initialFormState);
      setUploadedFiles([]);
      setPreviewImageUrl("");
      return;
    }

    setFormData({
      title: initialArticle.title || "",
      category: initialArticle.category || "Liga Federal de Basquet",
      lead: initialArticle.lead || "",
      content: initialArticle.content || "",
      status: initialArticle.status || "draft",
    });
    setUploadedFiles([]);
    setPreviewImageUrl(initialArticle.images?.[0] || initialArticle.cover_image || "");
  }, [initialArticle]);

  useEffect(() => {
    if (uploadedFiles.length === 0) {
      return;
    }

    const objectUrl = URL.createObjectURL(uploadedFiles[0]);
    setPreviewImageUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [uploadedFiles]);

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  }

  function handleImagesChange(event) {
    const files = Array.from(event.target.files || []);
    setErrorMessage("");

    if (files.length === 0) {
      return;
    }

    const mergedFiles = [...uploadedFiles, ...files];
    const uniqueFiles = mergedFiles.filter((file, index, array) => {
      const firstIndex = array.findIndex(
        (candidate) =>
          candidate.name === file.name
          && candidate.size === file.size
          && candidate.lastModified === file.lastModified,
      );
      return firstIndex === index;
    });

    if (uniqueFiles.length > 5) {
      setErrorMessage("Solo se permiten hasta 5 fotos por noticia");
      setUploadedFiles(uniqueFiles.slice(0, 5));
      return;
    }

    setUploadedFiles(uniqueFiles);
  }

  function wrapSelectedText(event, targetId, prefix, suffix = prefix) {
    const textarea = event.currentTarget.form?.querySelector(`#${targetId}`);

    if (!textarea) {
      return;
    }

    const start = textarea.selectionStart ?? 0;
    const end = textarea.selectionEnd ?? 0;
    const selectedText = textarea.value.slice(start, end) || "texto";
    const updatedContent = `${textarea.value.slice(0, start)}${prefix}${selectedText}${suffix}${textarea.value.slice(end)}`;

    const targetName = textarea.name;
    setFormData((prev) => ({ ...prev, [targetName]: updatedContent }));

    requestAnimationFrame(() => {
      textarea.focus();
      textarea.setSelectionRange(start + prefix.length, start + prefix.length + selectedText.length);
    });
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setErrorMessage("");

    try {
      const payload = new FormData();
      payload.append("title", formData.title);
      payload.append("category", formData.category);
      payload.append("lead", formData.lead);
      payload.append("content", formData.content);
      payload.append("status", formData.status);

      if (uploadedFiles.length > 0) {
        uploadedFiles.forEach((file) => payload.append("uploaded_images", file));
      } else if (!isEditing) {
        throw new Error("Debes subir al menos una foto");
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
        setUploadedFiles([]);
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

      <section className="space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300">Seccion 1: Encabezado</p>

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

        <label className="field-label" htmlFor="category">
          Categoria
        </label>
        <input
          id="category"
          name="category"
          className="field-input"
          value={formData.category}
          onChange={handleChange}
          required
        />

        <label className="field-label" htmlFor="uploaded_images">
          Fotos (maximo 5)
        </label>
        <input
          id="uploaded_images"
          name="uploaded_images"
          className="field-input"
          type="file"
          multiple
          accept="image/*"
          onChange={handleImagesChange}
        />
        <p className="text-xs text-zinc-400">
          Si subis varias, la primera se usa como imagen principal de la noticia.
        </p>
        {uploadedFiles.length > 0 ? (
          <div className="rounded-lg border border-zinc-700/80 bg-zinc-950/50 p-3">
            <p className="text-xs font-semibold uppercase tracking-[0.06em] text-zinc-300">
              {uploadedFiles.length} foto(s) seleccionada(s)
            </p>
            <ul className="mt-2 space-y-1 text-xs text-zinc-400">
              {uploadedFiles.map((file) => (
                <li key={`${file.name}-${file.lastModified}`}>{file.name}</li>
              ))}
            </ul>
          </div>
        ) : null}
      </section>

      <section className="mt-4 space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300">Seccion 2: Bajada (debajo del titulo)</p>
        <div className="mb-2 flex gap-2">
          <button
            className="btn-secondary"
            type="button"
            onClick={(event) => wrapSelectedText(event, "lead", "**")}
          >
            Negrita
          </button>
        </div>
        <textarea
          id="lead"
          name="lead"
          className="field-input min-h-28 resize-y"
          value={formData.lead}
          onChange={handleChange}
          placeholder="Escribi aca la bajada que va arriba de la foto"
          required
        />
      </section>

      <section className="mt-4 space-y-3 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-4">
        <p className="text-sm font-semibold uppercase tracking-[0.08em] text-zinc-300">Seccion 3: Cuerpo (debajo de la foto)</p>
        <div className="mb-2 flex gap-2">
          <button
            className="btn-secondary"
            type="button"
            onClick={(event) => wrapSelectedText(event, "content", "**")}
          >
            Negrita
          </button>
        </div>
        <textarea
          id="content"
          name="content"
          className="field-textarea"
          value={formData.content}
          onChange={handleChange}
          placeholder="Escribi aca el desarrollo completo de la noticia"
          required
        />
      </section>

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
            category: formData.category || "Liga Federal de Basquet",
            published_at: new Date().toISOString(),
            status: formData.status,
            cover_image: previewImageUrl || initialArticle?.images?.[0] || initialArticle?.cover_image,
          }}
          imageFit="contain"
        />
        <p className="mt-3 text-xs text-zinc-400">
          En el home la imagen mantiene recorte para uniformidad. Al abrir la noticia se muestra completa.
        </p>
      </div>
    </form>
  );
}
