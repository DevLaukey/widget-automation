import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbSetWithTimestamp, dbUpdatedAt } from "@/lib/db";

const KEY = "widget";

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
    const widget = await request.json();
    await dbSetWithTimestamp(KEY, widget);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save widget" }, { status: 500 });
  }
}
