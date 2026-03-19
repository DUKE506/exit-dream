export interface Holding {
  symbol: string; // 코인 심볼 (예: "KRW-BTC")
  amount: number; // 보유 수량
  avgPrice: number; // 평균 매수가
}

export interface Trade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  amount: number; // 수량
  price: number; // 체결 가격
  total: number; // 총액
  timestamp: number; // 거래 시간
}

export interface Portfolio {
  cash: number; // 보유 현금
  initialCash: number; // 초기 자금
  holdings: Holding[]; // 보유 코인
  trades: Trade[]; // 거래 내역
}
