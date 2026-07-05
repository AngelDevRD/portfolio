"use client";

import { useRouter } from "next/navigation";
import { LogOut } from "lucide-react";

export function LogoutButton() {
  const router = useRouter();
  async function logout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.replace("/admin/login");
    router.refresh();
  }
  return (
    <button type="button" onClick={logout} className="btn-ghost">
      <LogOut className="h-4 w-4" /> Salir
    </button>
  );
}
