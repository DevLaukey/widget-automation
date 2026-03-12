import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbSetWithTimestamp, dbUpdatedAt } from "@/lib/db";

const KEY = "bjj";

export async function GET() {
  try {
    const data = await dbGet(KEY);
    if (!data) return NextResponse.json(null);
    const savedAt = await dbUpdatedAt(KEY);
    return NextResponse.json({ ...data as object, _savedAt: savedAt });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    // Strip expired events before persisting
    if (Array.isArray(body.events)) {
      body.events = body.events.filter(
        (e: { expiresAt: string }) => new Date(e.expiresAt).getTime() > Date.now()
      );
    }
    await dbSetWithTimestamp(KEY, body);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save BJJ data" }, { status: 500 });
  }
}
