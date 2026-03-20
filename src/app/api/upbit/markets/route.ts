import { NextResponse } from "next/server";

export async function GET() {
  try {
    const response = await fetch(
      "https://api.upbit.com/v1/market/all?isDetails=true",
    );
    const data = await response.json();

    return NextResponse.json(data);
  } catch (error) {
    console.error("Upbit API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch markets" },
      { status: 500 },
    );
  }
}
