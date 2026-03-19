export interface Coin {
  market: string; // 예: "KRW-BTC"
  korean_name: string; // 예: "비트코인"
  english_name: string; // 예: "Bitcoin"
}

export interface CoinPrice {
  market: string; // 마켓 코드
  trade_price: number; // 현재가
  signed_change_rate: number; // 변화율
  signed_change_price: number; // 변화 금액
  acc_trade_volume_24h: number; // 24시간 거래량
}

export interface WebSocketTickerData {
  type: string;
  code: string; // 마켓 코드
  trade_price: number; // 현재가
  signed_change_rate: number; // 전일 대비 등락률
  signed_change_price: number; // 전일 대비 가격 변화
  acc_trade_volume_24h: number; // 24시간 누적 거래량
}
