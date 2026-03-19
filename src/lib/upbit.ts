import { Coin, CoinPrice } from "@/types/coin";

const UPBIT_API_URL = "https://api.upbit.com/v1";

// 전체 코인 마켓 정보 가져오기
export async function getAllMarkets(): Promise<Coin[]> {
  try {
    const response = await fetch(`${UPBIT_API_URL}/market/all?isDetails=true`);
    const data = await response.json();
    return data.filter((coin: any) => coin.market.startsWith("KRW-"));
  } catch (error) {
    console.error("Failed to fetch markets:", error);
    return [];
  }
}

// 주요 코인 10개
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
  ];

  return allMarkets
    .filter((coin) => topSymbols.includes(coin.market))
    .sort(
      (a, b) => topSymbols.indexOf(a.market) - topSymbols.indexOf(b.market),
    );
}

// 현재 시세 조회
export async function getCurrentPrices(
  markets: string[],
): Promise<CoinPrice[]> {
  try {
    const marketString = markets.join(",");
    const response = await fetch(
      `${UPBIT_API_URL}/ticker?markets=${marketString}`,
    );
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

// 한국 숫자 포맷 (억/만)
export function formatKoreanNumber(num: number): string {
  if (num >= 100000000) {
    return `${(num / 100000000).toFixed(1)}억`;
  } else if (num >= 10000) {
    return `${(num / 10000).toFixed(0)}만`;
  }
  return formatPrice(num);
}
