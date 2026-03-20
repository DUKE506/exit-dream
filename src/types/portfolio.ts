export interface Holding {
  symbol: string;
  amount: number;
  avgPrice: number;
  // TP/SL 추가
  takeProfit?: number; // 목표가 (이 가격 이상이면 자동 매도)
  stopLoss?: number; // 손절가 (이 가격 이하면 자동 매도)
}

export interface Trade {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  amount: number;
  price: number;
  total: number;
  timestamp: number;
  // 자동 매도 여부 추가
  autoSell?: boolean; // TP/SL에 의한 자동 매도인지
  autoSellType?: "TP" | "SL"; // 어떤 조건으로 매도되었는지
}
export interface Portfolio {
  cash: number; // 보유 현금
  initialCash: number; // 초기 자금
  holdings: Holding[]; // 보유 코인
  trades: Trade[]; // 거래 내역
}
