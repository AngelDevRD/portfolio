"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { Field, inputClass } from "./field";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<ContactInput>({ resolver: zodResolver(contactSchema) });

  async function onSubmit(data: ContactInput) {
    setStatus("loading");
    setServerError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const j = await res.json().catch(() => ({}));
        throw new Error(j.error || "No se pudo enviar el mensaje");
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
        <h3 className="text-xl font-semibold">¡Mensaje enviado!</h3>
        <p className="text-muted-foreground">Gracias por escribir. Te responderé lo antes posible.</p>
        <button type="button" onClick={() => setStatus("idle")} className="btn-secondary mt-2">
          Enviar otro
        </button>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="card space-y-5 p-6 sm:p-8" noValidate>
      {/* Honeypot */}
      <input type="text" tabIndex={-1} autoComplete="off" className="hidden" {...register("company")} />

      <div className="grid gap-5 sm:grid-cols-2">
        <Field label="Nombre" htmlFor="c-name" error={errors.name?.message}>
          <input id="c-name" className={inputClass(!!errors.name)} placeholder="Tu nombre" {...register("name")} />
        </Field>
        <Field label="Correo electrónico" htmlFor="c-email" error={errors.email?.message}>
          <input id="c-email" type="email" className={inputClass(!!errors.email)} placeholder="tucorreo@email.com" {...register("email")} />
        </Field>
      </div>

      <Field label="Asunto" htmlFor="c-subject" error={errors.subject?.message}>
        <input id="c-subject" className={inputClass(!!errors.subject)} placeholder="¿De qué quieres hablar?" {...register("subject")} />
      </Field>

      <Field label="Mensaje" htmlFor="c-message" error={errors.message?.message}>
        <textarea id="c-message" rows={5} className={inputClass(!!errors.message)} placeholder="Cuéntame sobre tu proyecto o idea…" {...register("message")} />
      </Field>

      {status === "error" && <p className="text-sm text-red-500">{serverError}</p>}

      <button type="submit" disabled={status === "loading"} className="btn-primary w-full">
        {status === "loading" ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Enviando…
          </>
        ) : (
          <>
            <Send className="h-4 w-4" /> Enviar mensaje
          </>
        )}
      </button>
    </form>
  );
}
