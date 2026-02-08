import { NextRequest, NextResponse } from "next/server";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

export async function OPTIONS() {
  return new NextResponse(null, { status: 204, headers: corsHeaders });
}

export async function GET(req: NextRequest) {
  const url = req.nextUrl.searchParams.get("url");

  if (!url) {
    return NextResponse.json(
      { error: "Missing url parameter" },
      { status: 400, headers: corsHeaders }
    );
  }

  // Basic validation: only allow https URLs
  if (!url.startsWith("https://")) {
    return NextResponse.json(
      { error: "Only HTTPS URLs are allowed" },
      { status: 400, headers: corsHeaders }
    );
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    return NextResponse.json(data, { headers: corsHeaders });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch from the provided URL" },
      { status: 502, headers: corsHeaders }
    );
  }
}
