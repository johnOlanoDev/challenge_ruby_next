import { NextResponse } from "next/server";

const BASE_URL = process.env.RAILS_API_URL;

export async function POST(
  req: Request,
  { params }: { params: { id: string } },
) {
  const projectId = params.id;
  const body = await req.json();

  const res = await fetch(`${BASE_URL}/api/v1/projects/${projectId}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  const data = await res.json();
  return NextResponse.json(data, { status: res.status });
}
