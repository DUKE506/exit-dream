// src/components/portfolio/TPSLModal.tsx

"use client";

import { useState } from "react";
import { usePortfolioStore } from "@/store/portfolioStore";
import { Holding } from "@/types/portfolio";
import { Coin } from "@/types/coin";
import { formatPrice } from "@/lib/upbit";
import { Button } from "@/components/common/Button";

interface TPSLModalProps {
  holding: Holding;
  coin: Coin;
  currentPrice: number;
  onClose: () => void;
}

export function TPSLModal({
  holding,
  coin,
  currentPrice,
  onClose,
}: TPSLModalProps) {
  const { setTPSL } = usePortfolioStore();

  const [takeProfit, setTakeProfit] = useState<string>(
    holding.takeProfit?.toString() || "",
  );
  const [stopLoss, setStopLoss] = useState<string>(
    holding.stopLoss?.toString() || "",
  );

  const handleSave = () => {
    const tp = takeProfit ? parseFloat(takeProfit) : undefined;
    const sl = stopLoss ? parseFloat(stopLoss) : undefined;

    // 유효성 검사
    if (tp && tp <= currentPrice) {
      alert("목표가는 현재가보다 높아야 합니다!");
      return;
    }

    if (sl && sl >= currentPrice) {
      alert("손절가는 현재가보다 낮아야 합니다!");
      return;
    }

    setTPSL(holding.symbol, tp, sl);
    onClose();
  };

  const handleQuickSet = (type: "TP" | "SL", percent: number) => {
    if (type === "TP") {
      const value = Math.floor(currentPrice * (1 + percent / 100));
      setTakeProfit(value.toString());
    } else {
      const value = Math.floor(currentPrice * (1 - percent / 100));
      setStopLoss(value.toString());
    }
  };

  const profitRate = holding.takeProfit
    ? ((holding.takeProfit - holding.avgPrice) / holding.avgPrice) * 100
    : 0;

  const lossRate = holding.stopLoss
    ? ((holding.stopLoss - holding.avgPrice) / holding.avgPrice) * 100
    : 0;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4">
      <div className="bg-gray-800 rounded-xl max-w-md w-full p-6 border border-gray-700">
        {/* 헤더 */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold text-white">TP/SL 설정</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white text-2xl"
          >
            ×
          </button>
        </div>

        {/* 코인 정보 */}
        <div className="bg-gray-900 rounded-lg p-4 mb-6 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-400">코인</span>
            <span className="text-white font-medium">{coin.korean_name}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">평균 매수가</span>
            <span className="text-white font-medium">
              {formatPrice(holding.avgPrice)}원
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-400">현재가</span>
            <span className="text-white font-medium">
              {formatPrice(currentPrice)}원
            </span>
          </div>
        </div>

        {/* Take Profit 설정 */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            🎯 목표가 (Take Profit)
          </label>
          <input
            type="number"
            value={takeProfit}
            onChange={(e) => setTakeProfit(e.target.value)}
            placeholder={`현재가: ${formatPrice(currentPrice)}원`}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-green-500 focus:outline-none mb-2"
          />

          {/* 빠른 설정 */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[5, 10, 20, 30].map((percent) => (
              <button
                key={percent}
                onClick={() => handleQuickSet("TP", percent)}
                className="bg-green-600/20 hover:bg-green-600/30 text-green-400 py-1.5 rounded text-xs font-medium transition"
              >
                +{percent}%
              </button>
            ))}
          </div>

          {takeProfit && (
            <p className="text-xs text-green-400">
              예상 수익률: +{profitRate.toFixed(2)}%
            </p>
          )}
        </div>

        {/* Stop Loss 설정 */}
        <div className="mb-6">
          <label className="text-white font-semibold block mb-2">
            🛑 손절가 (Stop Loss)
          </label>
          <input
            type="number"
            value={stopLoss}
            onChange={(e) => setStopLoss(e.target.value)}
            placeholder={`현재가: ${formatPrice(currentPrice)}원`}
            className="w-full bg-gray-900 text-white px-4 py-3 rounded-lg border border-gray-700 focus:border-red-500 focus:outline-none mb-2"
          />

          {/* 빠른 설정 */}
          <div className="grid grid-cols-4 gap-2 mb-2">
            {[5, 10, 20, 30].map((percent) => (
              <button
                key={percent}
                onClick={() => handleQuickSet("SL", percent)}
                className="bg-red-600/20 hover:bg-red-600/30 text-red-400 py-1.5 rounded text-xs font-medium transition"
              >
                -{percent}%
              </button>
            ))}
          </div>

          {stopLoss && (
            <p className="text-xs text-red-400">
              예상 손실률: {lossRate.toFixed(2)}%
            </p>
          )}
        </div>

        {/* 안내 */}
        <div className="bg-blue-900/20 border border-blue-700/30 rounded-lg p-3 mb-6">
          <p className="text-blue-300 text-xs">
            💡 설정한 가격에 도달하면 자동으로 전량 매도됩니다.
          </p>
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
            variant="primary"
            size="lg"
            onClick={handleSave}
            className="flex-1"
          >
            저장
          </Button>
        </div>
      </div>
    </div>
  );
}
