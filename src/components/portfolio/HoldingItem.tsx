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
  onTPSLClick: (symbol: string) => void;
}

export function HoldingItem({
  holding,
  coin,
  currentPrice,
  onSellClick,
  onTPSLClick,
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
            {/* TP/SL 뱃지 추가 */}
            {(holding.takeProfit || holding.stopLoss) && (
              <span className="text-xs bg-blue-600 text-white px-2 py-0.5 rounded-full">
                TP/SL
              </span>
            )}
          </div>
          <p className="text-gray-400 text-sm">
            보유 수량: {holding.amount.toFixed(8)}
          </p>
        </div>

        {/* 버튼들 수정 */}
        <div className="flex gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => onTPSLClick(holding.symbol)}
          >
            TP/SL
          </Button>
          <Button
            variant="danger"
            size="md"
            onClick={() => onSellClick(holding.symbol)}
          >
            매도
          </Button>
        </div>
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
      {/* TP/SL 정보 추가 */}
      {(holding.takeProfit || holding.stopLoss) && (
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-4 text-sm">
            {holding.takeProfit && (
              <div className="bg-green-900/20 border border-green-700/30 rounded-lg p-3">
                <p className="text-green-400 text-xs mb-1">🎯 목표가</p>
                <p className="text-white font-semibold">
                  {formatPrice(holding.takeProfit)}원
                </p>
                <p className="text-green-400 text-xs mt-1">
                  +
                  {(
                    ((holding.takeProfit - currentPrice) / currentPrice) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            )}

            {holding.stopLoss && (
              <div className="bg-red-900/20 border border-red-700/30 rounded-lg p-3">
                <p className="text-red-400 text-xs mb-1">🛑 손절가</p>
                <p className="text-white font-semibold">
                  {formatPrice(holding.stopLoss)}원
                </p>
                <p className="text-red-400 text-xs mt-1">
                  {(
                    ((holding.stopLoss - currentPrice) / currentPrice) *
                    100
                  ).toFixed(2)}
                  %
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
