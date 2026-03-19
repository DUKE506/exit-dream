// src/components/portfolio/HoldingItem.tsx

"use client";

import { Holding } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { formatPrice, formatKoreanNumber } from "@/lib/upbit";
import { Button } from "@/components/common/Button";

interface HoldingItemProps {
  holding: Holding;
  coin: Coin | undefined;
  currentPrice: number;
  onSellClick: (symbol: string) => void;
}

export function HoldingItem({
  holding,
  coin,
  currentPrice,
  onSellClick,
}: HoldingItemProps) {
  // 평가 금액
  const evaluation = holding.amount * currentPrice;

  // 손익 금액
  const profitAmount = evaluation - holding.amount * holding.avgPrice;

  // 손익률
  const profitRate =
    ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;

  const isProfit = profitRate >= 0;

  return (
    <div className="bg-gray-800 rounded-lg p-5 border border-gray-700 hover:border-gray-600 transition-all">
      <div className="flex items-center justify-between mb-4">
        {/* 코인 정보 */}
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h3 className="text-xl font-bold text-white">
              {coin?.korean_name || holding.symbol}
            </h3>
            <span className="text-sm text-gray-400">
              {holding.symbol.replace("KRW-", "")}
            </span>
          </div>
          <p className="text-gray-400 text-sm">
            보유 수량: {holding.amount.toFixed(8)}
          </p>
        </div>

        {/* 매도 버튼 */}
        <Button
          variant="danger"
          size="md"
          onClick={() => onSellClick(holding.symbol)}
        >
          매도
        </Button>
      </div>

      {/* 가격 정보 */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 평균 매수가 */}
        <div>
          <p className="text-gray-400 text-xs mb-1">평균 매수가</p>
          <p className="text-white font-semibold">
            {formatPrice(holding.avgPrice)}원
          </p>
        </div>

        {/* 현재가 */}
        <div>
          <p className="text-gray-400 text-xs mb-1">현재가</p>
          <p className="text-white font-semibold">
            {formatPrice(currentPrice)}원
          </p>
        </div>

        {/* 평가 금액 */}
        <div>
          <p className="text-gray-400 text-xs mb-1">평가 금액</p>
          <p className="text-white font-semibold">
            {formatKoreanNumber(evaluation)}원
          </p>
        </div>

        {/* 손익 */}
        <div>
          <p className="text-gray-400 text-xs mb-1">손익</p>
          <div>
            <p
              className={`font-bold ${
                isProfit ? "text-red-500" : "text-blue-500"
              }`}
            >
              {isProfit ? "+" : ""}
              {profitRate.toFixed(2)}%
            </p>
            <p
              className={`text-sm ${
                isProfit ? "text-red-400" : "text-blue-400"
              }`}
            >
              {isProfit ? "+" : ""}
              {formatKoreanNumber(profitAmount)}원
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
