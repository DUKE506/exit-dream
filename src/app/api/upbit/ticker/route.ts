// src/app/api/upbit/ticker/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const markets = searchParams.get("markets");

  if (!markets) {
    return NextResponse.json(
      { error: "Markets parameter required" },
      { status: 400 },
    );
  }

  try {
    const response = await fetch(
      `https://api.upbit.com/v1/ticker?markets=${markets}`,
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upbit API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch ticker" },
      { status: 500 },
    );
  }
}
