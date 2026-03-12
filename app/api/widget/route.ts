import { NextRequest, NextResponse } from "next/server";
import { dbGet, dbSet, dbUpdatedAt } from "@/lib/db";

const KEY = "widget";

export async function GET() {
  try {
    const data = dbGet(KEY);
    if (!data) return NextResponse.json(null);
    return NextResponse.json({ ...data as object, _savedAt: dbUpdatedAt(KEY) });
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(request: NextRequest) {
  try {
    const widget = await request.json();
    dbSet(KEY, widget);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to save widget" }, { status: 500 });
  }
}
