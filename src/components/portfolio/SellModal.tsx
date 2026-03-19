// src/components/portfolio/SellModal.tsx

"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Holding } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { formatPrice, formatKoreanNumber } from "@/lib/upbit";
import { Button } from "@/components/common/Button";

interface SellModalProps {
  holding: Holding;
  coin: Coin;
  currentPrice: number;
  onClose: () => void;
}

export function SellModal({
  holding,
  coin,
  currentPrice,
  onClose,
}: SellModalProps) {
  const { sellCoin } = usePortfolioStore();
  const [amount, setAmount] = useState<string>("");

  const numAmount = parseFloat(amount) || 0;
  const totalPrice = numAmount * currentPrice;
  const canSell = numAmount > 0 && numAmount <= holding.amount;

  // 손익 계산
  const profitAmount = (currentPrice - holding.avgPrice) * numAmount;
  const profitRate =
    ((currentPrice - holding.avgPrice) / holding.avgPrice) * 100;
  const isProfit = profitRate >= 0;

  const handleSell = () => {
    if (!canSell) return;

    sellCoin(coin.market, numAmount, currentPrice);
    onClose();
  };

  const handlePercentClick = (percent: number) => {
    const sellAmount = holding.amount * (percent / 100);
    setAmount(sellAmount.toFixed(8));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">
            {coin.korean_name} 매도
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 보유 정보 */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">보유 수량</span>
            <span className="text-white font-medium">
              {holding.amount.toFixed(8)} {coin.market.replace("KRW-", "")}
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">평균 매수가</span>
            <span className="text-white font-medium">
              {formatPrice(holding.avgPrice)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">현재가</span>
            <span className="text-white font-medium">
              {formatPrice(currentPrice)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">수익률</span>
            <span
              className={`font-bold ${
                isProfit ? "text-red-500" : "text-blue-500"
              }`}
            >
              {isProfit ? "+" : ""}
              {profitRate.toFixed(2)}%
            </span>
          </div>
        </div>

        {/* 매도 수량 입력 */}
        <div className="mb-4">
          <label className="text-gray-400 text-sm block mb-2">매도 수량</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0"
            max={holding.amount}
            step="0.00000001"
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-blue-500 focus:outline-none text-lg"
          />
        </div>

        {/* 퍼센트 버튼 */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[25, 50, 75, 100].map((percent) => (
            <button
              key={percent}
              onClick={() => handlePercentClick(percent)}
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 rounded-lg text-sm font-medium transition"
            >
              {percent}%
            </button>
          ))}
        </div>

        {/* 주문 정보 */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">매도 금액</span>
            <span className="text-white font-medium">
              {formatKoreanNumber(totalPrice)}원
            </span>
          </div>
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">예상 손익</span>
            <span
              className={`font-bold ${
                isProfit ? "text-red-500" : "text-blue-500"
              }`}
            >
              {isProfit ? "+" : ""}
              {formatKoreanNumber(profitAmount)}원
            </span>
          </div>
        </div>

        {/* 버튼 */}
        <div className="flex gap-3">
          <Button
            variant="secondary"
            size="lg"
            onClick={onClose}
            className="flex-1"
          >
            취소
          </Button>
          <Button
            variant="danger"
            size="lg"
            onClick={handleSell}
            disabled={!canSell}
            className="flex-1"
          >
            {!canSell && numAmount > holding.amount ? "수량 초과" : "매도하기"}
          </Button>
        </div>
      </div>
    </div>
  );
}
