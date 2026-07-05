"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Lightbulb, CheckCircle2, Loader2 } from "lucide-react";
import { suggestionSchema, type SuggestionInput } from "@/lib/validations";
import { Field, inputClass } from "./field";

const categories = ["Web", "Android", "IA", "Herramientas", "Juegos", "Otra"];

export function SuggestionForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<SuggestionInput>({
    resolver: zodResolver(suggestionSchema),
    defaultValues: { recommend: "si", category: "" },
  });

  async function onSubmit(data: SuggestionInput) {
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/suggestions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "No se pudo enviar la sugerencia");
      }
      setStatus("success");
      reset();
    } catch (err) {
      setStatus("error");
      setServerError(err instanceof Error ? err.message : "Error inesperado");
    }
  }

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="card flex flex-col items-center gap-3 p-10 text-center"
      >
        <CheckCircle2 className="h-14 w-14 text-emerald-500" />
        <h3 className="text-xl font-semibold">¡Idea recibida!</h3>
        <p className="text-muted-foreground">Gracias por proponer. La revisaré con calma. 🙌</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-2">
          Proponer otra
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 sm:p-8" noValidate>
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="s-name" optional error={errors.name?.message}>
          <input id="s-name" className={inputClass(!!errors.name)} placeholder="Tu nombre" {...register("name")} />
        </Field>
        <Field label="Correo electrónico" htmlFor="s-email" error={errors.email?.message}>
          <input id="s-email" type="email" className={inputClass(!!errors.email)} placeholder="tucorreo@email.com" {...register("email")} />
        </Field>
      </div>

      <Field label="Título de la idea" htmlFor="s-title" error={errors.title?.message}>
        <input id="s-title" className={inputClass(!!errors.title)} placeholder="Ej. App para organizar recetas" {...register("title")} />
      </Field>

      <Field label="Descripción completa" htmlFor="s-desc" error={errors.description?.message}>
        <textarea id="s-desc" rows={4} className={inputClass(!!errors.description)} placeholder="Describe cómo la imaginas…" {...register("description")} />
      </Field>

      <Field label="¿Por qué la descargarías?" htmlFor="s-reason" optional error={errors.reason?.message}>
        <textarea id="s-reason" rows={2} className={inputClass(!!errors.reason)} placeholder="Qué te aportaría…" {...register("reason")} />
      </Field>

      <Field label="¿Qué problema resolvería?" htmlFor="s-problem" optional error={errors.problem?.message}>
        <textarea id="s-problem" rows={2} className={inputClass(!!errors.problem)} placeholder="El dolor que quita…" {...register("problem")} />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Categoría" htmlFor="s-category" error={errors.category?.message}>
          <select id="s-category" className={inputClass(!!errors.category)} {...register("category")}>
            <option value="">Elige una…</option>
            {categories.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </Field>
        <Field label="¿La recomendarías?" htmlFor="s-recommend" error={errors.recommend?.message}>
          <select id="s-recommend" className={inputClass(!!errors.recommend)} {...register("recommend")}>
            <option value="si">Sí, sin duda</option>
            <option value="quiza">Quizá</option>
            <option value="no">No estoy segura</option>
          </select>
        </Field>
      </div>

      {status === "error" && <p className="text-sm text-red-500">{serverError}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Lightbulb className="h-4 w-4" /> Enviar sugerencia
          </>
        )}
      </button>
    </form>
  );
}
