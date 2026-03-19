// src/components/portfolio/TradeItem.tsx

"use client";

import { Trade } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { formatPrice, formatKoreanNumber } from "@/lib/upbit";

interface TradeItemProps {
  trade: Trade;
  coin: Coin | undefined;
}

export function TradeItem({ trade, coin }: TradeItemProps) {
  const isBuy = trade.type === "BUY";

  // 날짜 포맷팅
  const date = new Date(trade.timestamp);
  const dateString = date.toLocaleDateString("ko-KR", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });
  const timeString = date.toLocaleTimeString("ko-KR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });

  return (
    <div className="bg-gray-800 rounded-lg p-4 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between">
        {/* 왼쪽: 거래 정보 */}
        <div className="flex items-center gap-4">
          {/* 매수/매도 뱃지 */}
          <div
            className={`px-3 py-1 rounded-lg font-bold text-sm ${
              isBuy ? "bg-green-600 text-white" : "bg-red-600 text-white"
            }`}
          >
            {isBuy ? "매수" : "매도"}
          </div>

          {/* 코인 정보 */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-bold text-white">
                {coin?.korean_name || trade.symbol}
              </h3>
              <span className="text-sm text-gray-400">
                {trade.symbol.replace("KRW-", "")}
              </span>
            </div>
            <p className="text-gray-400 text-sm">
              {dateString} {timeString}
            </p>
          </div>
        </div>

        {/* 오른쪽: 수량 및 금액 */}
        <div className="text-right">
          <div className="mb-1">
            <span className="text-gray-400 text-sm">수량: </span>
            <span className="text-white font-medium">
              {trade.amount.toFixed(8)}
            </span>
          </div>
          <div className="mb-1">
            <span className="text-gray-400 text-sm">가격: </span>
            <span className="text-white font-medium">
              {formatPrice(trade.price)}원
            </span>
          </div>
          <div>
            <span className="text-gray-400 text-sm">총액: </span>
            <span className="text-white font-bold text-lg">
              {formatKoreanNumber(trade.total)}원
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
