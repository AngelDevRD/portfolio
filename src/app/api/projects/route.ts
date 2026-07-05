import { NextResponse } from "next/server";
import { getProjectRepository } from "@/lib/projects/factory";
import { parseFilterFromRequest } from "@/lib/projects/filter";

export const revalidate = 1800;

export async function GET(req: Request) {
  const data = await getProjectRepository().getAll(parseFilterFromRequest(req));
  return NextResponse.json({ data });
}
