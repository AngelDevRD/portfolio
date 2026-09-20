"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2, AlertTriangle } from "lucide-react";
import { contactSchema, type ContactInput } from "@/lib/validations";
import { site } from "@/lib/site";
import { Field, inputClass } from "./field";

export function ContactForm() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [serverError, setServerError] = useState<string>("");
  // El backend responde `skipped: true` cuando no hay proveedor de correo
  // configurado. Antes se ignoraba y se mostraba "¡Mensaje enviado!" igual.
  const [skipped, setSkipped] = useState(false);

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
      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        throw new Error(json.error || "No se pudo enviar el mensaje");
      }
      setSkipped(json.skipped === true);
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
        role="status"
        aria-live="polite"
      >
        {skipped ? (
          <>
            <AlertTriangle className="h-14 w-14 text-amber-500" />
            <h3 className="text-xl font-semibold">Mensaje no entregado</h3>
            <p className="text-muted-foreground">
              El envío de correo no está configurado en este entorno, así que tu mensaje
              no llegó. Escribime directo a{" "}
              <a className="underline" href={`mailto:${site.email}`}>
                {site.email}
              </a>
              .
            </p>
          </>
        ) : (
          <>
            <CheckCircle2 className="h-14 w-14 text-emerald-500" />
            <h3 className="text-xl font-semibold">¡Mensaje enviado!</h3>
            <p className="text-muted-foreground">Gracias por escribir. Te responderé lo antes posible.</p>
          </>
        )}
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

      {status === "error" && (
        <p className="text-sm text-red-500" role="alert">
          {serverError}
        </p>
      )}

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
