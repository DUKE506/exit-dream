// src/app/api/upbit/candles/route.ts

import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const market = searchParams.get("market");
  const timeframe = searchParams.get("timeframe") || "60";
  const count = searchParams.get("count") || "200";

  if (!market) {
    return NextResponse.json(
      { error: "Market parameter required" },
      { status: 400 },
    );
  }

  try {
    let endpoint = "";

    if (timeframe === "D") {
      endpoint = `https://api.upbit.com/v1/candles/days?market=${market}&count=${count}`;
    } else {
      endpoint = `https://api.upbit.com/v1/candles/minutes/${timeframe}?market=${market}&count=${count}`;
    }

    const response = await fetch(endpoint);
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upbit API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch candles" },
      { status: 500 },
    );
  }
}
