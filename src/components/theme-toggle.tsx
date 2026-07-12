"use client";

import { useSyncExternalStore } from "react";
import { useTheme } from "next-themes";
import { Moon, Sun } from "lucide-react";
import { motion } from "framer-motion";

const subscribeNever = () => () => {};

/** true solo tras la hidratación en el cliente; evita el mismatch de SSR con next-themes sin setState en un efecto. */
function useMounted() {
  return useSyncExternalStore(subscribeNever, () => true, () => false);
}

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const mounted = useMounted();

  const isDark = theme === "dark";

  return (
    <button
      type="button"
      aria-label={mounted ? (isDark ? "Activar modo claro" : "Activar modo oscuro") : "Cambiar tema"}
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="glass relative flex h-10 w-10 items-center justify-center rounded-full text-foreground transition-transform hover:scale-105 active:scale-95"
    >
      {mounted && (
        <motion.span
          key={isDark ? "moon" : "sun"}
          initial={{ rotate: -90, opacity: 0, scale: 0.6 }}
          animate={{ rotate: 0, opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          {isDark ? <Moon className="h-5 w-5" /> : <Sun className="h-5 w-5" />}
        </motion.span>
      )}
    </button>
  );
}
