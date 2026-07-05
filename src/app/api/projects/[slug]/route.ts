import { NextResponse } from "next/server";
import { getProjectRepository } from "@/lib/projects/factory";

export const revalidate = 1800;

export async function GET(_req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const project = await getProjectRepository().getBySlug(slug);
  if (!project) return NextResponse.json({ error: "No encontrado" }, { status: 404 });
  return NextResponse.json({ data: project });
}
