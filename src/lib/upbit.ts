// src/lib/upbit.ts

import { Coin, CoinPrice } from "@/types/coin";

const API_BASE = "/api/upbit"; // Vercel API Route

// 전체 코인 마켓 정보 가져오기
export async function getAllMarkets(): Promise<Coin[]> {
  try {
    const response = await fetch(`${API_BASE}/markets`);
    const data = await response.json();
    return data.filter((coin: any) => coin.market.startsWith("KRW-"));
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return [];
  }
}

// 주요 코인 30개
export async function getTopCoins(): Promise<Coin[]> {
  const allMarkets = await getAllMarkets();

  const topSymbols = [
    "KRW-BTC",
    "KRW-ETH",
    "KRW-XRP",
    "KRW-SOL",
    "KRW-DOGE",
    "KRW-ADA",
    "KRW-AVAX",
    "KRW-MATIC",
    "KRW-DOT",
    "KRW-LINK",
    "KRW-TRX",
    "KRW-ATOM",
    "KRW-SUI",
    "KRW-HBAR",
    "KRW-TON",
    "KRW-APT",
    "KRW-STX",
    "KRW-IMX",
    "KRW-INJ",
    "KRW-NEAR",
    "KRW-ETC",
    "KRW-ARB",
    "KRW-OP",
    "KRW-SEI",
    "KRW-AAVE",
    "KRW-PEPE",
    "KRW-SHIB",
    "KRW-UNI",
    "KRW-LTC",
    "KRW-BCH",
  ];

  return allMarkets
    .filter((coin) => topSymbols.includes(coin.market))
    .sort(
      (a, b) => topSymbols.indexOf(a.market) - topSymbols.indexOf(b.market),
    );
}

// 현재 시세 조회 (사용 안 함 - WebSocket 사용)
export async function getCurrentPrices(
  markets: string[],
): Promise<CoinPrice[]> {
  try {
    const marketString = markets.join(",");
    const response = await fetch(`${API_BASE}/ticker?markets=${marketString}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Failed to fetch prices:", error);
    return [];
  }
}

// 가격 포맷팅
export function formatPrice(price: number): string {
  return new Intl.NumberFormat("ko-KR").format(Math.floor(price));
}

// 변화율 포맷팅
export function formatChangeRate(rate: number): string {
  const percentage = (rate * 100).toFixed(2);
  return rate >= 0 ? `+${percentage}%` : `${percentage}%`;
}

// 한국 숫자 포맷
export function formatKoreanNumber(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}만`;
  }
  return formatPrice(num);
}
