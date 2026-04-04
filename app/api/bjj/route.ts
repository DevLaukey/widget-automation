import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbSet, dbSetWithTimestamp, dbUpdatedAt } from "@/lib/db";

const KEY = "bjj";

const CORS = {
  "Access-Control-Allow-Origin":  "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

// Preflight for cross-origin embeds (e.g. Squarespace)
export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: CORS });
}

export async function GET() {
  try {
    const data = await dbGet(KEY);
    if (!data) return NextResponse.json(null, { headers: CORS });
    const savedAt = await dbUpdatedAt(KEY);
    return NextResponse.json({ ...data as object, _savedAt: savedAt }, { headers: CORS });
  } catch {
    return NextResponse.json(null, { headers: CORS });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Preserve stoppedAttack so editor saves don't wipe the widget's stopped state
    const existing = (await dbGet<Record<string, unknown>>(KEY)) ?? {};
    const toSave = existing.stoppedAttack !== undefined
      ? { ...body, stoppedAttack: existing.stoppedAttack }
      : body;
    await dbSetWithTimestamp(KEY, toSave);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save BJJ data" }, { status: 500 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const { stoppedAttack } = await request.json();
    const existing = (await dbGet<Record<string, unknown>>(KEY)) ?? {};
    await dbSet(KEY, { ...existing, stoppedAttack });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save stopped attack" }, { status: 500 });
  }
}
